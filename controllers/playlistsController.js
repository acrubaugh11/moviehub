"use strict";
const model = require('../models/playlistModel')

async function fetchMyPlaylists(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    const userId = req.user.id;

    try{
        const playlists = await model.getMyPlaylists(userId);
        res.json(playlists);
    }catch(err){
        console.log(err);
        res.status(500).send("Server error");
        
    }

}

async function createPlaylist(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    const userId = req.user.id;
    const { name, description, image_url } = req.body;
  
    try {
      const newPlaylist = await model.createNewPlaylist(userId, name, description, image_url);
      res.json(newPlaylist);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
  



module.exports = {
    fetchMyPlaylists,
    createPlaylist
};