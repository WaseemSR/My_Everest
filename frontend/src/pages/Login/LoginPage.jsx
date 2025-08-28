import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authentication";
import { getUserById } from "../../services/users";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with email:", email);

      const token = await login(email, password);
      if (!token) {
        throw new Error("No token returned from login");
      }

      console.log("Login successful, token:", token);
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("storage"));

      const me = await getUserById("me", token);
      console.log("Fetched user:", me);

      if (me?.user?._id) {
        localStorage.setItem("userId", me.user._id);
      } else {
        throw new Error("User ID not found in response");
      }

      console.log("Navigating to /posts");
      navigate("/posts");
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Invalid email or password.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
   <div>
    <Header showNav={true}/>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-lg shadow-xl border border-zinc-700">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold">Welcome to MyEverest</h1>
          <p className="mt-1 text-sm text-zinc-400">Sign in to go to your profile page</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="input-box">
            <label htmlFor="email" className="block text-sm mb-2 font-semibold">Email:</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-box">
            <label htmlFor="password" className="block text-sm mb-2 font-semibold">Password:</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

          <button
            type="submit"
            aria-label="Login"
            role="submit-button"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-semibold transition-colors"
          >
            Login
          </button>
        </form>
        <Footer/>
      </div>
      </div>
    </div>
  );
}

