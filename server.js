"use strict";
require('dotenv').config();
const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require('./auth/passport'); 

app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL || "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());


const authRoutes = require("./auth/authRoute");
app.use("/auth", authRoutes);

const movieRoutes = require("./routes/myMovieRoutes");
app.use("/movies", movieRoutes);

const playlistRoutes = require("./routes/playlistRoutes.js");
app.use("/playlists", playlistRoutes)



const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server listening on port: " + PORT + "!");
});
