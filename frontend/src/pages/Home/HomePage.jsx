import { Link } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import Logo from "/MyEverestLogo.png";

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
          <img src={Logo} alt="Logo" style={{ maxHeight: "13rem", width: "auto" }}/>
          <h1 className="home-title is-size-1 has-text-weight-light mt-6 mb-6">Welcome to My Everest</h1>
          <div className="buttons is-justify-content-center">
            <Link to="/signup" className="button is-my-orange mr-5">
              Sign Up
            </Link>
            <Link to="/login" className="button is-my-orange">
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

