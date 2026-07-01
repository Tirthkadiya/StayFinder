const express = require("express");
const router = express.Router();
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controllers/user");

// Signup
router.post(
  "/signup",
  wrapAsync(userController.signup)
);

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            info?.message ||
            "Invalid username or password",
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        userController.login(req, res);
      });
    }
  )(req, res, next);
});

// Logout
router.post(
  "/logout",
  userController.logout
);

// Check Authentication
router.get(
  "/check-auth",
  userController.checkAuth
);

module.exports = router;