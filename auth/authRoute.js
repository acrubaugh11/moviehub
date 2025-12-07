const express = require("express");
const passport = require("passport");
const router = express.Router();
const userModel = require("../models/userModel");

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || 'http://localhost:5173';

const saveReturnTo = (req, res, next) => {
  const returnTo = req.query.returnTo || '/';
  req.session.returnTo = returnTo;
  next();
};

router.get(
  "/google",
  saveReturnTo,
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_BASE_URL}/login?error=true`,
    keepSessionInfo: true,
  }),
  (req, res) => {

    console.log("google callback started");
    console.log("Authenticated User:", req.user);

    const returnTo = req.session.returnTo || "/dashboard";

    delete req.session.returnTo;

    res.redirect(`${CLIENT_BASE_URL}${returnTo}`);
  }
);


router.get('/me', async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await userModel.getUserByGoogleId(req.user.googleId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({ message: 'Error destroying session' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

module.exports = router;