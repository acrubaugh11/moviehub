import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/Navbar'
import musichub from '../assets/musichub.png'
import { useNavigate } from 'react-router-dom';
import '../styles/home.css'
import ModalComponent from "./ModalComponent";


export default function MovieItem(){
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [genres, setGenres] = useState([]);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:3000";
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState([]);
    const [movieToAdd, setMovieToAdd] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const addToPlaylist = async(id) => {
        const playlistId = id;
        const movieId = movie.id;
        try {
            const tryAdd = await axios.post(`${BACKEND_URL}/playlists/addMovie/${playlistId}/${movieId}`,{movieId: movie.id},
                { withCredentials: true });
            alert(tryAdd.data.message);
            handleCloseModal();
            }catch(err){
            console.error(err);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        loadPlaylists();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    async function loadPlaylists() {
        try {
            const res = await axios.get(`${BACKEND_URL}/playlists/myPlaylists`, {
                withCredentials: true,
              });
            setPlaylists(res.data);
            setMovieToAdd(movie);
        } catch (err) {
            console.error(err);
        }
    }


     function goBack() {
        navigate("/explore")
    }

    
    useEffect(() => {
      const loadMovie = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}/api/movies/${id}`);
          setMovie(res.data);
          setGenres(res.data.genres);
        } catch (err) {
          console.error(err);
        }
      };
      loadMovie();
    }, [id]);
  

    if(!movie){
        return (
            <div className="container">
            <Navbar></Navbar>
            <p>loading ....</p>
          </div>
        );
    };
  
    return (
        <div className="movie-container">
            <Navbar></Navbar>
            <div className="movie-item">
                <div className="movie-poster">
                    <img src={movie.poster_path !== null ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : movieAlt} alt='error' />
                </div>
                <div className="movie-info">
                    <div className="movie-heading">
                            <h1>{movie?.title}</h1>
                            <h3><i>{movie?.tagline}</i></h3>
                    </div>
                    <div className="movie-stats">
                        <p>{movie?.release_date}</p>
                        {genres.map((genre) =>(
                            <p>{genre.name}</p>
                        ))}
                        <p>{movie?.runtime} mins</p>
                        <p className="rating">{movie?.vote_average}/10</p>
                    </div>
                    <div className="movie-overview">
                        <h3>Overview:</h3>
                        <p>{movie?.overview}</p>
                    </div>
                    <div className="movie-buttons">
                        <button className="button" onClick={goBack}>Back to Search</button>
                        <button onClick={handleOpenModal}>Add Movie To A Playlist</button>
                        </div>
                </div>
                {isModalOpen && (
                <ModalComponent onClose={handleCloseModal}>
                    <h1 id="add-to-playlist">Add To Playlist</h1>
                    <div className="scrollable">
                        {playlists.map((playlist) => (
                            <div className="modal-grid">
                                <div key={playlist.id} className="playlist-card modal-card" onClick={() => addToPlaylist(playlist.id)}>
                                    <h3>{playlist.name}</h3> 
                                    <p>{playlist.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ModalComponent>
                )}
            </div>
        </div>
    );
};