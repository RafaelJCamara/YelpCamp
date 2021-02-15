const express = require("express");
const router = express.Router();
const passport = require("passport");
const usersController = require("../controllers/users");

router.route("/register")
    .get(usersController.renderRegisterForm)
    .post(usersController.createNewUser);

router.route("/login")
    .get(usersController.renderLoginPage)
    .post(passport.authenticate("local",{failureFlash:true, failureRedirect:"/login"}) , usersController.afterSuccessLogin);

router.get("/logout", usersController.logout);

module.exports = router;