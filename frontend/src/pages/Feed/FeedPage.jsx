import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEverests } from "../../services/everests"
import Everest from "../../components/Everest"
// import { getPosts } from "../../services/posts";
// import Post from "../../components/Post";
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
    <>
      {/* <h2>Posts</h2>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div> */}
       <h1>Everests</h1>     {/*  This is the small bit added for the everests to be seen on feedpage */}
      <div className="feed" role="feed">
        {everests.map((everest) => (
          <Everest everest={everest} key={everest._id} />
        ))}
      </div>
      <LogoutButton />
    </>
  );
}
