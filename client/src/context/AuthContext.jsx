import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { joinContestRoom } from '../services/socketService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.user);
          joinContestRoom(res.data.user);
        } catch (err) {
          console.error('Session expired:', err.message);
          sessionStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      sessionStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      joinContestRoom(res.data.user);
      toast.success(`Welcome back, ${res.data.user.username}!`);
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const register = async (username, email, password, role, collegeOrOrg) => {
    try {
      const res = await API.post('/auth/register', { username, email, password, role, collegeOrOrg });
      sessionStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      joinContestRoom(res.data.user);
      toast.success('Registration successful! Welcome to CODE DEBUGGING.');
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
