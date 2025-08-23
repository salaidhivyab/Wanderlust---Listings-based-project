const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup))

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl, 
        passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),
        userController.login
    )

//passport.auth is a middle used for authentication in post route, local authentication hence local
//redirect to login if failed, with failure flash

//GET logout
router.get("/logout", userController.logout);

module.exports = router;