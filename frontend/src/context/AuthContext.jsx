import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (on page refresh)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("https://projectx-ojl3.onrender.com/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Only update trustScore and role — avoids full re-render blink
      setUser((prev) => {
        const updated = { ...prev, trustScore: res.data.trustScore, role: res.data.role };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Failed to refresh profile", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
