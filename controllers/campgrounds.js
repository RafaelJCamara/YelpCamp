const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground.js");
const {
    campgroundSchema
} = require("../schemas");
const ExpressError = require("../utils/ExpressError");

module.exports.index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", {
        campgrounds
    });
});

module.exports.renderNewForm = (req, res) => {
    res.render("campground/new");
};

module.exports.getCampgroundDetail = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!campground) {
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campground/show", {
        campground
    });
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campground/edit", {
        campground
    });
});

module.exports.editCampground = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Successfully updated campground!");
    res.redirect("/campgrounds");
});

module.exports.createCampground = catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    //add flash success
    req.flash("success", "Successfully made a new campground!");
    res.redirect("/campgrounds");
});

module.exports.deleteCampground = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
});