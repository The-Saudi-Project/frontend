const API_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async (path, options = {}) => {
  const token = sessionStorage.getItem("token"); // ✅ FIXED

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      ...(options.body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
};
