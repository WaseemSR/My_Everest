import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../../components/EverestCard.css";
import { getUserEverests } from "../../services/everests";
import { updateUser as updateUserService } from "../../services/users";
import EverestCard from "../../components/EverestCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import UploadWidget from "../../components/UploadWidget";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function ProfilePage() {
  const [user, setUser] = useState({ _id: "", username: "", bio: "", profileImageUrl: "" });
  const [currentUserId, setCurrentUserId] = useState("");
  const [everests, setEverests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editProfileImageUrl, setEditProfileImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const isOwner = user?._id && currentUserId && String(user._id) === String(currentUserId);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/everests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Delete failed:", data.message || res.statusText);
        return;
      }

      setEverests((prev) => prev.filter((ev) => ev._id !== id));
    } catch (err) {
      console.error("Delete request error:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        const u = data.user ?? data;
        setUser(u);
        setCurrentUserId(u?._id || "");

        if (u?._id) {
          const out = await getUserEverests(u._id, token);
          setEverests(out.everests ?? out);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong with getting user everests");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;

  const messages = [
    "Looks like Base Camp is empty. Add your first Everest to begin your ascent!",
    "Base Camp is quiet… Announce your first Everest and start the climb!",
    "The mountains await. Create your first Everest to begin the journey!",
    "Your map is still blank. Add an Everest and plot your path!",
    "No peaks in sight. Create your first Everest and start climbing!",
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>
      <Header showNav={true} />

      <main className="is-flex-grow-1 p-5" style={{ backgroundColor: "#1b262c" }}>
        {/* Title */}
        <h1 className="title has-text-white is-size-1 has-text-weight-light has-text-centered">
          {user.username}'s Page of Everests
        </h1>

        <div
        className="profile-bio-section"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "2rem",
          gap: "1.5rem",
        }}
      >
        {/* Profile picture */}
        <div className="profile-pic-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <figure className="image" style={{ width: "180px", height: "180px" }}>
            <img
              className="is-rounded"
              src={user.profileImageUrl || "/default_profile.png"}
              alt={`${user.username} profile`}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </figure>
        </div>

        {/* Bio + Edit Button */}
        <div
          className="bio-container"
          style={{
            maxWidth: "900px",
            width: "80%",
            backgroundColor: "#1b262c",
            color: "#ffffff",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {user.bio && <p>{user.bio}</p>}
          {isOwner && (
            <button
              className="button is-my-green is-small"
              onClick={() => {
                setEditUsername(user.username || "");
                setEditBio(user.bio || "");
                setEditProfileImageUrl(user.profileImageUrl || "");
                setShowEditModal(true);
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div
            id="edit-profile-modal"
            className={`modal ${showEditModal ? "is-active" : ""}`}
            role="dialog"
            aria-modal="true"
          >
          <div className="modal-background" onClick={() => setShowEditModal(false)} />
          <div className="modal-card" style={{ maxWidth: "720px" }}>
            <header className="modal-card-head">
              <p className="modal-card-title">Edit Profile</p>
              <button className="delete" aria-label="close" onClick={() => setShowEditModal(false)} />
            </header>
            <section className="modal-card-body">
              <form onSubmit={(e) => e.preventDefault()}>
            {/* Username */}
            <div className="field">
              <label className="label is-small">Username</label>
            <div className="control">
              <input
                className="input is-small"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Your username"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="field">
            <label className="label is-small">Bio</label>
            <div className="control">
              <textarea
                className="textarea is-small"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={4}
                placeholder="Tell us about you"
              />
            </div>
          </div>

          {/* Profile Image Upload (Cloudinary) */}
          <div className="field">
            <label className="label is-small">Profile Image</label>
            <UploadWidget
              imageUrl={editProfileImageUrl || user.profileImageUrl || "/default_profile.png"} 
              setImageUrl={setEditProfileImageUrl} 
              folder="user-profiles"
              buttonText="Upload Profile Image"
              altText="Profile picture"
              previewClass="is-128x128"
            />
          </div>
        </form>
      </section>
      <footer className="modal-card-foot">
        <button
          className={`button is-primary ${saving ? "is-loading" : ""}`}
          onClick={async () => {
            try {
              setSaving(true);
              const token = localStorage.getItem("token");
              const updated = await updateUserService(
                token,
                user._id,
                editUsername,
                editBio,
                editProfileImageUrl // this will overwrite the existing image
              );
              setUser((prev) => ({ ...prev, ...updated }));
              setShowEditModal(false);
            } catch (e) {
              console.error("Profile update failed:", e);
              alert(e.message || "Failed to update profile");
            } finally {
              setSaving(false);
            }
          }}
        >
          Save changes
        </button>
        <button className="button" onClick={() => setShowEditModal(false)}>Cancel</button>
      </footer>
    </div>
  </div>
)}

        <br />

        <h2 className="title has-text-white is-size-1 has-text-weight-light mb-6">Everests</h2>
        <button>
          <Link to="/createeverest" className="button is-my-green mb-4">
            Create New Everest
          </Link>
        </button>
        <br />
        <br />

        {everests.length === 0 ? (
          <p className="is-size-3 has-text-white has-text-weight-light">{randomMessage}</p>
        ) : (
          <div className="columns is-multiline equal-columns">
            {everests.map((ev) => (
              <EverestCard key={ev._id} everest={ev} onDelete={handleDelete} showDelete />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
} 