import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function NavBar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="navbar-menu">
      <div className="navbar-end">

        {/* Show Home button only on Profile, Create Everest, and Everest pages */}
        {(path === "/profile" || path === "/createeverest" || path.startsWith("/everests")) && (
          <Link to="/posts" className="navbar-item button is-my-orange mr-5">
            Home
          </Link>
        )}



        {/* Show My Profile Button only on home/feedpage/posts, Everest and Create Everest */}
        {(path === "/posts" || path === "/createeverest" || path.startsWith("/everests")) && (
          <Link to="/profile" className="navbar-item button is-my-orange mr-5">
            My Profile
          </Link>
        )}

        {/* Show Create Everest button only on the Profile page */}
        {path === "/profile" && (
          <Link to="/createeverest" className="navbar-item button is-my-orange mr-5">
            Add Everest
          </Link>
        )}

        {/* Show Log In button only on the Sign Up page */}
        {path === "/signup" && (
          <Link to="/login" className="navbar-item button is-my-orange mr-5">
            Log In
          </Link>
        )}

        {/* Show Sign Up button only on the Log In page */}
        {path === "/login" && (
          <Link to="/signup" className="navbar-item button is-my-orange mr-5">
            Sign Up
          </Link>
        )}

        {/* Show Log Out Button only on home/feedpage/posts, Everest, Create Everest and My Profile pages  */}
        {(path === "/posts" || path === "/profile" || path === "/createeverest" || path.startsWith("/everests")) && (
          <div className="navbar-item button is-my-orange mr-5">
            <LogoutButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;