"use strict";
const controller = require('../controllers/moviesController');
const express = require("express");
const router = express.Router();
router.get("/myMovies", controller.fetchAllMovies);
router.get("/search", controller.searchMovies)
router.get("/movies/:id", controller.getMovieById);



module.exports = router;
