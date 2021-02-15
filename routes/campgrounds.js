const express = require("express");
const router = express.Router();
const campgroundController = require("../controllers/campgrounds");

const {
    isLoggedIn,
    validateCampground,
    isAuth
} = require("../middleware");


//DEFINING REST ROUTES
router.route("/")
    .get(campgroundController.index)
    .post(validateCampground, isLoggedIn, campgroundController.createCampground);

router.get("/new", isLoggedIn, campgroundController.renderNewForm);

router.route("/:id")
    .get(campgroundController.getCampgroundDetail)
    .put(validateCampground, isLoggedIn, isAuth, campgroundController.editCampground)
    .delete(isLoggedIn, isAuth, campgroundController.deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuth, campgroundController.renderEditForm);

module.exports = router;