import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEverests } from "../../services/everests"
import EverestCard from "../../components/EverestCard"
// import { getPosts } from "../../services/posts";
// import Post from "../../components/Post";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import LogoutButton from "../../components/LogoutButton";

export function FeedPage() {
  // const [posts, setPosts] = useState([]);
  const [everests, setEverests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      // getPosts(token)
      //   .then((data) => {
      //     setPosts(data.posts);
      //     localStorage.setItem("token", data.token);
      //   })
      getEverests(token)
        .then((data) => {
          setEverests(data.everests);
          console.log("FeedPage", data.token)
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  return (
    <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>

      <Header showNav={true} />

      
        <main className="is-flex-grow-1 p-5" style={{ backgroundColor: "#1b262c" }}>
          <h1 className="is-size-1 has-text-weight-light mt-6 mb-6 has-text-white">Explore Everests</h1>     {/*  This is the small bit added for the everests to be seen on feedpage */}
          <div className="columns is-multiline equal-columns">
            {everests.map((ev) => (
              <EverestCard key={ev._id} everest={ev} />
            ))}
          </div>
        </main>

      <Footer />
    </div>
  );
}
{/* <h2>Posts</h2>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div> */}