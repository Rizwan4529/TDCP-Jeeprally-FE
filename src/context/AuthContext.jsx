import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.jsx";
import endpoints from "../api/endpoints";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on init
    const storedUser = localStorage.getItem("tdcp_user");
    const storedToken = localStorage.getItem("tdcp_auth_token");
    if (storedUser && storedUser !== "undefined" && storedToken && storedToken !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post(endpoints.auth.login, { email, password });
      const { data: user, token } = response.data;
      
      setUser(user);
      localStorage.setItem("tdcp_user", JSON.stringify(user));
      localStorage.setItem("tdcp_auth_token", token);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post(endpoints.auth.signup, { name, email, password });
      
      // Auto-login after successful signup, since signup API doesn't return a token
      return await login(email, password);
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Signup failed" 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post(endpoints.auth.logout);
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      setUser(null);
      localStorage.removeItem("tdcp_user");
      localStorage.removeItem("tdcp_auth_token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
