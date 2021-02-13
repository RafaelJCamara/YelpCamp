const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req,res)=>{
    res.render("users/register");
});

router.post("/register", async (req,res)=>{
    try{
        const {username, email, password} = req.body;
        const user = new User({email,username});
        //register user with passport
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err)
            req.flash("success", "Welcome to YelpCamp");
            res.redirect("/campgrounds");
        });
    }catch(e){
        //error occured
        req.flash("error",e.message);
        res.redirect("register");
    }
});

router.get("/login", (req,res)=>{
    res.render("users/login");
});

router.post("/login", passport.authenticate("local",{failureFlash:true, failureRedirect:"/login"}) , (req,res)=>{
    req.flash("success","Welcome back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get("/logout", (req,res)=>{
    req.logout();
    req.flash("success","Logout with success!");
    res.redirect("/campgrounds");
});

module.exports = router;