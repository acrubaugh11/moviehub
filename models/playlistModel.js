"use strict";
const pool = require('../models/db');

async function getMyPlaylists(userId) {
    const result = await pool.query(
        'SELECT * FROM playlists WHERE userId = $1',
        [userId]
      );
      return result.rows;
}


async function createNewPlaylist(userId, name, description, image_url){
    let queryText = "INSERT INTO playlists (userId, name, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *";
    let values = [userId, name, description, image_url];
    const result = await pool.query(queryText, values);
    return result.rows[0];
}

async function getPlaylistById(playlistId) {
    const result = await pool.query(
        'SELECT * FROM playlists WHERE id = $1',
        [playlistId]
    );
    return result.rows[0];
}

async function deletePlaylist(playlistId){
    const result = await pool.query(
        'DELETE FROM playlists WHERE id = $1 RETURNING *',
        [playlistId]
    );
    return result.rows[0];
}

async function getPlaylistMovies(playlistId) {
    const result = await pool.query (
        `SELECT * FROM playlist_movies WHERE playlistId = $1 `, [playlistId]
    );
    return result.rows;
}

async function addToPlaylist(playlistId, movieId) {
    try {
        const checkFirst = await pool.query(
            `SELECT * FROM playlist_movies 
             WHERE playlistId = $1 AND movieId = $2`,
            [playlistId, movieId]
        );

        if (checkFirst.rows.length > 0) {
            return { success: false, message: "Movie already exists in playlist" };
        }

        const result = await pool.query(
            `INSERT INTO playlist_movies (playlistId, movieId)
             VALUES ($1, $2)`,
            [playlistId, movieId]
        );

        return { success: true, message: "Movie added to playlist" };

    } catch (err) {
        console.error(err);
        throw new Error("Error adding movie to playlist");
    }
}

async function removeFromPlaylist(playlistId, movieId) {
    try {
      const result = await pool.query(
        `DELETE FROM playlist_movies 
         WHERE playlistId = $1 AND movieId = $2
         RETURNING *`,
        [playlistId, movieId]
      );
  
      if (result.rowCount === 0) {
        return { success: false, message: "No movies in playlist" };
      }
  
      return { success: true, message: "Movie removed from playlist" };
    } catch (err) {
      console.error(err);
      throw new Error("Error removing movie from playlist");
    }
  }
  



module.exports = {
    getMyPlaylists,
    createNewPlaylist,
    getPlaylistById,
    deletePlaylist,
    addToPlaylist,
    getPlaylistMovies,
    removeFromPlaylist
};