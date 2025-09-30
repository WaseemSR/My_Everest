import "./EverestCard.css";
import { Link } from "react-router-dom";
import Username from "./Username";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function EverestCard({ everest, onDelete, showDelete}) {
  
  if (!everest) return null;

    const milestones = Array.isArray(everest.milestones) ? everest.milestones : [];
    const isComplete = milestones.length > 0 && milestones.every(m => m.completed === true);

  const handleDelete = async () => {
    // optional safety prompt
    if (!window.confirm(`Delete "${everest.name}"?`)) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_URL}/everests/${everest._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // ✅ tell the parent (ProfilePage) to update its state
        onDelete?.(everest._id);
      } else {
        const data = await res.json().catch(() => ({}));
        console.error("Delete failed:", data.message || res.statusText);
      }
    } catch (err) {
      console.error("Delete request error:", err);
    }
  };


return (

<div className="column is-one-third">
  <div style={{ position: "relative" }}>
    {isComplete && (
      <img
        src="/logo.png"   // adjust path if needed
        alt="Completed badge"
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          width: "60px",   // small so it sits neatly by the title
          opacity: 0.9,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    )}

      <article
        className={`box is-hoverable has-text-weight-normal ${isComplete ? "complete" : "incomplete"}`}
        style={{
          minHeight: "360px",
          maxHeight: "360px",
          overflowY: "auto",
          backgroundColor: isComplete
            ? "rgba(173, 223, 173, 0.8)"
            : "white",
        }}
      >

      <figure className="image mb-3" style={{ maxHeight: "180px", overflow: "hidden" }}>
        <img
          src={everest.everestImageUrl || "/default_everest.png"}
          alt={`${everest.name} Everest`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </figure>

      <h2 className="title is-4 pr-6 pl-6 has-text-weight-normal" style={{ marginBottom: "0.25rem" }} >{everest.name}</h2>
              <span
                className="has-text-weight-normal is-size-7  created-by-inline" 
                style={{ display: "inline-flex", alignItems: "baseline", whiteSpace: "nowrap", gap: "0.25rem", marginBottom: "0rem" }}
              >
                Everest Created By:
                <Username user={everest.user} />
              </span>
      <hr style={{ border: "none", borderTop: "3px solid #1b262c", marginTop: "0.25rem"}} />
      <p className="is-size-6">{everest.details}</p>
      <br />
      <Link
        className="is-size-6 is-my-purple"
        to={`/everests/${everest._id}`}
      >
        Click Here for more information
      </Link>
      <br />

      {showDelete && (
        <button
          className="button is-my-orange has-text-white mt-5"
          style={{ color: "#1b262c" }}
          onClick={handleDelete}
        >
          Delete Everest
        </button>
      )}
    </article>
  </div>
</div>


    );
}

export default EverestCard;
