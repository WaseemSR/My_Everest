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

export async function updateUser(token, userId, username, bio, profileImageUrl) {
  const body = {};
  if (username !== undefined) body.username = username;
  if (bio !== undefined) body.bio = bio;
  if (profileImageUrl !== undefined) body.profileImageUrl = profileImageUrl;

  const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Unable to update user");
  }

  const data = await response.json();
  return data.user;
}