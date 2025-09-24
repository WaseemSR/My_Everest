import { useEffect, useState } from 'react'
import { getUserEverests } from "../../services/everests";
import EverestCard from "../../components/EverestCard";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import "../../components/EverestCard.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function ProfilePage({onDelete}) {

  const [user, setUser] = useState({ _id: "", username: "", bio: "" });
  const [everests, setEverests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_URL}/everests/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setEverests((prev) => prev.filter((ev) => ev._id !== id)); // 🔥 removes immediately
      } else {
        const data = await res.json().catch(() => ({}));
        console.error("Delete failed:", data.message || res.statusText);
      }

    // Update UI
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

        // Allow either { user: {...} } or direct user doc
        const user = data.user ?? data;
        setUser(user);

      if (user?._id) {
        const out = await getUserEverests(user._id, token);
        // backend returns { everests: [...] }
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
  "Looks like Base Camp is empty. Add your first Everest to begin your ascent! ",
  "Base Camp is quiet… Announce your first Everest and start the climb! ",
  "The mountains await. Create your first Everest to begin the journey! ",
  "Your map is still blank. Add an Everest and plot your path! ",
  "No peaks in sight. Create your first Everest and start climbing! ",
];

const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>
      
    <Header showNav={true} />
    <main className="is-flex-grow-1 p-5" style={{ backgroundColor: "#1b262c" }}>

      <h1 className="title has-text-white is-size-1 has-text-weight-light">{user.username}'s Page of Everests</h1>
      <div className="is-flex is-justify-content-center">
        <div className="box  is-hoverable is-size-4" style={{ maxWidth: "700px", height: "250px", overflowY: "auto", backgroundColor: "rgba(241, 200, 146, 0.6)" }}>
          <p className="title has-text-weight-normal " >The story of {user.username}</p>
          {user.bio && <p>{user.bio}</p>}
        </div>
      </div>

      <br /><br /><br />

      <h2 className="title has-text-white is-size-1 has-text-weight-light mb-6">Everests</h2>

      <button><Link to="/createeverest" className="button is-my-green mb-4">Create New Everest</Link></button>
      
      <br /><br />

      {everests.length === 0 ? (
        <p className="is-size-3 has-text-white has-text-weight-light mt-">{randomMessage}</p>
        
      ) : (
      <div className="columns is-multiline equal-columns">
        {everests.map((ev) => (
          <EverestCard
            key={ev._id}
            everest={ev}
            onDelete={handleDelete}
            showDelete
          />
        ))}
      </div>
      )}
    </main>
    <Footer />
    </div>
  )
}