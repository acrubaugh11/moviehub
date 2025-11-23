import { useEffect } from "react"
import Navbar from "./components/Navbar.jsx"
import './styles/home.css'
import axios from "axios"

export default function Dashboard(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || 'http://localhost:3000';


    const loadMovies = async() => {
        try{
            let movies = await axios.get('/movies/myMovies');
            movies = JSON.stringify(movies.data);
            console.log(movies);
        }catch(err){
            console.error(err);
        }
    };

    const loadPlaylists = async() => {
        try{
            const response = await axios.get(`${BACKEND_URL}/playlists/myPlaylists`, {
                withCredentials: true,
              });
            const playlists =  response.data;
            for(const playlist of playlists){
                console.log(playlist);
            }
        }catch(err){
            console.error(err);
        }
    };
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


        </div>
    )
};