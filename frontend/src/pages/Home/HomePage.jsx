import { Link } from "react-router-dom";

import "./HomePage.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export function HomePage() {
  return (
    <div>
      <Header showNav={false}/>
      <main className="home">
        <h1>Welcome to Acebook!</h1>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Log In</Link>
      </main>
      <Footer/>
    </div>
  );
}
