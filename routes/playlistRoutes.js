"use strict";
const controller = require('../controllers/playlistsController');
const express = require("express");
const router = express.Router();
const multer = require("multer");
router.get("/myPlaylists", controller.fetchMyPlaylists);

router.get("/:id", controller.fetchPlaylistById);
router.delete("/:id", controller.deleteMyPlaylist);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage });
  

router.post("/create", upload.single("image_url"), controller.createPlaylist);

module.exports = router;
