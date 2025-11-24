import Navbar from "./components/Navbar"
import './styles/home.css'
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
export default function Create(){  
    const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || 'http://localhost:3000';
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image_url, setImage_url] = useState(null);
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if(image_url){
        formData.append('image_url', image_url);
      }

      try {
        const response = await axios.post(`${BACKEND_URL}/playlists/create`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Playlist created:', response.data);
        alert("New playlist Created!!");
        navigate('/dashboard');
      } catch (err) {
        console.error('Error creating playlist:', err);
      }
    };
    
    return(
        <>
            <Navbar></Navbar>
            <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                <h2>Create New Playlist</h2>
                <br />
                <h4>Playlist Name</h4>
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
                <h4>Description</h4>
                <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)}
                />
                <h4>Image</h4>
                <input type="file" name="image_url" onChange={(e) => setImage_url(e.target.files[0])}
                />

                <div className="cancel-submit">
                    <button type="button" onClick={() => window.history.back()}>Cancel</button>
                    <button type="submit">Create Playlist</button>
                </div>
            </form>
        </>
    )
}