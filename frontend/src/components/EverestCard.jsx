import "./EverestCard.css";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function EverestCard({ everest, onDelete, showDelete }) {
  if (!everest) return null;

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
      
        <article
        className="box is-hoverable"
        style={{ minHeight: "300px", maxHeight: "300px", overflowY: "auto", backgroundColor: "#f1c892" }}
        >
        <h2 className="title is-3">{everest.name}</h2>
        
        <hr style={{ border: "none", borderTop: "3px solid #1b262c" }} />
        <p className="is-size-5">{everest.details}<Link className="is-size-5" to={`/everests/${everest._id}`}> Click Here for more information</Link></p> <br /><br />
        
        {showDelete && (
        <span className="is-flex is-justify-content-flex-end is-size-4 is-clickable " 
        style={{ color: "#1b262c" }}
        onClick={handleDelete}>
            Delete Everest
        </span>
        )}
        </article>
    </div>
    );
}

export default EverestCard;