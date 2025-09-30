import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function NavBar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      {/* Show Home button only on Profile, Create Everest, and Everest pages */}
      {(path === "/profile" || path === "/createeverest" || path.startsWith("/everests")) && (
        <div className="navbar-item">
          <Link to="/posts" className="button is-my-orange mr-5">Home</Link>
        </div>
      )}


      {/* Show My Profile Button only on home/feedpage/posts, Everest and Create Everest */}
      {(path === "/posts" || path === "/createeverest" || path.startsWith("/everests")) && (
        <div className="navbar-item">
          <Link to="/profile" className="button is-my-orange mr-5">My Profile</Link>
        </div>
      )}


      {/* Show Create Everest button only on the Profile page */}
      {path === "/profile" && (
        <div className="navbar-item">
          <Link to="/createeverest" className="button is-my-orange mr-5">Add Everest</Link>
        </div>
      )}

      {/* Show Log In button only on the Sign Up page */}
      {path === "/signup" && (
        <div className="navbar-item">
          <Link to="/login" className="button is-my-orange mr-5">Log In</Link>
        </div>
      )}

      {/* Show Sign Up button only on the Log In page */}
      {path === "/login" && (
        <div className="navbar-item">
          <Link to="/signup" className="button is-my-orange mr-5">Sign Up</Link>
        </div>
      )}

      {/* Show About button only on the Homepage (first page) */}
      {path === "/" && (
        <div className="navbar-item">
          <Link to="/about" className="button is-my-orange mr-5">About</Link>
        </div>
      )}

      {/* Show Home button only on the About page */}
      {path === "/about" && (
        <div className="navbar-item">
          <Link to="/" className="button is-my-orange mr-5">Home</Link>
        </div>
      )}

      {/* Show Log Out Button only on home/feedpage/posts, Everest, Create Everest and My Profile pages */}
      {(path === "/posts" || path === "/profile" || path === "/createeverest" || path.startsWith("/everests")) && (
        <div className="navbar-item">
          <span className="button is-my-orange mr-5">
            <LogoutButton />
          </span>
        </div>
      )}
    </>
  );
}

export default NavBar;
