import { useEffect, useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import User from "./User";
import { updateEverest } from "../services/everests";


function Everest({ everest, onMilestoneAdded, onToggleMilestone, onEverestUpdated, currentUserId }) {
  if (!everest) return null;


  // --- existing ---
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");
  // Determine ownership (everest.user can be object or id)
  const ownerId = typeof everest.user === "object" && everest.user ? everest.user._id : everest.user;
  const isOwner = ownerId && currentUserId && String(ownerId) === String(currentUserId);

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
        body: JSON.stringify({ description: desc, date: newDate || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Milestone not added:", data.message || res.statusText);
        return;
      }

      const { milestone } = await res.json();
      onMilestoneAdded?.(everest._id, milestone);
      setNewDescription("");
      setNewDate("");
    } catch (err) {
      console.error("request error:", err);
    }
  };

  // --- NEW: edit state for top-level fields ---
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(everest.name || "");
  const [details, setDetails] = useState(everest.details || "");
  const [startDate, setStartDate] = useState((everest.startDate || "").slice(0, 10));
  const [endDate, setEndDate] = useState((everest.endDate || "").slice(0, 10));

  // keep local fields in sync if parent swaps the everest
  useEffect(() => {
    setName(everest.name || "");
    setDetails(everest.details || "");
    setStartDate((everest.startDate || "").slice(0, 10));
    setEndDate((everest.endDate || "").slice(0, 10));
  }, [everest]);

  // --- NEW: PATCH handler ---
  async function handleSave(e) {
    e?.preventDefault?.();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/everests/${everest._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, details, startDate, endDate }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Update failed:", data.message || res.statusText);
        return;
      }

      // backend returns { message, everest }
      onEverestUpdated?.(data.everest);
      setIsEditing(false);
    } catch (err) {
      console.error("request error:", err);
    } finally {
      setSaving(false);
    }
  }
    return (
        <article>
        <h2 className="is-size-1 has-text-weight-light has-text-white mt-6 mb-6">{everest.name}</h2>
        <div className="mb-5"><User user={everest.user} /></div>
        <p className="box title is-5 has-text-weight-normal has-text-white mb-5" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", maxWidth: "70rem", margin: "2.5rem auto" }} >{everest.details}</p>
        {isOwner && (
          <button
            className="button is-my-green has-text-white"
            onClick={() => setIsEditing(true)}
            aria-haspopup="dialog"
            aria-controls="edit-everest-modal"
            style={{ marginTop: "1.5rem" }}
          >
            Edit Everest
          </button>
        )}
        <div className="box" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", maxWidth: "28rem", margin: "2.5rem auto" }}>
            <h3 className="title is-3 has-text-white mt-4 has-text-weight-normal">Milestones</h3>
            <p className="title is-5 has-text-white mb-4 has-text-weight-normal">Start Date: {new Date(everest.startDate).toLocaleDateString("en-GB")}</p>
            <hr />

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

                    {m.description} {m.date ? `- ${new Date(m.date).toLocaleDateString("en-GB")}` : ""}
                    

                    </span>

                    <input
                        type="checkbox"
                        checked={m.completed}
                        onChange={(e) => onToggleMilestone?.(m._id, e.target.checked)}
                        style={{ transform: "scale(1.5)", marginLeft: "0.5rem", accentColor: "#addfad" }}
                    />
                    </label>
                    <hr />
                </li>
                ))}
            </ol>
            ) : (
            <p className="has-text-white">No milestones yet</p>
            )}

            <p className="title is-5 has-text-white mt-4 has-text-centered has-text-weight-normal">End Date: {new Date(everest.endDate).toLocaleDateString("en-GB")}</p>
            
            {isOwner && (
              <form
                onSubmit={handleAddMilestone}
                className="mt-4"
                style={{ padding: "0 1rem" }}
              >
                <div className="field">
                  <label className="label is-small has-text-white">Add new milestone</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="New milestone…"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label is-small has-text-white">Target milestone completion date</label>
                  <div className="control">
                    <input
                      className="input"
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field is-grouped is-justify-content-flex-end">
                  <div className="control">
                    <button
                      className="button is-link"
                      style={{ backgroundColor: "#addfad", color: "#1b262c", border: "none" }}
                      type="submit"
                      disabled={!newDescription.trim()}
                      title="Add milestone"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            )}
        </div>
          {/* --- BULMA MODAL --- */}
    {isOwner && (
      <div id="edit-everest-modal" className={`modal ${isEditing ? "is-active" : ""}`} role="dialog" aria-modal="true">
        <div className="modal-background" onClick={() => setIsEditing(false)} />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Edit Everest</p>
            <button className="delete" aria-label="close" onClick={() => setIsEditing(false)} />
          </header>

          <section className="modal-card-body">
            <form onSubmit={handleSave}>
              <div className="field">
                <label className="label is-small">Name</label>
                <div className="control">
                  <input
                    className="input is-small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Everest name"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label is-small">Details</label>
                <div className="control">
                  <textarea
                    className="textarea is-small"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="What’s this Everest about?"
                    rows={4}
                  />
                </div>
              </div>

              <div className="field is-grouped">
                <div className="control">
                  <label className="label is-small">Start</label>
                  <input
                    type="date"
                    className="input is-small"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="control ml-3">
                  <label className="label is-small">End</label>
                  <input
                    type="date"
                    className="input is-small"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

            </form>
          </section>

          <footer className="modal-card-foot">
            <button
              className={`button is-primary ${saving ? "is-loading" : ""}`}
              onClick={handleSave}
            >
              Save changes
            </button>
            <button className="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </footer>
        </div>
      </div>
    )}
        </article>

    );
}

export default Everest;
