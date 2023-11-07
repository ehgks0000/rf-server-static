import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { LoginSuccess, LoginFail } from "./components";
import "./App.css";
import ScrollToTopButton from "./Scroll";
import ChannelService from "./ChannelService";
import { Post, FilterButton, Modal } from "./components";
import { SERVER_URL, CHANEEL_TALK_KEY } from "./const";
import { nanoid } from "nanoid";
import { NavBar } from "./components/Nav";

const BASE_URL = "https://aws.rcloset.biz/api/v1/auth";

function LogoutButton() {
  const handleLogout = async () => {
    const res = await fetch(BASE_URL + '/logout', {
      method: 'GET',
      credentials: "include"
    });

    if(!res.ok){
      throw new Error(res.status);
    }
    console.log("로그아웃");
    // window.location.href = "";
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

function MainLayout() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [popup, setPopup] = useState();
  const loader = useRef();

  const handleCheckLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("https://aws.rcloset.biz/api/v1/user/me", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    console.log("data :", data);
  };
  const handlePopupClick = (e, url) => {
    e.preventDefault();

    const popup = window.open(
      BASE_URL + "/" + url,
      "로그인중..", // 새 탭 또는 새 창으로 열립니다.
      "width=800,height=600,left=200,top=200"
    );

    setPopup(popup);
  };
  useEffect(() => {
    if (!popup) return;
    function handleLoginMessage(event) {
      // 메시지가 올바른 출처에서 온 것인지 확인
      if (event.origin !== window.location.origin) {
        return; // 또는 자신의 앱에 맞는 출처를 설정
      }
      console.log("event.data :", event.data);
      if (event.data === "loginSuccess") {
        // 로그인 성공 처리
        console.log("로그인 성공!");
        // 상태 업데이트 또는 페이지 리디렉션 등의 로직을 여기에 추가
      }
      popup?.close();
      setPopup(null);
    }

    // 메시지 리스너를 추가
    window.addEventListener("message", handleLoginMessage, false);

    // 컴포넌트가 언마운트될 때 리스너를 정리
    return () => {
      window.removeEventListener("message", handleLoginMessage);
      popup?.close();
      setPopup(null);
    };
  }, []);

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

      <div>
        <button onClick={(e) => handlePopupClick(e, "kakao-t")}>
          KAKAO 로그인
        </button>
        <button onClick={(e) => handlePopupClick(e, "connect/google-t")}>
          구글 연동
        </button>
      </div>
      <div>
        <button onClick={(e) => handlePopupClick(e, "google-t")}>
          GOOGLE 로그인
        </button>
        <button onClick={(e) => handlePopupClick(e, "connect/kakao-t")}>
          카카오 연동
        </button>
      </div>
      <LogoutButton />
      <div>
        <a href="https://aws.rcloset.biz/api/v1/auth/logout">logout</a>
      </div>
      <div onClick={handleCheckLogin}>ME</div>
      <div
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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
    },
    {
      path: "/login/success",
      element: <LoginSuccess />,
    },
    {
      path: "/login/fail",
      element: <LoginFail />,
    },
  ]);
  return (
    <RouterProvider router={router} />
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<MainLayout />} />
    //     {/* <Route path="/login/success/*" element={<LoginSuccess />} /> */}
    //   </Routes>
    // </Router>
  );
}

export default App;
