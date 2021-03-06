/*jshint esversion:6 */

const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        message: "The username already exists"
      });
      return;
    }

    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", {
          message: "The username already exists"
        });
      } else {
        res.redirect("/login");
      }
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  // res.render("passport/private", {
  //   user: req.user
  // });
  let user = req.user;
  if (req.user) {
    res.render("passport/private", {
      user
    });
  } else {
    res.redirect("/login");
  }
});






module.exports = router;
