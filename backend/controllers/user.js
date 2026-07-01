const User = require("../models/user");

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
    });

    const registeredUser = await User.register(
      newUser,
      password
    );

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      res.status(201).json({
        success: true,
        message: "Welcome to StayFinder",
        user: registeredUser,
      });
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.login = (req, res) => {
  res.json({
    success: true,
    message: "Welcome Back!",
    user: req.user,
  });
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

module.exports.checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: req.user,
    });
  }

  res.json({
    authenticated: false,
    user: null,
  });
};