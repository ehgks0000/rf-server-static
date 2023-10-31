import React, { useEffect, useState, useCallback, useRef } from "react";
import "./App.css";
import ScrollToTopButton from "./Scroll";
import ChannelService from "./ChannelService";

const NULL_IMG = "null.jpg";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const CHANEEL_TALK_KEY = process.env.REACT_APP_CHANEEL_TALK_KEY;

function Modal({ setFilter, toggleModal }) {
  const handleClick = (e, sex) => {
    setFilter(sex);
    toggleModal(e);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#d9d9d9",
        padding: "20px",
        zIndex: 2,
      }}
      onClick={(e) => e.stopPropagation()} // 모달 내 클릭이 버블링되지 않도록 합니다.
    >
      <button
        style={{ border: 0, marginRight: "10px" }}
        onClick={(e) => handleClick(e, "All")}
      >
        All
      </button>
      <button
        style={{ border: 0, marginRight: "10px" }}
        onClick={(e) => handleClick(e, "Male")}
      >
        Male
      </button>
      <button
        style={{ border: 0, marginRight: "10px" }}
        onClick={(e) => handleClick(e, "Female")}
      >
        Female
      </button>
    </div>
  );
}
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "600px",
          height: "auto",
          // height: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 0", // 600px의 10%는 60px
          backgroundColor: "grey", // 여백 부분을 회색으로 설정
          border: "solid",
          borderColor: "black",
        }}
      >
        <div
          style={{
            width: "100%",
            // width: "600px",
            height: "auto",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={post.images[currentIndex]?.url || NULL_IMG}
            alt={post.images[currentIndex]?.url || NULL_IMG}
            style={{
              width: "600px",
              // height: "600px",
              height: "auto",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              // padding: "60px 0", // 600px의 10%는 60px
              // backgroundColor: "grey", // 여백 부분을 회색으로 설정
            }}
          >
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
        </div>
        {/* User name and avatar */}

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
        <div
          style={{
            position: "absolute",
            bottom: "20px", // Adjust this value to give more or less margin
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {post.images.map((_, index) => (
            <div
              key={index}
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: currentIndex === index ? "black" : "#d9d9d9",
                margin: "0 5px",
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    <div onClick={closeModal} style={{ minWidth: "600px" }}>
      <h1>Posts</h1>
      <button
        onClick={(e) => toggleModal(e)}
        style={{
          position: "fixed",
          right: "20px", // 오른쪽에서 20px 떨어진 곳에 위치
          top: "20px", // 위쪽에서 20px 떨어진 곳에 위치
          zIndex: 1, // 다른 요소 위에 나타나게 하기 위해 z-index 지정
          border: 0,
        }}
      >
        Filter
      </button>

      {showModal && <Modal setFilter={setFilter} toggleModal={toggleModal} />}
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
