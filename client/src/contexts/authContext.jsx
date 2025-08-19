import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [authError, setAuthError] = useState(null);

  const fetchMe = async (jwt) => {
    try {
      setLoadingUser(true);
      setAuthError(null);
      
      // Set token for API calls
      api.setToken(jwt);
      
      const data = await api.get('/auth/me');
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
      });
    } catch (error) {
      console.error("Auth error:", error);
      setUser(null);
      setToken(null);
      api.removeToken();
      localStorage.removeItem("token");
      setAuthError(error.message);
    } finally {
      setLoadingUser(false);
    }
  };

  const login = async (credentials) => {
    try {
      setAuthError(null);
      const response = await api.post('/auth/login', credentials);
      
      if (response.success) {
        const { token: newToken, user: userData } = response;
        setToken(newToken);
        api.setToken(newToken);
        localStorage.setItem("token", newToken);
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
        });
        return { success: true };
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      setAuthError(null);
      const response = await api.post('/auth/register', userData);
      
      if (response.success) {
        const { token: newToken, user: newUser } = response;
        setToken(newToken);
        api.setToken(newToken);
        localStorage.setItem("token", newToken);
        setUser({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        });
        return { success: true };
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    api.removeToken();
    localStorage.removeItem("token");
    setAuthError(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  useEffect(() => {
    if (token) {
      fetchMe(token);
    }
  }, [token]);

  // Check token validity on app load
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && !token) {
        setToken(storedToken);
      }
    };
    
    checkToken();
  }, []);

  const value = {
    user,
    token,
    loadingUser,
    authError,
    login,
    register,
    logout,
    clearAuthError,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
