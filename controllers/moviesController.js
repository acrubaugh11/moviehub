"use strict";
const model = require('../models/movieModel')

async function fetchAllMovies(req, res) {
    try{
        const movies = await model.getAllMovies();
        res.json(movies)
    }catch(err){
        console.log(err);
        res.status(500).send("Server error");
        
    }

}
module.exports = {
    fetchAllMovies
};