const express = require("express");
const router = express.Router();
const campgroundController = require("../controllers/campgrounds");
const {
    isLoggedIn,
    validateCampground,
    isAuth
} = require("../middleware");
const multer = require("multer");
//don't need to specify the index.js file, since node automatically searchs for it
const {storage} = require("../cloudinary");
const upload = multer({storage});

//DEFINING REST ROUTES
router.route("/")
    .get(campgroundController.index)
    .post(isLoggedIn, upload.array("image"), validateCampground, campgroundController.createCampground);

router.get("/new", isLoggedIn, campgroundController.renderNewForm);

router.route("/:id")
    .get(campgroundController.getCampgroundDetail)
    .put(isLoggedIn, isAuth, upload.array("image"), validateCampground, campgroundController.editCampground)
    .delete(isLoggedIn, isAuth, campgroundController.deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuth, campgroundController.renderEditForm);

module.exports = router;