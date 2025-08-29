import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEverest } from "../../services/everests";
import "bulma/css/bulma.min.css";

export function CreateEverestPage() {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [milestone, setMilestone] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await createEverest(name, details, startDate, endDate, milestone);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      navigate("/createeverest");
    }
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleDetailsChange(event) {
    setDetails(event.target.value);
  }

  function handleStartDateChange(event) {
    setStartDate(event.target.value);
  }

  function handleEndDateChange(event) {
    setEndDate(event.target.value);
  }

  function handleMilestoneChange(event) {
    setMilestone(event.target.value);
  }


  return (
    <>
      <div className="box has-background-primary" >
      <form onSubmit={handleSubmit}>
        <h1 className="title is-1" >Create Your Own Everest</h1>
        <label className="label is-medium" htmlFor="name">Name:</label>
        <input className="control"
          id="name"
          type="text"
          value={name}
          onChange={handleNameChange}
        /> 
        <label className="label is-medium" htmlFor="details">Details:</label>
        <div className="control">
          <textarea
            className="textarea is-medium"
            placeholder="Please insert details here"
            id="details"
            value={details}
            onChange={handleDetailsChange}
          ></textarea>
        </div> 
        <label className="label is-medium" htmlFor="startDate">Start Date:</label>
        <input className="control"
          id="startDate"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <label className="label is-medium" htmlFor="endDate">End Date:</label>
        <input className="control"
          id="endDate"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
        /> 
        <label className="label is-medium" htmlFor="milestone">Milestone:</label>
        <input className="control"
          id="milestone"
          type="text"
          value={milestone}
          onChange={handleMilestoneChange}
        /> <br /><br />
        <div>
        <input className="control" role="submit-button" id="submit" type="submit" value="Submit" />
        </div>
      </form>
      </div>

    </>
  );
}
