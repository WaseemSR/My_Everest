import { useState } from "react";

function HelpCreateEverest () {
    const [isOpen, setIsOpen] = useState(false);


    return (
    <article>
        <button className="button is-my-purple" onClick={() => setIsOpen(true)}>Help</button>
        <div className={`modal ${isOpen ? "is-active" : ""}`}>
            <div className="modal-background"/>
            <div className="modal-card" >
                <header className="modal-card-head" style={{
              backgroundColor: "rgba(241, 200, 146)"}}>
                    <p className="modal-card-title title is-size-2 mt-6">Instructions</p>
                </header>
                <section className="modal-card-body">
                    <h3 className="title is-size-5">Title</h3>
                    <p>What’s the name of your dream? Give it a title that inspires you.</p>
                </section>
                 <section className="modal-card-body">
                    <h3 className="title is-size-5">Details</h3>
                    <p>What do you want to achieve, and why does it matter to you? There’s no rush—if you prefer, you can create your Everest without adding too much detail right away.</p>
                </section>
                <section className="modal-card-body">
                    <h3 className="title is-size-5">Start and End Date</h3>
                    <p>When do you plan to begin working towards this goal? 
                    When would you like to complete it? 
                    Not sure yet? Leave either blank and set your dates later.</p>
                </section>
                <section className="modal-card-body">
                    <h3 className="title is-size-5">Milestones</h3>
                    <p>Milestones are the key steps or achievements needed along the way to reaching your Everest. 
                    You don’t need to add them all now—you can build them as you go or even get ideas from others.</p>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-my-green" onClick={() => setIsOpen(false)}>Close</button>
                </footer>
            </div>
        </div>
    </article>
    )
}

export default HelpCreateEverest;