import { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in cookies via API call or local storage if needed
    // For simplicity, assume on load we fetch user if token exists
    const checkUser = async () => {
      try {
        // You might need a /me endpoint in backend for this
        // For now, placeholder: add /api/auth/me in backend if needed
        const res = await api.get('/api/auth/me'); // Implement this in backend
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};