function Everest({ everest }) {
    if (!everest) {
        return <div>No data</div>; // or just null
    }

    return (
        <article key={everest._id}>
        <h2 className="title is-4">{everest.name}</h2>
        <p>{everest.details}</p>
        <p>{everest.startDate}</p>
        <p>{everest.endDate}</p>
        <p>{everest.milestone}</p>
        </article>
    );
}

export default Everest;