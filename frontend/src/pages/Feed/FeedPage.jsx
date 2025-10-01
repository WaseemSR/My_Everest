import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEverests } from "../../services/everests"
import EverestCard from "../../components/EverestCard"
import "../../components/EverestCard.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import LogoutButton from "../../components/LogoutButton";

export function FeedPage() {

  const [everests, setEverests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {

      getEverests(token)
        .then((data) => {
          setEverests(data.everests);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }


  return (
    <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>

      <Header showNav={true} />

        <main className="is-flex-grow-1 p-5" style={{ backgroundColor: "#1b262c" }}>
          <h1 className="has-text-weight-light mt-6 mb-6 has-text-white my-mega-title">Explore Everests</h1> <br />
          <p className="box is-size-4 has-text-white has-text-weight-light has-text-centered" style={{ maxWidth: "70rem", background: "transparent", margin: "0 auto" }} >
            Every Everest tells a story of ambition, persistence, and progress. Here, you can see the peaks others are chasing, from 
            bold life goals to everyday triumphs and find inspiration for your own journey. Because when you witness what’s possible, 
            your next Everest starts to feel within reach.</p>

          <div className="columns is-multiline equal-columns mt-6">
            {everests.map((ev) => (
              <EverestCard key={ev._id} everest={ev} />
            ))}
          </div>
        </main>

      <Footer />
    </div>
  );
}
