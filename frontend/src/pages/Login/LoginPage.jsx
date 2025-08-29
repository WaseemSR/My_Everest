import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Logo from "/MyEverestLogo.png";

import { login } from "../../services/authentication";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>
      {/* Header pinned to the top */}
      <Header showNav={true} />

      {/* Main content grows in the middle */}
      <main className="home is-flex-grow-1 is-flex is-justify-content-center is-align-items-center"
      style={{ backgroundColor: "#1b262c" }}
      >
        <div className="home-content has-text-centered">
          <img src={Logo} alt="Logo" style={{ maxHeight: "13rem", width: "auto" }}/> 
        <h1 className="home-title is-size-2 has-text-weight-light mt-5 mb-5">Login</h1>
          <div className="container" style={{ maxWidth: "400px" }}>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label" htmlFor="email">Email:</label>
                <div className="control">
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    className="input"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="password">Password:</label>
                <div className="control">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="input"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="field mt-5">
                <div className="control buttons is-justify-content-center">
                  <input
                    role="submit-button"
                    id="submit"
                    type="submit"
                    value="Submit"
                    className="button is-my-orange"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer pinned to the bottom */}
      <Footer />
    </div>
  );
}
