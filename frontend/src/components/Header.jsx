import { useState } from "react";
import hLogo from "/MyEverestLogoHeader.png";
import NavBar from "../components/NavBar";

function Header({ showNav = true }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ backgroundColor: "#091319", position: "sticky", top: 0, zIndex: 1000 }}>
      <nav className="navbar py-4" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <img
              src={hLogo}
              alt="Logo"
              style={{ height: "3.5rem", width: "auto" }}
            />
          </a>

          {showNav && (
            <a
              role="button"
              className={`navbar-burger is-my-orange ${menuOpen ? "is-active" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          )}
        </div>

        {showNav && (
          <div
            id="mainNavbar"
            className={`navbar-menu is-my-orange ${menuOpen ? "is-active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <div className="navbar-end">
              <NavBar />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
