const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUsers(token) {
  if (!token) throw new Error("No token provided");

  const res = await fetch(`${BACKEND_URL}/users`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Unable to fetch users");
  return res.json();
}

export async function getUserById(userId, token) {
  if (!token) throw new Error("No token provided");

  const res = await fetch(`${BACKEND_URL}/users/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Unable to fetch user");
  return res.json();
}