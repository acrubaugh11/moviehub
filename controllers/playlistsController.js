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

};

async function fetchPlaylistById(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const playlistId = req.params.id;
  try{
    const playlistById = await model.getPlaylistById(playlistId);
    res.json(playlistById);
  }catch(err){
    console.error(err);
    res.status(500).send("Server error");
  }

}

async function createPlaylist(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    const userId = req.user.id;
    const { name, description } = req.body;
    let image_url = '';
    if(req.file){
      image_url = `/uploads/${req.file.filename}`;
    }
  
    try {
      const newPlaylist = await model.createNewPlaylist(userId, name, description, image_url);
      res.json(newPlaylist);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }

  async function deleteMyPlaylist(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const playlistId = req.params.id;
    try{
      const deletedPlaylist = await model.deletePlaylist(playlistId);
      res.json(deletedPlaylist);
    }catch(err){
      console.error(err);
      res.status(500).send("Server error");
    }
  }
  



module.exports = {
    fetchMyPlaylists,
    createPlaylist,
    fetchPlaylistById,
    deleteMyPlaylist
};