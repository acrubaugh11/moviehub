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
    googleid: profile.id,
    displayName: profile.displayName,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value
  }
  const user = await userModel.getUserByGoogleId(profile.id);
  console.log(user);
  if (!user) {
    user = await userModel.createNewUser(Object.values(newUser));
    console.log(user);
  }
  return done(null, user);
}));


passport.serializeUser((user, done) => {
  console.log(`from serialise -> userId: ${user}`)
  done(null, user.googleid);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.getUserByGoogleId(id); // Fetch from DB
    console.log(`from deserialize -> user: ${user}`)
    done(null, user); // Pass the full user object
  } catch (error) {
    done(error);
  }
});