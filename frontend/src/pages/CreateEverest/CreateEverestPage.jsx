import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEverest } from "../../services/everests";
import "bulma/css/bulma.min.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export function CreateEverestPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");

  const [error, setError] = useState("");

  const addMilestone = () => {
    const desc = newMilestoneDesc.trim();
    if (!desc) {
      setError("Description cannot be empty");
      return;
    }
    setError("");
    setMilestones((prev) => [...prev, { description: desc, completed: false }]);
    setNewMilestoneDesc("");
  };

  const removeMilestone = (index) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const onMilestoneKeyDown = (event) => { // So you can create a milestone by hitting enter
    if (event.key === "Enter") {
      event.preventDefault();
      addMilestone();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const cleanedMilestones = milestones
      .filter((m) => m?.description?.trim())
      .map((m) => ({ description: m.description.trim(), completed: false }));

    try {
      const res = await createEverest(
        name.trim(),
        details,
        startDate || undefined,
        endDate || undefined,
        cleanedMilestones
      );

      if (res?.token) localStorage.setItem("token", res.token);

      navigate("/profile");
    } catch (err) {
      console.error("Create everest failed:", err);
      setError("Could not create Everest. Please try again.");
    }
  };

  return (
    <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>
      <Header showNav={true} />

    <main className="is-flex-grow-1 p-5" style={{ backgroundColor: "#1b262c" }}>
    <section className="section">
      <div className="container">
        <h1 className="title is-size-1 has-text-weight-light has-text-white">Create an Everest</h1>

        {error && <div className="notification is-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label has-text-white">
              Title
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="What's the goal?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label has-text-white">Details</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="What’s the plan?"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
          </div>

          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label has-text-white">Start date</label>
                <div className="control">
                  <input
                    className="input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label has-text-white">End date</label>
                <div className="control">
                  <input
                    className="input"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label has-text-white">Milestones</label>

            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  placeholder="Add a milestone..."
                  value={newMilestoneDesc}
                  onChange={(e) => setNewMilestoneDesc(e.target.value)}
                  onKeyDown={onMilestoneKeyDown}
                  aria-label="Milestone description"
                />
              </div>
              <div className="control">
                <button
                  type="button"
                  className="button is-link" style={{ backgroundColor: "#addfad", color: "#1b262c", border: "none"}}
                  onClick={addMilestone}
                  disabled={!newMilestoneDesc.trim()}
                >
                  Add
                </button>
              </div>
            </div>

            {milestones.length > 0 ? (
              <div className="box">
                <div className="content">
                  <ol>
                    {milestones.map((milestone, i) => (
                      <li
                        key={`${milestone.description}-${i}`}
                        style={{
                          borderBottom: i < milestones.length - 1 ? "1px solid #f0f0f0" : "none",
                          padding: "0.5rem"
                        }}
                      >
                        <div className="level is-mobile">
                          <div className="level-left">
                            <span>{milestone.description}</span>
                          </div>
                          <div className="level-right">
                            <button
                              type="button"
                              className="button is-my-purple is-small is-light is-danger"
                              onClick={() => removeMilestone(i)}
                              aria-label={`Remove milestone ${i + 1}: ${milestone.description}`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <p className="has-text-white">No milestones added yet</p>
            )}
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button className="button is-my-green" type="submit">
                Create
              </button>
            </div>
            <div className="control">
              <button className="button is-my-yellow" type="button" onClick={() => navigate(-1)}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
    
    </main>

    <Footer />
    </div>
  );
}
