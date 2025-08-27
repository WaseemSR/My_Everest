import "bulma/css/bulma.min.css";

function Everest(props) {
    return (
        <section className="">
        <article key={props.everest._id}>
            <h3>{props.everest.name}</h3>
            <p>{props.everest.details}</p>
            <p>{props.everest.startDate}</p>
            <p>{props.everest.endDate}</p>
            <p>{props.everest.milestone}</p>
        </article>
        </section>
    );
}

export default Everest;
