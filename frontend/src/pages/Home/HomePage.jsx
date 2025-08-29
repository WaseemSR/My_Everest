import { Link } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export function HomePage() {
  return (
    
  <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>
      {/* Header pinned to the top */}
      <Header showNav={false} />

      {/* Main content grows in the middle */}
      <main className="home is-flex-grow-1 is-flex is-justify-content-center is-align-items-center"
      style={{ backgroundColor: "#1b262c" }}
      >
        <div className="home-content has-text-centered">
          <h1 className="home-title">Welcome to My Everest</h1>
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

      {/* Footer pinned to the bottom */}
      <Footer />
    </div>
  );
}

