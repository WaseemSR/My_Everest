import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { signup } from "../../services/authentication";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");

  const navigate = useNavigate();

  const formRef = useRef(null);
  const confirmRef = useRef(null);

  // --- handlers ---
  function handleEmailChange(e) {
    const val = e.target.value.trim().toLowerCase();
    setEmail(val);
    // Let the browser validate the format
    if (e.target.validity.valid) {
      setEmailError("");
    } else {
      setEmailError(e.target.validationMessage || "Please enter a valid email");
    }
  }

  function handlePasswordChange(e) {
    const val = e.target.value;
    setPassword(val);

    // Simple length rule (browser will also enforce via minLength)
    if (val.length < 8) {
      setPasswordError("At least 8 characters");
    } else {
      setPasswordError("");
    }

    // Re-validate confirm when password changes
    if (confirmRef.current) {
      if (confirmPassword && confirmPassword !== val) {
        confirmRef.current.setCustomValidity("Passwords must match");
        setConfirmError("Passwords must match");
      } else {
        confirmRef.current.setCustomValidity("");
        setConfirmError("");
      }
    }
  }

  function handleConfirmPasswordChange(e) {
    const val = e.target.value;
    setConfirmPassword(val);

    if (val !== password) {
      e.target.setCustomValidity("Passwords must match");
      setConfirmError("Passwords must match");
    } else {
      e.target.setCustomValidity("");
      setConfirmError("");
    }
  }

  function handleFullNameChange(e) {
    setFullName(e.target.value);
  }

  function handleBioChange(e) {
    setBio(e.target.value);
  }

  // Also re-check confirm any time password changes (covers paste cases)
  useEffect(() => {
    if (!confirmRef.current) return;
    if (confirmPassword && confirmPassword !== password) {
      confirmRef.current.setCustomValidity("Passwords must match");
      setConfirmError("Passwords must match");
    } else {
      confirmRef.current.setCustomValidity("");
      setConfirmError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  // Compute whether the form can submit
  const canSubmit =
    formRef.current?.checkValidity() === true &&
    password.length >= 8 &&
    password === confirmPassword;

  async function handleSubmit(event) {
    event.preventDefault();

    // Let the browser point at the first invalid field
    if (formRef.current && !formRef.current.reportValidity()) {
      // Mark all as touched so messages show
      setEmailTouched(true);
      setPasswordTouched(true);
      setConfirmTouched(true);
      return;
    }

    if (!canSubmit) {
      setEmailTouched(true);
      setPasswordTouched(true);
      setConfirmTouched(true);
      return;
    }

    try {
      await signup(email, password, fullName, bio);
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/signup");
    }
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
          zIndex: -1,
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Mountain_Range.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Header showNav={true} />

      <main className="home is-flex-grow-1 is-flex is-justify-content-center is-align-items-center">
        <div className="has-text-centered">
          <h2 className="is-size-2 has-text-weight-light mt-5 mb-5 has-text-white">Create Your Account</h2>
          <div className="container" style={{ maxWidth: "400px" }}>
            <form ref={formRef} onSubmit={handleSubmit} className="is-flex is-flex-direction-column" noValidate={false}>
              {/* Full Name */}
              <label className="form-label has-text-white" htmlFor="name">Full Name:</label>
              <input
                className="input-underline mb-1"
                placeholder="Full Name"
                style={{ color: "white" }}
                id="name"
                type="text"
                value={fullName}
                onChange={handleFullNameChange}
                autoComplete="name"
              />
              <p className="help" aria-hidden="true">&nbsp;</p>

              {/* Email */}
              <label className="form-label has-text-white" htmlFor="email">Email:</label>
              <input
                className="input-underline mb-1"
                placeholder="email"
                id="email"
                type="email"
                inputMode="email"
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                aria-describedby="email-help"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setEmailTouched(true)}
              />
              <p id="email-help" className={`help ${emailTouched && emailError ? "is-size-6 is-danger" : ""} `} aria-live="polite">
                {emailTouched && emailError ? emailError : " "}
              </p>

              {/* Password */}
              <label className="form-label has-text-white" htmlFor="password">Password:</label>
              <input
                className="input-underline mb-1"
                placeholder="Password"
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                aria-describedby="password-help"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setPasswordTouched(true)}
              />
              <p id="password-help" className={`help ${passwordTouched && passwordError ? "is-size-6 is-danger" : ""}`} aria-live="polite">
                {passwordTouched && passwordError ? passwordError : "At least 8 characters"}
              </p>

              {/* Confirm Password */}
              <label className="form-label has-text-white" htmlFor="confirmPassword">Confirm Password:</label>
              <input
                className="input-underline mb-1"
                placeholder="Confirm Password"
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                aria-describedby="confirm-help"
                ref={confirmRef}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={() => setConfirmTouched(true)}
              />
              <p id="confirm-help" className={`help ${confirmTouched && confirmError ? "is-size-6 is-danger" : ""}`} aria-live="polite">
                {confirmTouched && confirmError ? confirmError : " "}
              </p>

              {/* Bio */}
              <label className="form-label has-text-white" htmlFor="bio">Bio:</label>
              <input
                className="input-underline mb-5"
                placeholder="Tell us about yourself..."
                id="bio"
                type="text"
                value={bio}
                onChange={handleBioChange}
                autoComplete="organization-title"
              />

              {/* Submit */}
              <div className="field mt-5">
                <div className="control buttons is-justify-content-center">
                  <input
                    role="submit-button"
                    id="submit"
                    type="submit"
                    value="Sign Up"
                    className="button is-my-orange"
                    disabled={!canSubmit}
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