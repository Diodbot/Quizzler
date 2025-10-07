// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '../api';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null); 
//   const [loading, setLoading] = useState(true);


//   const checkAuth = async () => {
//     try {
//       await api.get('/quiz/my-quizzes'); 
//       setToken('logged_in'); //
//     } catch (error) {
//       setToken(null); // 
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   // const login = async (email, password) => {
//   //   setLoading(true);
//   //   try {
//   //     await api.post('/auth/login', { email, password });
//   //     await checkAuth(); // refresh auth state after login
//   //   } catch (error) {
//   //     setToken(null);
//   //     throw error;
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const login = async (email, password) => {
//   setLoading(true);
//   try {
//     const { data } = await api.post('/auth/login', { email, password });
//     setToken(data.token);
//   } catch (error) {
//     setToken(null);
//     if (error.response?.data?.message) {
//       throw new Error(error.response.data.message);
//     }
//     throw error;
//   } finally {
//     setLoading(false);
//   }
// };


//   const signup = async (username, email, password) => {
//   setLoading(true);
//   try {
//     // Send signup request
//     await api.post('/auth/signup', { username, email, password });

//     // ✅ Don't auto-login or checkAuth here
//     // ✅ Let the user manually log in after email verification
//   } catch (error) {
//     setToken(null);
//     throw error;
//   } finally {
//     setLoading(false);
//   }
// };


//   const logout = async () => {
//     setLoading(true);
//     try {
//       await api.post('/auth/logout');
//       setToken(null);
//     } catch (error) {
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ token, login, signup, logout, loading, isAuthenticated: !!token }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '../api';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const checkAuth = async () => {
//     setLoading(true);
//     try {
//       await api.get('/quiz/my-quizzes'); // protected route to verify auth
//       setIsAuthenticated(true);
//     } catch (error) {
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       await api.post('/auth/login', { email, password });
//       await checkAuth();
//     } catch (error) {
//       setIsAuthenticated(false);
//       const message = error.response?.data?.message || error.message || 'Login failed';
//       throw new Error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (username, email, password) => {
//     setLoading(true);
//     try {
//       await api.post('/auth/signup', { username, email, password });
//     } catch (error) {
//       const message = error.response?.data?.message || error.message || 'Signup failed';
//       throw new Error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     setLoading(true);
//     try {
//       await api.post('/auth/logout');
//       setIsAuthenticated(false);
//     } catch {
//       // ignore errors
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         loading,
//         login,
//         signup,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      await api.get('/quiz/my-quizzes');  // a protected endpoint
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
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
      await checkAuth();
    } catch (error) {
      setIsAuthenticated(false);
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      await api.post('/auth/signup', { username, email, password });
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
      setIsAuthenticated(false);
    } catch {
      // ignore errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

