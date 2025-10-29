import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();

export function useAuth(){ return useContext(AuthContext); }

export function AuthProvider({ children }){
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    async function refresh(){
      try {
        const res = await api.post('/auth/refresh_token');
        if (res.data?.accessToken) {
          setToken(res.data.accessToken);
          setAuthToken(res.data.accessToken);
        }
      } catch (e) { /* ignore */ }
      setLoading(false);
    }
    refresh();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.accessToken);
    setAuthToken(res.data.accessToken);
    setUser(res.data.user);
    return res;
  };

  const register = async (email, password) => {
    const res = await api.post('/auth/register', { email, password });
    setToken(res.data.accessToken);
    setAuthToken(res.data.accessToken);
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return <AuthContext.Provider value={{ token, user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}
