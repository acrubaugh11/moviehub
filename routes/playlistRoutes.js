"use strict";
const controller = require('../controllers/playlistsController');
const express = require("express");
const router = express.Router();
router.get("/myPlaylists", controller.fetchMyPlaylists);
router.post("/create", controller.createPlaylist);


module.exports = router;
