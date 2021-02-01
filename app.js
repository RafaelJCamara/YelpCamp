const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const methodOverride = require("method-override");

//connect to database

//part 1
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

//part 2
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected...");
});

//views and view engine settings
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//other settings
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//ROUTES 

app.get("/", (req,res)=>{
    res.render("home");
});


//DEFINING REST ROUTES

app.get("/campgrounds", async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render("campground/index",{campgrounds});
});

app.get("/campgrounds/:id", async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/show", {campground});
});


app.get("/campgrounds/:id/edit", async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/edit",{campground});
});

app.put("/campgrounds/:id", async (req,res)=>{
    const {id} = req.params;
    console.log(req.body);
});

app.listen(3000, ()=>{
    console.log("Listening on port 3000....");
});