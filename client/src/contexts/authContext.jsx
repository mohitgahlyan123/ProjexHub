import {createContext,useContext, useState} from 'react';

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [user, setUser] = useState(()=>JSON.parse(localStorage.getItem("user")) || null);

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const login=(userObj,jwt)=>{
    setUser(userObj);
    setToken(jwt);
    localStorage.setItem("token",jwt);
  };
  const logout=()=>{
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };
  

  return (
    <AuthContext.Provider value={{ user, token,logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);