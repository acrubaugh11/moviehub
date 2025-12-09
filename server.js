"use strict";
require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');

const multer = require("multer");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const isProd = process.env.NODE_ENV === 'production';


require('./auth/passport'); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



app.use(
  session({
    store: new pgSession({ conObject: { connectionString: process.env.DATABASE_URL } }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, sameSite: 'lax', httpOnly: true },
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

app.use(express.static(path.join(__dirname, "react-client/dist")));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/auth") || 
      req.path.startsWith("/api") ||
      req.path.startsWith("/movies") ||
      req.path.startsWith("/playlists") ||
      req.path.startsWith("/uploads")
    ) {
    return next();
  }
  res.sendFile(path.join(__dirname, "react-client/dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server listening on port: " + PORT + "!");
});
