const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// GET: comments for an Everest
export async function getComments(token, everestId) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  };

  const response = await fetch(`${BACKEND_URL}/comments/everest/${everestId}`, requestOptions);
  if (response.status !== 200) throw new Error("Unable to fetch comments");
  return await response.json(); // { comments, token }
}

// POST: create a comment for an Everest
export async function createComment(token, everestId, content) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ everest: everestId, content }),
  };

  const response = await fetch(`${BACKEND_URL}/comments`, requestOptions);
  if (response.status !== 201) throw new Error("Unable to create comment");
  return await response.json(); // { comment, token }
}

// PUT: edit a comment you own
export async function updateComment(token, commentId, content) {
  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ content }),
  };

  const response = await fetch(`${BACKEND_URL}/comments/${commentId}`, requestOptions);
  if (response.status !== 200) throw new Error("Unable to update comment");
  return await response.json();
}

// DELETE: remove a comment you own
export async function deleteComment(token, commentId) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  };

  const response = await fetch(`${BACKEND_URL}/comments/${commentId}`, requestOptions);
  if (response.status !== 200) throw new Error("Unable to delete comment");
  return await response.json();
}