import React, { useEffect, useState, useCallback } from "react";
import { throttle } from "lodash";
import "./App.css";
import ScrollToTopButton from "./Scroll";
import ChannelService from "./ChannelService";

const NULL_IMG = process.env.REACT_APP_NULL_IMG;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const CHANEEL_TALK_KEY = process.env.REACT_APP_CHANEEL_TALK_KEY;
function Post({ id, post }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  };

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + post.images.length) % post.images.length
    );
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ marginRight: "20px" }}>{post.user.name}</h2>
        <img
          src={post.user.profile.avartar || NULL_IMG}
          alt={`${post.user.name}'s avatar`}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: "1px solid #d9d9d9",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          height: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handlePrevClick}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            width: "30px",
            height: "30px",
            backgroundColor: "#d9d9d9",
            border: "none",
            cursor: "pointer",
            clipPath: "polygon(100% 0%, 0% 50%, 100% 100%)",
          }}
        >
          {" "}
        </button>

        <button
          onClick={handleNextClick}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            width: "30px",
            height: "30px",
            backgroundColor: "#d9d9d9",
            border: "none",
            cursor: "pointer",
            clipPath: "polygon(0% 0%, 100% 50%, 0% 100%)",
          }}
        >
          {" "}
        </button>

        <img
          src={post.images[currentIndex]?.url || NULL_IMG}
          alt={post.images[currentIndex]?.url || NULL_IMG}
          style={{
            width: "600px",
            height: "600px",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {post.images.map((_, index) => (
          <div
            key={index}
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              backgroundColor: currentIndex === index ? "black" : "grey",
              margin: "0 5px",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    console.log("data :", data);

    setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    // const newPosts = data.posts.filter(
    //   newData => !posts.some(existingData => existingData.id === newData.id)
    // );
    // setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setIsLoading(false);
  });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const handleScroll = throttle(async () => {
      if (
        window.innerHeight + window.scrollY + 1 >=
          document.documentElement.scrollHeight * 0.7 &&
        !isLoading
      ) {
        await loadPosts();
      }
    }, 1_000);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadPosts, isLoading]);

  ChannelService.boot({
    pluginKey: CHANEEL_TALK_KEY,
  });

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post, index) => (
        <Post
          key={`${post.id}-${index}`}
          id={post.id}
          post={post}
          // name={post.name}
          // avatar={post.profile.avartar}
        />
      ))}
      {isLoading && <p>Loading more posts...</p>}
      <ScrollToTopButton />
    </div>
  );
}

export default App;
