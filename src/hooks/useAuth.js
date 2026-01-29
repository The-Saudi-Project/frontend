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

    apiRequest("/auth/me")
      .then(setUser)
      .catch(() => {
        sessionStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, expectedRole) => {
    const res = await apiRequest("/auth/login", "POST", {
      email,
      password,
      expectedRole, // ✅ send intent
    });

    sessionStorage.setItem("token", res.token);
    const me = await apiRequest("/auth/me");
    setUser(me);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return { user, loading, login, logout };
};
