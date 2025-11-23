import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || 'http://localhost:3000';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading

  // 3. The 'on load' check
  useEffect(() => {
    // This function will run once when the provider mounts
    async function checkUserSession() {
      try {
        // The /me endpoint will check the session cookie
        const { data } = await axios.get(`${BACKEND_URL}/auth/me`, {
          withCredentials: true, // Include cookies in the request
        });
        console.log("User session data:", data);
        setUser(data); // User is logged in
      } catch (error) {
        // No user or session is invalid
        console.error("Session check error:", error);
        setUser(null);
      } finally {
        // We're done checking, set loading to false
        setIsLoading(false);
      }
    }
    checkUserSession();
  }, []); // Empty array means this runs once on mount

  // 4. Logout Function
  const logout = async () => {
    try {
      // Tell the backend to destroy the session
      await axios.post(`${BACKEND_URL}/auth/logout`, {}, {
        withCredentials: true, // Include cookies in logout request
      });
      setUser(null); // Clear user state in React
    } catch (error) {
      console.error('Error logging out:', error);
      setUser(null); // Clear user state even if logout fails
    }
  };

  // 5. The value provided to all protected children
  const value = {
    user,
    isAuthenticated: !!user, // True if 'user' is not null
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 6. The custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};