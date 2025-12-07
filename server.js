"use strict";
require('dotenv').config();
const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require('./auth/passport'); 

app.set('trust proxy', 1);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true, 
      sameSite: 'none', 
      maxAge: 1000 * 60 * 60 * 24,
      domain: 'moviehub-7t2e.onrender.com', 
    }
  })
);

app.use(
  cors({
    origin: 'moviehub-7t2e.onrender.com',
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);


app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static("uploads"));



const authRoutes = require("./auth/authRoute");
app.use("/auth", authRoutes);

const movieRoutes = require("./routes/myMovieRoutes");
app.use("/movies", movieRoutes);
app.use("/api", movieRoutes);

const playlistRoutes = require("./routes/playlistRoutes.js");
app.use("/playlists", playlistRoutes)



const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server listening on port: " + PORT + "!");
});
