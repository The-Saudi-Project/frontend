const API_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async (path, options = {}) => {
  const token = sessionStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Something went wrong");
  }

  return res.json();
};
