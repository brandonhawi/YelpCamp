const express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

// Root

router.get('/', (req, res) => {
    res.render("landing");
});

// Register Form 

router.get("/register", (req, res) => {
    res.render("register");
});

// Handles Registration Form

router.post("/register", (req, res) => {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Hello ${user.username}, you've successfully registered!`);
            res.redirect("/campgrounds");
        });
    });
});

// Login Form

router.get("/login", (req, res) => {
    res.render("login");
});

// Handles Login Form

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});

// Logout

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;