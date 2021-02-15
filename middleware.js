const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const {
    reviewSchema
} = require("./schemas");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    //isAuthenticated comes from passport
    if(!req.isAuthenticated()){
        //URL to redirect user to, if he wants to go there first but is not logged in
        req.session.returnTo = req.originalUrl;
        req.flash("error","You must be signed in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {
        error
    } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

module.exports.validateCampground = (req, res, next) => {
    const {
        error
    } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

module.exports.isAuth = async (req,res,next) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error","You do not have permissions to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuth = async (req, res, next) => {
    const {
        id,
        reviewId
    } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permissions to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}