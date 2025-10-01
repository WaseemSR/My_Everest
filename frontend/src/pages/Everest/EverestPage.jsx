import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOneEverest } from "../../services/everests";
import Everest from "../../components/Everest";
import CommentsSection from "../../components/CommentsSection";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function EverestPage() {
  const { id } = useParams(); 
  const [everest, setEverest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  


  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const out = await getOneEverest(id, token); 
        setEverest(out.everest); 
        localStorage.setItem("token", out.token); 

        // fetch current user's profile to determine ownership
        try {
          const profileRes = await fetch(`${BACKEND_URL}/users/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${out.token || token}`,
            },
          });
          if (profileRes.ok) {
            const data = await profileRes.json();
            const user = data.user ?? data;
            setCurrentUserId(user?._id || null);
          }
        } catch (_) {
          // ignore profile errors for UI ownership check
        }
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
    

    <Header showNav={true} />
    
    <main className="is-flex-grow-1 p-5" style={{ backgroundColor: "#1b262c" }}>

    <div>
        <Everest
          everest={everest}
          onToggleMilestone={toggleMilestone}
          onMilestoneAdded={onMilestoneAdded}
          onEverestUpdated={(updated) => setEverest(updated)}
          currentUserId={currentUserId}
        />
    </div>
    <CommentsSection everestId={everest._id} />
    
    </main>
    
    <Footer />

    </div>
  );
}
