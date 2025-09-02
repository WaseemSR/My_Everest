import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function NavBar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="navbar-menu">
      <div className="navbar-end">
        {/* Show LogoutButton only on /posts */}
        {path === "/posts" && (
          <div className="navbar-item">
            <LogoutButton />
          </div>
        )}

        {/* Show Sign Up / Log In only on specific pages */}
        {path !== "/signup" && path !== "/posts" && (
          <Link to="/signup" className="navbar-item button is-my-orange mr-5" >
            Sign Up
          </Link>
        )}
        {path !== "/login" && path !== "/posts" && (
          <Link to="/login" className="navbar-item button is-my-orange mr-5" >
            Log In
          </Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;