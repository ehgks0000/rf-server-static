import React, { useEffect, useState, useCallback, useRef } from "react";
import "./App.css";
import ScrollToTopButton from "./Scroll";
import ChannelService from "./ChannelService";
import { Post, FilterButton, Modal } from "./components";
import { SERVER_URL, CHANEEL_TALK_KEY } from "./const";
import { nanoid } from "nanoid";
import { NavBar } from "./components/Nav";

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const loader = useRef();
  // const parentRef = useRef(null);
  // 너비 상태를 설정합니다.
  // const [parentWidth, setParentWidth] = useState(0);

  // useEffect(() => {
  //   // 너비를 업데이트하는 함수입니다.
  //   function updateWidth() {
  //     // console.log("updateWidth");
  //     if (parentRef.current) {
  //       setParentWidth(parentRef.current.offsetWidth);
  //     }
  //   }

  //   // 처음 컴포넌트가 마운트될 때 너비를 설정합니다.
  //   updateWidth();

  //   // 윈도우 리사이즈 이벤트에 함수를 바인딩합니다.
  //   window.addEventListener("resize", updateWidth);

  //   // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
  //   return () => window.removeEventListener("resize", updateWidth);
  // }, []);

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

    // 새로운 포스트에만 nanoid 적용
    const newPosts = data.posts.map((post) => ({
      ...post,
      key: nanoid(),
    }));

    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
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

    posts.forEach((_, index) => {
      const targetId = `post-${index}`;
      const target = document.getElementById(targetId);
      if (target) {
        observer.observe(target);
      }
    });

    return () => observer.disconnect();
  }, [loadPosts, isLoading, posts]);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  const width = isMobile ? "100vw" : "20vw";
  // console.log("parent width :", width);

  return (
    <div
      onClick={closeModal}
      style={{
        display: "flex",
        flexDirection: "column", // 세로 방향으로 나열
        justifyContent: "flex-start", // 가로축에서 중앙 정렬
        alignItems: "center", // 세로축에서 중앙 정렬
        height: "100vh", // 부모 div의 높이를 뷰포트의 100%로 설정
      }}
    >
      <h1>RandomCloset</h1>
      <div
        // ref={parentRef}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: `${width}`,
        }}
      >
        <FilterButton toggleModal={toggleModal} />
        <Modal
          showModal={showModal}
          setFilter={setFilter}
          toggleModal={toggleModal}
        />
        {posts.map((post, index) => {
          if (!post) return <></>;
          return <Post id={`post-${index}`} post={post} key={post.key} />;
        })}
        {isLoading && <p>Loading more posts...</p>}
        <div ref={loader}></div>
        <ScrollToTopButton />
      </div>
      <NavBar parentWidth={width} />
    </div>
  );
}

export default App;
