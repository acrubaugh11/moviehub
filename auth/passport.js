require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const userModel = require('../models/userModel');

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.SECRET_KEY,
  callbackURL: `${process.env.VITE_BACKEND_API_BASE_URL}/auth/google/callback`
}, async (token, tokenSecret, profile, done) => {

  const newUser = {
    googleId: profile.id,
    displayName: profile.displayName,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value
  }
  const user = await userModel.getUserByGoogleId(profile.id);
  if (!user) {
    user = await userModel.createNewUser(Object.values(newUser));
  }
  return done(null, profile);
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.getUserByGoogleId(id); // Fetch from DB
    done(null, user); // Pass the full user object
  } catch (error) {
    done(error);
  }
});