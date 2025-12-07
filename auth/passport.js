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
    user = await userModel.createNewUser(newUser);
  }
  return done(null, user);
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.getUserByGoogleId(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});