"use strict";
const controller = require('../controllers/moviesController');
const express = require("express");
const router = express.Router();
router.get("/myMovies", controller.fetchAllMovies);


module.exports = router;
