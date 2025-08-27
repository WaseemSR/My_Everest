import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function NavBar() {
  const location = useLocation();
  const path = location.pathname;
  

  return (
    <nav>
        <>
        {path === "/posts" && <LogoutButton />}
        </>

        <>
          {path !== "/signup" && path !== "/posts" && (
            <Link to="/signup">
              Sign Up
            </Link>
          )}
          {path !== "/login" && path !== "/posts" && (
            <Link to="/login">
              Log In
            </Link>
          )}
        </>
    </nav>
  );
}

export default NavBar;