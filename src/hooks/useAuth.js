import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // ⚠️ We DO NOT call /auth/me (it does not exist)
    // User is already known from login
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, expectedRole) => {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password, expectedRole },
    });

    sessionStorage.setItem("token", res.token);
    sessionStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);
  };

  const signup = async (data) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: data,
    });
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return { user, loading, login, signup, logout };
};
