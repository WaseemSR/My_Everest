import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOneEverest } from "../../services/everests";
import Everest from "../../components/Everest";
import CommentsSection from "../../components/CommentsSection";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function EverestPage() {
  const { id } = useParams(); // 👈 grab /everests/:id from the URL
  const [everest, setEverest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const out = await getOneEverest(id, token); // pass id + token
        setEverest(out.everest); // backend returns { everest, token }
        localStorage.setItem("token", out.token); // refresh token
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong with getting the Everest");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

    const toggleMilestone = async (mid, nextCompleted) => {
    // optimistic UI
    setEverest(prev => ({
      ...prev,
      milestones: prev.milestones.map(m =>
        m._id === mid ? { ...m, completed: nextCompleted } : m
      ),
    }));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/everests/${id}/milestones/${mid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: nextCompleted }),
      });

      if (!res.ok) {
        // rollback
        setEverest(prev => ({
          ...prev,
          milestones: prev.milestones.map(m =>
            m._id === mid ? { ...m, completed: !nextCompleted } : m
          ),
        }));
        const data = await res.json().catch(() => ({}));
        console.error("Update failed:", data.message || res.statusText);
      }
    } catch (e) {
      // rollback
      setEverest(prev => ({
        ...prev,
        milestones: prev.milestones.map(m =>
          m._id === mid ? { ...m, completed: !nextCompleted } : m
        ),
      }));
      console.error("Network error:", e);
    }
  };

  function onMilestoneAdded(everestId, milestone) {
  // everestId is the same as `id` on this page, but we keep the signature consistent
  setEverest(prev =>
    !prev ? prev : { ...prev, milestones: [...(prev.milestones || []), milestone] }
  );
}

  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;
  if (!everest) return <div>No Everest found</div>;

  
  return (

    <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>
    
    <video
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1, // sit behind all content
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/forest.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

    <Header showNav={true} />
    
    <main className="is-flex-grow-1 p-5">

    <div>
       <Everest everest={everest} onToggleMilestone={toggleMilestone} onMilestoneAdded={onMilestoneAdded}/>
         
    </div>
    <CommentsSection everestId={everest._id} />
    
    </main>
    
    <Footer />

    </div>
  );
}