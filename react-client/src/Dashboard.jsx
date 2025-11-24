import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import "./styles/home.css";
import axios from "axios";
import musichub from "./assets/musichub.png";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:3000";
    const [playlistList, setPlaylistList] = useState([]);
    const navigate = useNavigate();


  const loadMovies = async () => {
    try {
      let movies = await axios.get("/movies/myMovies");
      movies = JSON.stringify(movies.data);
      console.log(movies);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPlaylists = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/playlists/myPlaylists`, {
        withCredentials: true,
      });
      const playlists = response.data;
      setPlaylistList(playlists);
      for (const playlist of playlists) {
        console.log(playlist);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openPlaylist = (playlistId) => {
    navigate(`/playlists/${playlistId}`);
  }

  useEffect(() => {
    loadPlaylists();
  }, []);

  return (
    <div className="container">
      <Navbar></Navbar>
      <div id="my-movies">
        <h2>MY MOVIES</h2>
        <p>Manage your personal movie playlists </p>
      </div>
      <div className="playlist-grid">
        {playlistList.map((playlist) => (
          <div key={playlist.id} className="playlist-card" onClick={() => openPlaylist(playlist.id)}>
            <img src={playlist.image_url !== '' ? `${BACKEND_URL}${playlist.image_url}` : musichub} alt='error' />
            <h3>{playlist.name}</h3> 
            <p>{playlist.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
