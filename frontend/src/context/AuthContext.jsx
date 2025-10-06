import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // means logged in state
  const [loading, setLoading] = useState(true);

  // Check if user is logged in by calling a protected route
  const checkAuth = async () => {
    try {
      await api.get('/quiz/my-quizzes'); // this requires auth middleware
      setToken('logged_in'); // success means logged in
    } catch (error) {
      setToken(null); // unauthorized or error means logged out
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await api.post('/auth/login', { email, password });
      await checkAuth(); // refresh auth state after login
    } catch (error) {
      setToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      await api.post('/auth/signup', { username, email, password });
      await checkAuth(); // refresh auth state after signup
    } catch (error) {
      setToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
      setToken(null);
    } catch (error) {
      // ignore error or handle it
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, login, signup, logout, loading, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
