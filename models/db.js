require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Create users table on startup if it doesn't exist
const createUsersTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            googleId VARCHAR(255) UNIQUE NOT NULL,
            displayName VARCHAR(255),
            firstName VARCHAR(255),
            lastName VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(createTableQuery);
        console.log("Users table created or already exists");
    } catch (error) {
        console.error("Error creating users table:", error);
    }
};

const createPlaylistsTable = async () => {
    const createPlaylistQuery = `
        CREATE TABLE IF NOT EXISTS playlists (
            id SERIAL PRIMARY KEY,
            userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- owner of playlist
            name VARCHAR(255) NOT NULL,
            description TEXT,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

    `;
    try {
        await pool.query(createPlaylistQuery);
        console.log("Playlists table created or already exists");
    } catch (error) {
        console.error("Error creating playlists table:", error);
    }
};


const createPlaylistMoviesTable = async () => {
    const createPlaylistMoviesQuery = `
        CREATE TABLE IF NOT EXISTS playlist_movies (
            playlistId INT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
            movieId INT NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (playlistId, movieId)
    );

    `;
    try {
        await pool.query(createPlaylistMoviesQuery);
        console.log("Playlist_movies table created or already exists");
    } catch (error) {
        console.error("Error creating playlist_movies table:", error);
    }
}



const startDB = async () =>{
    try{
        await createUsersTable();
        await createPlaylistsTable();  
        await createPlaylistMoviesTable();
        console.log("All tables created successfully!");
    }catch(err){
        console.log(err);
    };
}

startDB();
module.exports = pool;