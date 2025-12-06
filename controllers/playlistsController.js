"use strict";
const model = require('../models/playlistModel');
const axios = require("axios");

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

  async function addMovieToPlaylist(req, res){
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const {playlistId, movieId} = req.params;
    try{
      const result = await model.addToPlaylist(playlistId, movieId);
      res.json(result);
    }catch(err){
      console.error(err);
      res.status(500).send("server error");
    }
  }

  async function fetchPlaylistMoviesID(req, res){
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const {playlistId} = req.params;
    try {
      const result = await model.getPlaylistMovies(playlistId);
      res.json(result);
    }catch(err){
      console.error(err);
      res.status(500).send("server error");
    }
  
  }

  async function getMovies(req, res) {

    const { id } = req.params;

    try {
  
      const playlistMovies = await model.getPlaylistMovies(id);
  
      if (!playlistMovies || playlistMovies.length === 0) {
        return res.status(404).json({ message: 'No movies found for this playlist' });
      }
  
      const movieIds = playlistMovies.map(m => m.movieid);
      const movieDetails = await Promise.all(
        movieIds.map(async (id) => {
          const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            params: { api_key: process.env.TMDB_API_KEY },
            headers: { accept: 'application/json' }
          });
          return response.data;
        })
      );

      res.json(movieDetails);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error getting playlist movies' });
    }
  }

  async function removeMovies(req, res) {
    const { playlistId, movieId } = req.params;

    try {
      const response = await model.removeFromPlaylist(playlistId, movieId);
      res.json(response);
    }catch(err){
      console.error(err);
    }

  }
  



module.exports = {
    fetchMyPlaylists,
    createPlaylist,
    fetchPlaylistById,
    deleteMyPlaylist,
    addMovieToPlaylist,
    fetchPlaylistMoviesID,
    getMovies,
    removeMovies
};