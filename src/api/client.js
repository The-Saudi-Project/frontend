const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL:", API_URL);

export const apiRequest = async (path, method = "GET", body) => {
  const token = sessionStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Something went wrong");
  }

  return res.json();
};
