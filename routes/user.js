const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup").get(userController.signUpForm)
.post(WrapAsync(userController.signUp));

router.route("/login").get(userController.loginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    userController.login);

router.route("/logout").get(userController.logout);

module.exports = router;