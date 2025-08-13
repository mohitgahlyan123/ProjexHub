// client/src/contexts/authContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import BASE_URL from "../utils/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchMe = async (jwt) => {
    try {
      setLoadingUser(true);
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
      });
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoadingUser(false);
    }
  };

  // login with token only
  const login = async (jwt) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);
    await fetchMe(jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token) fetchMe(token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, logout, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
