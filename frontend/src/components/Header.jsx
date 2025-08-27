import Logo from "/MyEverestLogo.png";
import NavBar from "../components/NavBar";

function Header({showNav = true}) {
  return (
    <header>
      <h1>
        <img src={Logo} alt="Logo"/>
      </h1>

      {showNav && <NavBar />}
    </header>
  );
}

export default Header;