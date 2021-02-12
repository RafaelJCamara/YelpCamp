const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const {
    campgroundSchema, reviewSchema
} = require("./schemas");
const Review = require("./models/review");


//connect to database

//part 1
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//part 2
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected...");
});

//setting engine
app.engine("ejs", ejsMate);

//views and view engine settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//other settings
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));


const validateCampground = (req, res, next) => {
    const {
        error
    } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    }else{
        next();
    }
};

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

//ROUTES 

app.get("/", (req, res) => {
    res.render("home");
});


//DEFINING REST ROUTES

app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", {
        campgrounds
    });
}));

app.get("/campgrounds/new", (req, res) => {
    res.render("campground/new");
});

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campground/show", {
        campground
    });
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/edit", {
        campground
    });
}));

app.put("/campgrounds/:id", validateCampground ,catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect("/campgrounds");
}));

app.post("/campgrounds", validateCampground,catchAsync(async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect("/campgrounds");
}));

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync( async (req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{
        $pull : {reviews:reviewId}
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

//404 route
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

//error handling
app.use((err, req, res, next) => {
    const {
        statusCode = 500, message = "Something went wrong"
    } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong..."
    res.status(statusCode).render("error", {
        err
    });
});

//starting server
app.listen(3000, () => {
    console.log("Listening on port 3000....");
});