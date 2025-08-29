import Logo from "/MyEverestLogo.png";
import NavBar from "../components/NavBar";

function Header({ showNav = true }) {
  return (
    <header>
      <div>
        <img src={Logo} alt="Logo" />
      </div>

      {showNav && <NavBar />}
    </header>
  );
}

export default Header;
