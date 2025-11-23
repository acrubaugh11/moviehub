"use strict";
const pool = require('../models/db');

async function getAllMovies() {
    const queryText = "SELECT * FROM movies";

    const result = await pool.query(queryText);
    return result.rows;
}


module.exports = {
    getAllMovies
};