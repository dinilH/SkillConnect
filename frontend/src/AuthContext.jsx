import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user data from localStorage first (for user info)
        const userJson = localStorage.getItem("user");
        if (userJson) {
          const userData = JSON.parse(userJson);
          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (e) {
        console.error("Auth check error:", e);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    // No longer store token (it's in httpOnly cookie)
    // Only store user data for UI purposes
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", userData.id || userData.userId);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call backend to clear cookie
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include", // Important: send cookies
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("skillconnect_current_gpa");
    localStorage.removeItem("skillconnect_gpa_last_calculated");
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
