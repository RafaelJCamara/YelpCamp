const express = require("express");
const router = express.Router({mergeParams:true});
const {
    validateReview,
    isLoggedIn,
    isReviewAuth
} = require("../middleware");
const reviewsController = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, reviewsController.createReview);

router.delete("/:reviewId", isLoggedIn, isReviewAuth ,reviewsController.deleteReview);

module.exports = router;