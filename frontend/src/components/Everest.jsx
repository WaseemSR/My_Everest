function Everest({ everest }) {
    if (!everest) {
        return <div>No data</div>; // or just null
    }

    return (
        <article key={everest._id}>
        <h2 className="title is-4">{everest.name}</h2>
        <p>{everest.details}</p>
        <p>Start Date: {new Date(everest.startDate).toLocaleDateString("en-GB")}</p>
        <p>End Date: {new Date(everest.endDate).toLocaleDateString("en-GB")}</p>
        <p>{everest.milestone}</p>
        </article>
    );
}

export default Everest;