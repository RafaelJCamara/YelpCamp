const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const campgroudRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");

//connect to database

//part 1
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
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

//use static files
app.use(express.static(path.join(__dirname,"public")));

//configure session
const sessionConfig = {
    secret:"thisshouldbeabettersecret!",
    resave:false,
    saveUninitialized:true,
    //settings for the cookie
    cookie:{
        httpOnly:true,
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: Date.now() + 7 * 24 * 60 * 60 * 1000
    }
}
app.use(session(sessionConfig));

//flash configuration
app.use(flash());

//flash middleware
app.use( (req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
} );


//ROUTES 

app.get("/", (req, res) => {
    res.render("home");
});

//using campground router
app.use("/campgrounds",campgroudRouter);

//using reviews router
app.use("/campgrounds/:id/reviews", reviewRouter);


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