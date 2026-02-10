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
        sessionStorage.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, expectedRole) => {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password, expectedRole },
    });

    sessionStorage.setItem("token", res.token);
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
