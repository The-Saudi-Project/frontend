import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- RESTORE SESSION ---------- */
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

  /* ---------- LOGIN ---------- */
  const login = async (email, password, expectedRole) => {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password, expectedRole },
    });

    sessionStorage.setItem("token", res.token);
    setUser(res.user);
  };

  /* ---------- SIGNUP (THIS WAS MISSING) ---------- */
  const signup = async (data) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: data,
    });
  };

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return { user, loading, login, signup, logout };
};
