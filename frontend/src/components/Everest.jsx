import { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import User from "./User";


function Everest({ everest, onMilestoneAdded, onToggleMilestone}) {
    if (!everest) return null;

    const [newDescription, setNewDescription] = useState("");

    const handleAddMilestone = async (e) => {
        e.preventDefault();
        const desc = newDescription.trim();
        if (!desc) return;

        try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}/everests/${everest._id}/milestones`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ description: desc }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            console.error("Milestone not added:", data.message || res.statusText);
            return;
        }

        const { milestone } = await res.json(); // per your controller suggestion
        onMilestoneAdded?.(everest._id, milestone);
        setNewDescription("");
        } catch (err) {
        console.error("request error:", err);
        }
    };

    return (
        <article>
        <h2 className="is-size-1 has-text-weight-light has-text-white mt-6 mb-6">{everest.name}</h2>
        <div className="box has-text-primary"><User user={everest.user} /></div>
        <p className="box title is-5 has-text-weight-normal has-text-white mb-5" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", maxWidth: "70rem", margin: "2.5rem auto" }} >{everest.details}</p>

        <div className="box" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", maxWidth: "28rem", margin: "2.5rem auto" }}>
            <h3 className="title is-3 has-text-white mt-4 has-text-weight-normal">Milestones</h3>
        <p className="title is-5 has-text-white mb-4 has-text-weight-normal">Start Date: {new Date(everest.startDate).toLocaleDateString("en-GB")}</p> <hr /> {/* creating line underneath startdate */}

        {everest.milestones?.length ? (
            <ol className="content has-text-white has-text-left p-3 title is-5 has-text-weight-normal">
            {everest.milestones.map((m) => (
                <li key={m._id}>
                <label
                    className="checkbox is-flex is-align-items-center"
                    style={{ width: "100%", justifyContent: "space-between" }}
                >
                    <span
                    className={m.completed ? "is-size-5 has-text-white" : ""}
                    style={{ flex: 1, paddingRight: "0.5rem" }}
                    >
                    {m.description}
                    </span>

                    <input
                    type="checkbox"
                    checked={m.completed}
                    onChange={(e) => onToggleMilestone?.(m._id, e.target.checked)}
                    style={{ transform: "scale(1.5)", marginLeft: "0.5rem", accentColor: "#addfad"}}
                    />
                </label>
                <hr /> {/* creating line underneath startdate */}
                </li>
            ))}
            
            <p className="title is-5 has-text-white mt-4 has-text-centered has-text-weight-normal">End Date: {new Date(everest.endDate).toLocaleDateString("en-GB")}</p>
            <form
                onSubmit={handleAddMilestone}
                className="field has-addons mt-4"
                style={{ padding: "0 1rem" }}
                >
                <div className="control is-expanded">
                <input
                    className="input"
                    type="text"
                    placeholder="New milestone…"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                /> 
                
                </div>
                <div className="control">
                <button
                    className="button is-link"   style={{ backgroundColor: "#addfad", color: "#1b262c", border: "none"}}
                    type="submit"
                    disabled={!newDescription.trim()}
                    title="Add milestone"
                >
                    Add
                </button>
                </div>
            </form>
            
            </ol>
        ) : (
            <p className="has-text-white">No milestones yet</p>
        )}
        </div>
        </article>
    );
}

export default Everest;