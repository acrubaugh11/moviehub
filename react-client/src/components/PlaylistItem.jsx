import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/Navbar'
import musichub from '../assets/musichub.png'
import { useNavigate } from 'react-router-dom';
import { useRef } from "react";
export default function PlaylistItem(){
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [movies, setMovies] = useState([]);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:3000";
    const navigate = useNavigate();
    const hasLoaded = useRef(false);

    const removeMovie = async(movieId) => {
      const confirmation = window.confirm("Are you sure you want to remove this movie?");
      if(!confirmation) return;
      try{
        await axios.delete(`${BACKEND_URL}/playlists/${id}/movies/${movieId}`, {withCredentials: true});
        setMovies(null);
        loadPlaylistMovies();
      }catch(err){
        console.error(err);
      }
    }

    const goToExplore = () => {
      navigate("/explore");
    }

    const deletePlaylist = async() => {
        const confirmation = window.confirm("Are you sure you want to delete this playlist?");
        if(!confirmation) return;
        try{
            await axios.delete(`${BACKEND_URL}/playlists/${id}`, {withCredentials: true});
        navigate("/dashboard")
        }catch(err){
            console.error(err);
        }
    }


    const loadPlaylist = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/playlists/${id}`, { withCredentials: true });
        setPlaylist(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const loadPlaylistMovies = async () =>{
      try{
        const res = await axios.get(`${BACKEND_URL}/playlists/${id}/movies`, {withCredentials: true,});
        setMovies(res.data);
      }catch(err){
        console.error(err);
      }
    }
    
    useEffect(() => {
      if (hasLoaded.current) return;
      hasLoaded.current = true;
      loadPlaylistMovies();
      loadPlaylist();
    },[]);
  

    if(!playlist){
        return (
            <div className="container">
            <Navbar></Navbar>
            <p>loading ....</p>
          </div>
        );
    };
  
    return (
      <div className="container">
        <Navbar></Navbar>
        <div className="playlist-item">
            <div className="playlist-heading">
                <img src={playlist?.image_url ? `${BACKEND_URL}${playlist?.image_url}` : musichub} alt="playlist image error" />
                <div className="title-description">
                    <h1>{playlist?.name}</h1>
                    <p>{playlist?.description}</p>
                </div>
            </div>
            <div className="playlist-buttons">
                <button className="button" onClick={goToExplore}>Add Movies</button>
                <button className="button" onClick={() => deletePlaylist()}>Delete Playlist</button>

            </div>
            <div className="playlist-movies-container">
              {movies?.length > 0 ? (movies.map((movie) => (
                <div key={movie.id} className="playlist-movie">
                  <div className="playlist-movie-img">
                    <img src={movie.poster_path !== null ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : movieAlt} alt='error' />
                  </div>
                  <div className="playlist-movie-info">
                    <h3><strong>{movie.title}</strong></h3> 
                    <p>{movie.overview}</p>
                  </div>
                  <div className="playlist-movie-buttons">
                    <button onClick={() => navigate(`/movies/${movie.id}`)}>+ Details</button>
                    <button onClick={() => removeMovie(movie.id)}>Remove</button>
                  </div>
                </div>
                
              ))) :(<p><i>No Movies In This Playlist</i></p>) }
            </div>
        </div>
      </div>
    );
};