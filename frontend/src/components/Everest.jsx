

function Everest({ everest, onToggleMilestone}) {
    if (!everest) return null;

    

    return (
        <article>
        <h2 className="is-size-1 has-text-weight-light has-text-white mt-6 mb-6">{everest.name}</h2>
        <p className="is-size-5 has-text-weight-light has-text-white mb-5">{everest.details}</p>
        <div className="box" style={{ backgroundColor: "#94a0a9" }}>
            <h3 className="title has-text-white is-5 mt-4">Milestones</h3>
        <p className="has-text-white mb-4">Start Date: {new Date(everest.startDate).toLocaleDateString("en-GB")}</p>
        {everest.milestones?.length ? (
            <ul className="content has-text-white">
            {everest.milestones.map((m) => (
                <li key={m._id}>
                <label className="checkbox">
                    <input
                    type="checkbox"
                    checked={m.completed}
                    onChange={(e) => onToggleMilestone?.(m._id, e.target.checked)}
                    />
                    <span className={m.completed ? "has-text-white" : ""}>
                    &nbsp;{m.description}
                    </span>
                </label>
                </li>
            ))}
            <p className="has-text-white mt-4">End Date: {new Date(everest.endDate).toLocaleDateString("en-GB")}</p>
            </ul>
        ) : (
            <p className="has-text-white">No milestones yet</p>
        )}
        </div>
        </article>
    );
}

export default Everest;