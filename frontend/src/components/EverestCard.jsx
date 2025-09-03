import "./EverestCard.css";
import { Link } from "react-router-dom";

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
          right: "10px",
          width: "75px",   // small so it sits neatly by the title
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />
    )}

    <article
      className="box is-hoverable"
      style={{
        minHeight: "300px",
        maxHeight: "300px",
        overflowY: "auto",
        backgroundColor: isComplete ? "#addfad" : "#f1c892",
      }}
    >
      <h2 className="title is-3 pr-6 pl-6">{everest.name}</h2>

      <hr style={{ border: "none", borderTop: "3px solid #1b262c" }} />
      <p className="is-size-5">{everest.details}</p>
      <br />
      <Link
        className="is-size-5 is-my-purple"
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