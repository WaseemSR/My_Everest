import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { signup } from "../../services/authentication";

import UploadWidget from "../../components/UploadWidget";

// --- Debounce hook ---
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

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

  const [username, setUsername] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const [bio, setBio] = useState("");

  const debouncedUsername = useDebounce(username, 400);
  const navigate = useNavigate();

  const formRef = useRef(null);
  const confirmRef = useRef(null);

  const [imageUrl, setImageUrl] = useState("");

  // --- Username availability check ---
  useEffect(() => {
    if (!usernameTouched) return;
    if (!debouncedUsername || debouncedUsername.length < 4) {
      setUsernameError("Username must be at least 4 characters long");
      return;
    }

    let active = true;

    fetch(`/tokens/check-username?username=${encodeURIComponent(debouncedUsername)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setUsernameError(data.exists ? "Username already taken" : "");
      })
      .catch((err) => {
        console.error("Failed to check username:", err);
        if (active) setUsernameError("");
      });

    return () => {
      active = false; // cancel outdated requests
    };
  }, [debouncedUsername, usernameTouched]);

  // --- Handlers ---
  function handleEmailChange(e) {
    const val = e.target.value.trim().toLowerCase();
    setEmail(val);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (e.target.validity.valid && emailRegex.test(val)) {
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email address");
    }
  }

  function handlePasswordChange(e) {
    const val = e.target.value;
    setPassword(val);

    if (val.length < 8) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one special character"
      );
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
      setPasswordError("Must include at least one special character");
    } else {
      setPasswordError("");
    }

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

  function handleBioChange(e) {
    setBio(e.target.value);
  }

  // Keep confirm error in sync if password changes
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

  // Form validation state
  const canSubmit =
    formRef.current?.checkValidity() === true &&
    password.length >= 8 &&
    password === confirmPassword &&
    username.length >= 4;

  async function handleSubmit(event) {
    event.preventDefault();

    if (formRef.current && !formRef.current.reportValidity()) {
      setEmailTouched(true);
      setPasswordTouched(true);
      setConfirmTouched(true);
      setUsernameTouched(true);
      return;
    }

    if (!canSubmit) {
      setEmailTouched(true);
      setPasswordTouched(true);
      setConfirmTouched(true);
      setUsernameTouched(true);
      return;
    }

    try {
      await signup(email, password, username, bio, imageUrl);
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/signup");
    }
  }

  return (
    <div
      className="is-flex is-flex-direction-column"
      style={{ minHeight: "100vh" }}
    >
      <img
        src="/my_everest_background.png"
        alt="Background"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      <Header showNav={true} />

      <main className="home is-flex-grow-1 is-flex is-justify-content-center is-align-items-center">
        <div className="has-text-centered">
          <h2 className="is-size-2 has-text-weight-light mt-5 mb-5 has-text-white">
            Create Your Account
          </h2>
          <div className="container" style={{ maxWidth: "400px" }}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="is-flex is-flex-direction-column"
              noValidate={false}
            >
              {/* Username */}
              <label
                className="form-label has-text-white"
                htmlFor="name"
              >
                Username:
              </label>
              <input
                className="input-underline mb-1"
                placeholder="username"
                style={{ color: "white" }}
                id="name"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value); // spaces allowed
                  setUsernameTouched(true);
                }}
                minLength={4} // enforce minimum length at submit
                required
                autoComplete="name"
              />
              <p
                id="username-help"
                className={`help ${
                  usernameTouched && usernameError
                    ? "is-size-6 has-text-white"
                    : ""
                }`}
                aria-live="polite"
              >
                {usernameTouched && usernameError ? usernameError : " "}
              </p>

              {/* Email */}
              <label
                className="form-label has-text-white"
                htmlFor="email"
              >
                Email:
              </label>
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
              <p
                id="email-help"
                className={`help ${
                  emailTouched && emailError
                    ? "is-size-6 has-text-white"
                    : ""
                }`}
                aria-live="polite"
              >
                {emailTouched && emailError ? emailError : " "}
              </p>

              {/* Password */}
              <label
                className="form-label has-text-white"
                htmlFor="password"
              >
                Password:
              </label>
              <input
                className="input-underline mb-1"
                placeholder="password"
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
              <p
                id="password-help"
                className={`help ${
                  passwordTouched && passwordError
                    ? "is-size-6 has-text-white"
                    : ""
                }`}
                aria-live="polite"
              >
                {passwordTouched ? passwordError : ""}
              </p>

              {/* Confirm Password */}
              <label
                className="form-label has-text-white"
                htmlFor="confirmPassword"
              >
                Confirm Password:
              </label>
              <input
                className="input-underline mb-1"
                placeholder="confirm password"
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
              <p
                id="confirm-help"
                className={`help ${
                  confirmTouched && confirmError
                    ? "is-size-6 has-text-white"
                    : ""
                }`}
                aria-live="polite"
              >
                {confirmTouched && confirmError ? confirmError : " "}
              </p>

              {/* Upload Profile Image */}
              {imageUrl && (
                <div className="mb-2 has-text-centered">
                  <figure className="image is-96x96 is-inline-block">
                    <img
                      className="is-rounded mt-3"
                      src={imageUrl}
                      alt="Profile preview"
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </figure>
                </div>
              )}

              <UploadWidget setImageUrl={setImageUrl} />

              {/* Bio */}
              <label className="form-label has-text-white" htmlFor="bio">
                Bio:
              </label>
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