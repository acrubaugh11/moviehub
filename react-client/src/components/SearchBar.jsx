import '../styles/home.css'
import { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [value, setValue] = useState("");
  
    const handleChange = (e) => {
      setValue(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (onSearch) onSearch(value); 
    };
  
    return (
        <form onSubmit={handleSubmit} className="search-container">
        <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Search movies..."
            className="search-bar"
        />
        <button type="submit" className="search-button">Search</button>
        </form>
    );
  }
  