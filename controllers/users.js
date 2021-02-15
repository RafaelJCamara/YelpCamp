const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
};

module.exports.createNewUser = async (req, res) => {
    try {
        const {
            username,
            email,
            password
        } = req.body;
        const user = new User({
            email,
            username
        });
        //register user with passport
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash("success", "Welcome to YelpCamp");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        //error occured
        req.flash("error", e.message);
        res.redirect("register");
    }
};

module.exports.renderLoginPage = (req, res) => {
    res.render("users/login");
};

module.exports.afterSuccessLogin = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Logout with success!");
    res.redirect("/campgrounds");
};