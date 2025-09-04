// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) fetchUserProfile();
    else setLoading(false);
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const profile = await API.AuthApi.profile(); // now returns data
      setUser(profile);
    } catch (e) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { token: newToken, user: userData } = await API.AuthApi.login(
      email,
      password
    );
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    return { token: newToken, user: userData }; // so caller can redirect by role
  };

  const register = async (name, email, password, role = "customer") => {
    const { token: newToken, user: userData } = await API.AuthApi.register(
      name,
      email,
      password,
      role
    );
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    return { token: newToken, user: userData };
  };

  const updateProfile = async (profileData) => {
    const updated = await API.AuthApi.updateProfile(profileData);
    setUser(updated);
    return updated;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
        isCustomer: user?.role === "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
