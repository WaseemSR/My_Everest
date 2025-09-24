import { Link } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import Logo from "/Just_logo_transparent.png";

export function HomePage() {
  return (
    <div
      className="is-flex is-flex-direction-column"
      style={{ minHeight: "100vh", position: "relative" }} // ✅ Made this relative
    >
      <img
    src="/my_everest_background.png"
    alt="Background"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: -1, 
    }}
  />

      {/* Header pinned to the top */}
      <Header showNav={true} />

      {/* Main content */}
      <main className="home is-flex-grow-1 is-flex is-justify-content-center is-align-items-center">
        <div className="home-content has-text-centered">
          <img src={Logo} alt="Logo" style={{ maxHeight: "13rem", width: "auto" }} />
          <h1 className="home-title is-size-1 has-text-weight-light mt-6 mb-3 has-text-white">
            Welcome to My Everest
          </h1>
          <p className="has-text-white has-text-weight-light is-size-4 mb-2">Dream it, Track it, Share it!</p>
          <p className="has-text-white has-text-weight-light is-size-4 mb-5">Turn dreams into milestones, and milestones into memories.</p>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
