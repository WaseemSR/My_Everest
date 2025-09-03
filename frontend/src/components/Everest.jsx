

function Everest({ everest, onToggleMilestone}) {
    if (!everest) return null;

    

    return (
        <article>
        <h2 className="is-size-1 has-text-weight-light has-text-white mt-6 mb-6">{everest.name}</h2>
        <p>{everest.details}</p>
        <p>Start Date: {new Date(everest.startDate).toLocaleDateString("en-GB")}</p>
        <p>End Date: {new Date(everest.endDate).toLocaleDateString("en-GB")}</p>
        <h3 className="title is-5 mt-4">Milestones</h3>
        {everest.milestones?.length ? (
            <ul className="content">
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
            </ul>
        ) : (
            <p>No milestones yet</p>
        )}
        </article>
    );
}

export default Everest;