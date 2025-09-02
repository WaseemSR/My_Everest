import { useEffect, useState } from 'react'
import { getUserEverests } from "../../services/everests";
import EverestCard from "../../components/EverestCard";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import "../../components/EverestCard.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function ProfilePage() {

  const [user, setUser] = useState({ _id: "", fullName: "", bio: "" });
  const [everests, setEverests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div>
    <Header showNav={true} />
    <main className="" style={{ backgroundColor: "#1b262c" }}>

      <h1 className="title is-1 has-text-white">{user.fullName}'s Page of Everests</h1>
      <div className="is-flex is-justify-content-center">
        <div className="box is-hoverable is-size-4" style={{ maxWidth: "700px", height: "250px", overflowY: "auto", backgroundColor: "#f1c892" }}>
          <p className="title is-3" >The story of {user.fullName}</p>
          {user.bio && <p>{user.bio}</p>}
        </div>
      </div>

      <br /><br /><br />

      <h2 className="title is-1 has-text-white">Everests</h2>

      <button className="button is-my-orange">Create New Everest</button>
      
      <br /><br />

      {everests.length === 0 ? (
        <p className="is-size-2 has-text-white">No Everests yet</p>
      ) : (
      <div className="columns is-multiline equal-columns">
        {everests.map((ev) => (
          <EverestCard key={ev._id} everest={ev} />
        ))}
      </div>
      )}
    </main>
    <Footer />
    </div>
  )
}