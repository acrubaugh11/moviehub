const express = require("express");
const passport = require("passport");
const router = express.Router();
const userModel = require("../models/userModel");

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

const saveReturnTo = (req, res, next) => {
  const returnTo = req.query.returnTo || '/';
  req.session.returnTo = returnTo;
  next();
};

router.get(
  "/google",
  saveReturnTo,
  passport.authenticate("google", {
    keepSessionInfo: true,
    scope: [
        "https://www.googleapis.com/auth/plus.login",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
  })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { keepSessionInfo: true }, (err, user, info) => {
    if (err) {
      console.error("Passport authenticate error:", err);
      return res.redirect(`${CLIENT_BASE_URL}/login?error=true`);
    }

    if (!user) {
      console.error("No user returned from Google strategy");
      return res.redirect(`${CLIENT_BASE_URL}/login?error=true`);
    }

    const returnTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.redirect(`${CLIENT_BASE_URL}/login`);
      }

      req.session.save((err) => {
        if (err) console.error("Session save error:", err);

        res.redirect(`${CLIENT_BASE_URL}${returnTo}`);
      });
    });
  })(req, res, next);
});


router.get('/me', async (req, res) => {

  if (req.isAuthenticated()) {
    const user = await userModel.getUserByGoogleId(req.user.googleId);
    console.log(`user in .get/me is ${user}`);
    if (user) {
      console.log(`returning user!`);
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(401).json({ message: 'Not authenticated' });
    console.log(`req was not authenticated with req = ${req}`);
  }
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    // Destroy the session to clear the session cookie
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({ message: 'Error destroying session' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

module.exports = router;