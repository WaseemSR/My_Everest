import "./EverestCard.css";

function EverestCard({ everest }) {
  if (!everest) {
    return <div>No data</div>;
  }

return (
    <div className="column is-one-third">
        <article
        className="box is-hoverable"
        style={{ minHeight: "300px", maxHeight: "300px", overflowY: "auto", backgroundColor: "#f1c892" }}
        >
        <h2 className="title is-3">{everest.name}</h2>
        <hr style={{ border: "none", borderTop: "3px solid #1b262c" }} />
        <p className="is-size-5">{everest.details}</p>
        </article>
    </div>
    );
}

export default EverestCard;