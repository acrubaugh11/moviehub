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
    if (err) return res.redirect(`${CLIENT_BASE_URL}/login?error=true`);
    if (!user) return res.redirect(`${CLIENT_BASE_URL}/login?error=true`);
  
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.redirect(`${CLIENT_BASE_URL}/login`);
      }
  
      console.log("req.user after logIn:", req.user);
  
      const returnTo = req.session.returnTo || "/dashboard";
      delete req.session.returnTo;
  
      req.session.save((err) => {
        if (err) console.error("Session save error:", err);
        res.redirect(`${CLIENT_BASE_URL}${returnTo}`);
      });
    });
  })(req, res, next);
});


router.get('/me', async (req, res) => {
  console.log("req.session:", req.session);
  console.log("req.session.passport:", req.session.passport);
  console.log("req.user:", req.user);
  console.log("req.cookies:", req.cookies);
  console.log(`\n the req session at /me = `, req.session, `\n the req body at /me = `, req.body);
    const user = await userModel.getUserByGoogleId(req.user.googleid);
    console.log(`user in .get/me is ${user}`);
    if (user) {
      console.log(`returning user!`);
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
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