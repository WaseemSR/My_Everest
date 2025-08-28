import { Link } from "react-router-dom";
import "./HomePage.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export function HomePage() {
  return (
    
  <div>
    <Header showNav={false}/>
      <main className="home">
        <div className="home-content">
          <h1 className="home-title">Welcome to MyEverest!</h1>
          <div className="home-buttons">
            <Link to="/signup" className="home-button">
              Sign Up
            </Link>
            <Link to="/login" className="home-button">
              Log In
            </Link>
          </div>
        </div>
      </main>
      <Footer/>
  </div>
  );
}

