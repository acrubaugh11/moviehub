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

module.exports = {
    getMyPlaylists,
    createNewPlaylist,
    getPlaylistById,
    deletePlaylist
};