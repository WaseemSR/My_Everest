import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { signup } from "../../services/authentication";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await signup(email, password, fullName, bio);
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/signup");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleFullNameChange(event) {
    setFullName(event.target.value);
  }

  function handleBioChange(event) {
    setBio(event.target.value);
  }

  return (
     <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>

      <video
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1, // sit behind all content
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Mountain_Range.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Header pinned to the top */}
      <Header showNav={true} />

      <main className="home is-flex-grow-1 is-flex is-justify-content-center is-align-items-center"
      
      >
      <div className="has-text-centered">
      <h2 className="is-size-2 has-text-weight-light mt-5 mb-5 has-text-white">Create Your Account</h2>
      <div className="container" style={{ maxWidth: "400px" }}>
        <form onSubmit={handleSubmit} className="is-flex is-flex-direction-column">
          <label className="form-label has-text-white" htmlFor="name">Full Name:</label>
          <input
            className="input-underline mb-5"
            placeholder="Full Name"
            style={{ color: "white" }}
            id="name"
            type="text"
            value={fullName}
            
            onChange={handleFullNameChange}
          />

          <label className="form-label has-text-white" htmlFor="email">Email:</label>
          <input
            className="input-underline mb-5"
            placeholder="email"
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
          />

          <label className="form-label has-text-white" htmlFor="password">Password:</label>
          <input
            className="input-underline mb-5"
            placeholder="Password"
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />

          <label className="form-label has-text-white" htmlFor="bio">Bio:</label>
          <input
            className="input-underline mb-5"
            placeholder="Tell us about yourself..."
            id="bio"
            type="text"
            value={bio}
            onChange={handleBioChange}
          />

          <div className="field mt-5">
            <div className="control buttons is-justify-content-center">
              <input
                role="submit-button"
                id="submit"
                type="submit"
                value="Sign Up"
                className="button is-my-orange"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
    </main>

    <Footer />
    </div>
  );
}
