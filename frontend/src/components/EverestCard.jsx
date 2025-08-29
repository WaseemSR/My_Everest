function EverestCard({ everest }) {
  if (!everest) {
    return <div>No data</div>;
  }

return (
    <div className="column is-one-third">
        <article
        className="box"
        style={{ height: "200px", overflowY: "auto", backgroundColor: "#f1c892" }}
        >
        <h2 className="title is-4">{everest.name}</h2>
        <p>{everest.details}</p>
        </article>
    </div>
    );
}

export default EverestCard;