import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          placeholder="email"
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <label htmlFor="full name">Full Name:</label>
        <input
          placeholder="Full Name"
          id="name"
          type="name"
          value={fullName}
          onChange={handleFullNameChange}
        />
        <label htmlFor="bio">Bio:</label>
        <input
          placeholder="Tell us about yourself..."
          id="bio"
          type="text"
          value={bio}
          onChange={handleBioChange}
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    </>
  );
}
