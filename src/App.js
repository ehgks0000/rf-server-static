import React, { useEffect, useState, useCallback, useRef } from "react";
import "./App.css";
import ScrollToTopButton from "./Scroll";
import ChannelService from "./ChannelService";
import { Post, FilterButton, Modal } from "./components";
import {SERVER_URL, CHANEEL_TALK_KEY} from "./const";

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const loader = useRef();

  const closeModal = (e) => {
    e.stopPropagation();
    if (!showModal) return;
    setShowModal(() => false);
  };

  const toggleModal = (e) => {
    e.stopPropagation();
    setShowModal((prev) => !prev);
  };

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    let url = SERVER_URL;
    if (filter !== "All") {
      url += `?sex=${filter}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    console.log("load");

    setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    // const newPosts = data.posts.filter(
    //   newData => !posts.some(existingData => existingData.id === newData.id)
    // );
    // setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setIsLoading(false);
  });

  useEffect(() => {
    loadPosts();
    ChannelService.boot({
      pluginKey: CHANEEL_TALK_KEY,
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !isLoading &&
            entry.target.id === `post-${posts.length - 7}`
          ) {
            loadPosts();
          }
        });
      },
      { threshold: 0.1 }
    );

    posts.forEach((post, index) => {
      const targetId = `post-${index}`;
      const target = document.getElementById(targetId);
      if (target) {
        observer.observe(target);
      }
    });

    return () => observer.disconnect();
  }, [loadPosts, isLoading]);

  return (
    <div onClick={closeModal} style={{ minWidth: "400px" }}>
      <h1>RandomCloset</h1>
      <FilterButton toggleModal={toggleModal} />
      <Modal showModal={showModal} setFilter={setFilter} toggleModal={toggleModal} />
      {posts.map((post, index) => (
        <div id={`post-${index}`} key={`post-${post.id}-${index}`}>
          <Post
            key={`${post.id}-${index}-${new Date().getTime()}`}
            id={post.id}
            post={post}
          />
        </div>
      ))}
      {isLoading && <p>Loading more posts...</p>}
      <div ref={loader}></div>
      <ScrollToTopButton />
    </div>
  );
}

export default App;
