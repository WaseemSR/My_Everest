import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  function logOut() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <button onClick={logOut} className="button is-my-orange mr-5">
      Log out
    </button>
  );
}

export default LogoutButton;
