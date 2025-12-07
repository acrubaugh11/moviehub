"use strict";
require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");

require('./auth/passport');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,     
      "http://localhost:5173"     
    ],
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  })
);

app.use(
  session({
    store: new pgSession({
      conObject: { connectionString: process.env.DATABASE_URL }
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000 
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("SESSION:", req.session);
  console.log("USER:", req.user);
  next();
});

app.use("/auth", require("./auth/authRoute"));
app.use("/movies", require("./routes/myMovieRoutes"));
app.use("/api", require("./routes/myMovieRoutes"));
app.use("/playlists", require("./routes/playlistRoutes.js"));

app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server listening on port " + PORT));
