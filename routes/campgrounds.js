const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground.js");
const {campgroundSchema} = require("../schemas");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn} = require("../middleware");


//Middleware definition
const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

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
    const campground = await Campground.findById(id).populate("reviews");
    if(!campground){
        req.flash("error","Cannot find campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campground/show", {
        campground
    });
}));

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
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

router.put("/:id", validateCampground, isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Successfully updated campground!");
    res.redirect("/campgrounds");
}));

router.post("/", validateCampground, isLoggedIn, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    //add flash success
    req.flash("success","Successfully made a new campground!");
    res.redirect("/campgrounds");
}));

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
}));

module.exports = router;