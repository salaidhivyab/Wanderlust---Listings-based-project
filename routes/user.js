const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});


//passport.auth is a middle used for authentication in post route, local authentication hence local
//redirect to login if failed, with failure flash

router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) ,async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let path = res.locals.redirectUrl;
    if(path == undefined){
        path = "/listings";
    }
    res.redirect(path);
    //passport gives problem, resets req.session by default after success
});

//GET logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => { //is a callback parametered, hence takes err
        if(err){
            return next(err);
        }
        else{
            req.flash("success", "You are logged out!");
        }
        res.redirect("/listings");
    });
});

module.exports = router;