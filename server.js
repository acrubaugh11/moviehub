"use strict";
require('dotenv').config();
const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const isProd = process.env.NODE_ENV === 'production';

require('./auth/passport'); // Passport config

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  cors({
    origin: isProd
      ? 'https://moviehub-llh9.vercel.app'
      : 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    credentials: true,
  })
);

app.use(
  session({
    store: new pgSession({ conObject: { connectionString: process.env.DATABASE_URL } }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: isProd, // use true in production (HTTPS)
      sameSite: isProd ? 'none' : 'lax',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static("uploads"));

// Routes
const authRoutes = require("./auth/authRoute");
app.use("/auth", authRoutes);

const movieRoutes = require("./routes/myMovieRoutes");
app.use("/movies", movieRoutes);
app.use("/api", movieRoutes);

const playlistRoutes = require("./routes/playlistRoutes.js");
app.use("/playlists", playlistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server listening on port: " + PORT + "!");
});
