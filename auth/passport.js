require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.SECRET_KEY,
      callbackURL: `${process.env.VITE_BACKEND_API_BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const firstName = profile.name?.givenName || null;
        const lastName = profile.name?.familyName || null;
        const displayName = profile.displayName || null;

        if (!googleId) {
          console.error("Missing Google profile.id");
          return done(null, false);
        }

        let user = await userModel.getUserByGoogleId(googleId);

        if (!user) {
          user = await userModel.createNewUser({
            googleid: googleId,
            email,
            firstname: firstName,
            lastname: lastName,
            displayname: displayName,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

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
