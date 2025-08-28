import Logo from "/MyEverestLogo.png";
import NavBar from "../components/NavBar";

function Header({ showNav = true }) {
  return (
    <header style={{ backgroundColor: "#091319", position: "sticky", top: 0, zIndex: 1000 }}>
      <nav className="navbar py-4" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <div className="navbar-item">
              <img src={Logo} alt="Logo" style={{ maxHeight: "5rem", width: "auto" }}/>
            </div>
            {/* optional burger can go here if needed */}
          </div>

          {showNav && (
            <div className="navbar-menu">
              <div className="navbar-end">
                <NavBar />
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;