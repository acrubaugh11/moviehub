require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/userModel");

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${process.env.VITE_BACKEND_API_BASE_URL}/auth/google/callback`,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    let user = await userModel.getUserByGoogleId(profile.id);

    if (!user) {
      const newUser = {
        googleid: profile.id,
        displayname: profile.displayName,
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: profile.emails[0].value
      };
      user = await userModel.createNewUser(Object.values(newUser));
    }

    req.logIn(user, (err) => {
      if (err) return done(err);
      return done(null, user);
    });

  } catch (err) {
    done(err);
  }
}));


// Serialize user
passport.serializeUser((user, done) => {
  console.log("serializeUser:", user.googleid);
  done(null, user.googleid);
});

// Deserialize user
passport.deserializeUser(async (googleid, done) => {
  try {
    const user = await userModel.getUserByGoogleId(googleid);
    console.log("deserializeUser:", user);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
