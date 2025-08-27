import { Link } from "react-router-dom";
import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home">
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
    </div>
  );
}

