const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshQueue = [];

const AUTH_EXEMPT_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/me",
  "/auth/refresh",
];

const processQueue = (token) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

export const apiRequest = async (path, options = {}) => {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");

  const makeRequest = (token) =>
    fetch(`${API_URL}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

  let res = await makeRequest(accessToken);

  // ❌ DO NOT REFRESH FOR AUTH ROUTES
  const isAuthExempt = AUTH_EXEMPT_PATHS.some((p) => path.startsWith(p));

  if (res.status === 401 && !isAuthExempt) {
    if (!refreshToken) {
      sessionStorage.clear();
      window.location.href = "/";
      return;
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        }

        const { accessToken: newToken } = await refreshRes.json();
        sessionStorage.setItem("accessToken", newToken);

        isRefreshing = false;
        processQueue(newToken);

        res = await makeRequest(newToken);
      } catch {
        sessionStorage.clear();
        window.location.href = "/";
        return;
      }
    } else {
      // Queue requests while refreshing
      return new Promise((resolve) => {
        refreshQueue.push(async (token) => {
          const retry = await makeRequest(token);
          resolve(retry.json());
        });
      });
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
};
