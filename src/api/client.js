const API_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async (path, method = "GET", body) => {
  const token = sessionStorage.getItem("token");

  const res = await fetch(
    `${API_URL}${path}`,
    {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    },
    console.log("Ok"),
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Something went wrong");
  }

  return res.json();
};
