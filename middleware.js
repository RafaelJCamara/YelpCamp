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