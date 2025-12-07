const express = require("express");
const router = express.Router();
const passport = require("passport");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
}

// Get current user
router.get("/me", isAuthenticated, (req, res) => {
  res.json(req.user);
});

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { keepSessionInfo: true }, (err, user) => {
    if (err || !user) return res.redirect(`${process.env.CLIENT_BASE_URL}/login`);

    req.logIn(user, (err) => {
      if (err) return res.redirect(`${process.env.CLIENT_BASE_URL}/login`);

      // Redirect after login
      const returnTo = req.session.returnTo || "/dashboard";
      delete req.session.returnTo;

      req.session.save(() => {
        res.redirect(`${process.env.CLIENT_BASE_URL}${returnTo}`);
      });
    });
  })(req, res, next);
});

module.exports = router;
