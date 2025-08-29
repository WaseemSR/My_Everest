import hLogo from "/MyEverestLogoHeader.png";
import NavBar from "../components/NavBar";

function Header({ showNav = true }) {
  return (
    <header style={{ backgroundColor: "#091319", position: "sticky", top: 0, zIndex: 1000 }}>
      <nav className="navbar py-4" role="navigation" aria-label="main navigation">
        {/* remove .container so logo can go all the way left */}
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <img
              src={hLogo}
              alt="Logo"
              style={{ height: "3.5rem", width: "auto" }} // adjust size here
            />
          </a>
          {/* Burger menu could be added here if needed */}
        </div>

          {showNav && (
            <div className="navbar-menu">
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