import { useState, useEffect } from "react";
import { updateUser } from "../services/users"; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function User({ user, onUserUpdated, currentUserId }) {
  if (!user) return null;

  const ownerId = user._id || user.id; 
  const isOwner =
    ownerId && currentUserId && String(ownerId) === String(currentUserId);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setUsername(user.username || "");
    setBio(user.bio || "");
  }, [user?._id]);

  async function handleSave(e) {
    e?.preventDefault?.();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const updated = await updateUser(token, ownerId, username, bio);

      onUserUpdated?.(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  if (!isOwner) {
    return (
      <div>
        <h2>{user.username}</h2>
        <p>{user.bio}</p>
      </div>
    );
  }

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSave}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={saving}
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={saving}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setUsername(user.username || "");
              setBio(user.bio || "");
            }}
            disabled={saving}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <h2>{user.username}</h2>
          <p>{user.bio}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default User;