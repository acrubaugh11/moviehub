"use strict";
const model = require('../models/movieModel')
const axios = require("axios");


async function fetchAllMovies(req, res) {
    try{
        const movies = await model.getAllMovies();
        res.json(movies)
    }catch(err){
        console.log(err);
        res.status(500).send("Server error");
        
    }

}

async function searchMovies(req, res) {
    try {
        const query = req.query.q;

        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query: query
            },
            headers: {
                accept: 'application/json',
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch movies" });
    }
}

async function getMovieById(req, res){
    const movieId = req.params.id;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
            },
            headers: {
                accept: 'application/json',
            }
        });
        res.json(response.data);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to fetch movies" });

    }
}
module.exports = {
    fetchAllMovies,
    searchMovies,
    getMovieById
};