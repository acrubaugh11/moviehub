import Navbar from "./components/Navbar"
import SearchBar from "./components/SearchBar"
import axios from "axios";
import { useState } from "react";
import movieAlt from "./assets/movie.png"
import './styles/home.css'
import { useNavigate } from 'react-router-dom';

export default function Explore(){
    const [moviesList, setMoviesList] = useState([]);
    const navigate = useNavigate();


    async function fetchMovies(searchItems) {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:3000";        
        try {
            const response = await axios.get(`${BACKEND_URL}/api/search`, {
                params: { q: searchItems }
            });
            const data = response.data;
            setMoviesList(data.results);
            console.log(data);
        } catch(err) {
            console.error(err);
        }
    }
    
    const openMovie = (movieID) => {
        navigate(`/movies/${movieID}`);
      }
    
    

    return(
        <div className="container">
            <Navbar></Navbar>
            <SearchBar onSearch={fetchMovies}></SearchBar>

      <div className="movies-grid">
        {moviesList.map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => openMovie(movie.id)}>
            <img src={movie.poster_path !== null ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : movieAlt} alt='error' />
            <div className="movie-card-bottom">
                <div className="movie-card-text">
                    <h4>{movie.title}</h4> 
                    <h4>{movie.release_date}</h4>
                </div>
                <div className="movie-card-rating">
                    <p>{movie.vote_average}/10</p>
                </div>
            </div>

          </div>
        ))}
      </div>
        </div>
    )
}