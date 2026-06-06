import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../services/api";

/**
 * AuthContext.jsx
 * Global authentication state management using React Context API.
 * Provides user data, login, logout, and profile update functions
 * to any component in the app via the useAuth() hook.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On page load, restore user session from localStorage if available
    // This keeps the user logged in even after a browser refresh
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to parse stored user", err);
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  const login = useCallback(async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data && response.data.success) {
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    }
    throw new Error("Login failed without throwing exception");
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, []);

  // updateUser: syncs updated profile fields (name, address) into state and localStorage
  // This avoids a page reload after editing the profile
  const updateUser = useCallback((newData) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...newData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
    updateUser,
  };

  if (isLoading) {
    return <div>Loading auth...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

