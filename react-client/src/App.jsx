import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home.jsx'
import Dashboard from './Dashboard.jsx'
import Explore from './Explore.jsx'
import Create from './Create.jsx'
import LoginPage from './components/auth/LoginComponent.jsx'
import ProtectedLayout from './components/auth/ProtectedLayout.jsx'
import { AuthProvider } from './components/auth/AuthContext.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlaylistItem from './components/PlaylistItem.jsx'
import MovieItem from './components/MovieItem.jsx'


function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/explore" element={<Explore />} />
            <Route path="/create" element={<Create />} />
            <Route path='/playlists/:id' element={<PlaylistItem />}/>
            <Route path='/movies/:id' element={<MovieItem/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
