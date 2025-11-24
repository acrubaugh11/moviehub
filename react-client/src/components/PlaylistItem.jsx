import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/Navbar'
import musichub from '../assets/musichub.png'
import { useNavigate } from 'react-router-dom';
export default function PlaylistItem(){
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:3000";
    const navigate = useNavigate();

    const deletePlaylist = async() => {
        const confirmation = window.confirm("Are you sure you want to delete this playlist?");
        if(!confirmation) return;
        try{
            const deletedPlaylist = await axios.delete(`${BACKEND_URL}/playlists/${id}`, {withCredentials: true});
        navigate("/dashboard")
        }catch(err){
            console.error(err);
        }
    }
    
    useEffect(() => {
      const loadPlaylist = async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}/playlists/${id}`, { withCredentials: true });
          setPlaylist(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      loadPlaylist();
    }, [id]);
  

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
                <button className="button">Add Movies</button>
                <button className="button" onClick={() => deletePlaylist()}>Delete Playlist</button>

            </div>
            <div className="playlist-movies">

            </div>
        </div>
      </div>
    );
};