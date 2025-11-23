import Logo from "./Logo";
import '../styles/navbar.css'
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { useAuth } from '../components/auth/AuthContext';
import { useNavigate } from "react-router-dom";


export default function Navbar(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || 'http://localhost:3000';
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async ()=>{
        logout();
        navigate('/'); 
    }

    return (
            <div id="navbar">
                <div id="left-nav">
                    <Logo className='logo'></Logo>
                </div>
                <div id="right-nav">
                    <NavLink to='/dashboard' className={({ isActive }) => (isActive ? "nav-link active": "")}>My Movies</NavLink>
                    <NavLink to='/explore' className={({ isActive }) => (isActive ? "nav-link active": "")}>Explore</NavLink>
                    <NavLink to='/create' className={({ isActive }) => (isActive ? "nav-link active": "")}>+ Create New Playlist</NavLink>
                    <button onClick={handleLogout} className=".button-style">Logout</button>
                </div>
            </div>
    );
};