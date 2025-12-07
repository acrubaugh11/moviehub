require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const userModel = require('../models/userModel');

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.SECRET_KEY,
  callbackURL: `${process.env.VITE_BACKEND_API_BASE_URL}/auth/google/callback`,
  proxy: true
}, async (accessToken, refreshToken, profile, done) => {

  const newUser = {
    googleId: profile.id,
    displayName: profile.displayName,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value
  }
  let user = await userModel.getUserByGoogleId(profile.id);
  if (!user) {
    user = await userModel.createNewUser(newUser);
  }
  return done(null, user);
}));


passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user ID:', id);
    let user = await userModel.getUserById(id);

    if (!user) {
      console.log('User not found for ID:', id);
      return done(null, false);
    }
    console.log('User deserialized successfully:', user.id);
    done(null, user);
  } catch (error) {
    console.error('Deserialize error:', error);
    done(error, null);
  }
});