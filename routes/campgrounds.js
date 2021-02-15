const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground.js");
const {campgroundSchema} = require("../schemas");
const ExpressError = require("../utils/ExpressError");
const {
    isLoggedIn,
    validateCampground,
    isAuth
} = require("../middleware");


//DEFINING REST ROUTES
router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", {
        campgrounds
    });
}));
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campground/new");
});

router.get("/:id", catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("author");
    if(!campground){
        req.flash("error","Cannot find campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campground/show", {
        campground
    });
}));

router.get("/:id/edit", isLoggedIn, isAuth, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campground/edit", {
        campground
    });
}));

router.put("/:id", validateCampground, isLoggedIn, isAuth, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Successfully updated campground!");
    res.redirect("/campgrounds");
}));

router.post("/", validateCampground, isLoggedIn, isAuth, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    //add flash success
    req.flash("success","Successfully made a new campground!");
    res.redirect("/campgrounds");
}));

router.delete("/:id", isLoggedIn, isAuth, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
}));

module.exports = router;