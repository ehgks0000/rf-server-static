import { useState, useRef, useEffect } from "react";
import { NULL_IMG } from "../const";
import { nanoid } from "nanoid";
export function Post({ post, key }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const [touchedX, setTouchedX] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const containerRef = useRef(null);

  const handleResize = () => {
    if (containerRef.current) {
      const images = containerRef.current.getElementsByTagName("img");
      let newMaxHeight = 0;
      for (let image of images) {
        const height = image.offsetHeight;
        if (height > newMaxHeight) {
          newMaxHeight = height;
        }
      }
      setMaxHeight(newMaxHeight);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트 될 때 이벤트 리스너를 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleImageLoad = (event) => {
    const height = event.target.offsetHeight;
    if (!height) return 600;
    if (height > maxHeight) {
      setMaxHeight(height);
    }
  };

  const handleMouseDown = (e) => {
    if (post.images.length < 2) return;
    setStartX(e.clientX);
  };

  const handleMouseMove = (event) => {
    if (startX === null) return;

    const newOffsetX = event.clientX - startX;
    setOffsetX(newOffsetX);
  };

  const handleMouseUp = () => {
    if (Math.abs(offsetX) > 50) {
      if (offsetX > 0) {
        setCurrentIndex(
          currentIndex === 0 ? post.images.length - 1 : currentIndex - 1
        );
      } else {
        setCurrentIndex(
          currentIndex === post.images.length - 1 ? 0 : currentIndex + 1
        );
      }
    } else {
      // 위치를 원래대로 복구
      if (currentIndex === 0) {
        setCurrentIndex(post.images.length - 1);
      } else if (currentIndex === post.images.length - 1) {
        setCurrentIndex(0);
      }
    }

    setStartX(null);
    setOffsetX(0);
  };

  const handleTouchStart = (e) => {
    console.log("터치중? :", e.target);
    e.stopPropagation();
    if (post.images.length < 2) return;
    setStartX(e.touches[0].clientX);
    // setTouchedX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
    console.log("터치중? 무브?", e.target);
    if (touchedX === null) return;

    // console.log("e.touches[0].clientX :", e.touches[0].clientX);
    // console.log("touchedX :", touchedX);
    const newOffsetX = e.touches[0].clientX - touchedX;
    setOffsetX(newOffsetX);
    setStartX(e.touches[0].clientX); // 이 부분을 수정하였습니다.
    // setOffsetX(newOffsetX);
    // setTouchedX(e.touches[0].clientX);  // 이 부분을 수정하였습니다.
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    console.log("handleTouchEnd");
    if (Math.abs(offsetX) > 50) {
      if (offsetX > 0) {
        setCurrentIndex(
          currentIndex === 0 ? post.images.length - 1 : currentIndex - 1
        );
      } else {
        setCurrentIndex(
          currentIndex === post.images.length - 1 ? 0 : currentIndex + 1
        );
      }
    }

    setStartX(null);
    // setTouchedX(null);
    setOffsetX(0);
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

  return (
    <div
      key={key}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflowAnchor: "none",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "grey", // 여백 부분을 회색으로 설정
          border: "solid",
          borderColor: "black",
          overflowAnchor: "none",
        }}
      >
        <Avatar post={post} />
        <PostContainer
          isMobile={isMobile}
          post={post}
          currentIndex={currentIndex}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        ></PostContainer>
        <HandlePostClick setCurrentIndex={setCurrentIndex} post={post} />
        <PostIndexHole post={post} currentIndex={currentIndex} />
      </div>
    </div>
  );

  function PostContainer({
    isMobile,
    post,
    currentIndex,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    children,
  }) {
    return (
      <div
        key={nanoid()}
        ref={containerRef}
        style={{
          width: "100%",
          height: `${maxHeight}px`,
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          overflow: "hidden",
          overflowAnchor: "none",
          // zIndex: 1
        }}
        onMouseDown={isMobile ? undefined : handleMouseDown}
        onMouseMove={isMobile ? undefined : handleMouseMove}
        onMouseUp={isMobile ? undefined : handleMouseUp}
        onTouchStart={isMobile ? onTouchStart : undefined}
        onTouchMove={isMobile ? onTouchMove : undefined}
        onTouchEnd={isMobile ? onTouchEnd : undefined}
      >
        {[
          post.images[post.images.length - 1],
          ...post.images,
          post.images[0],
        ].map((image, index) => {
          let positionIndex = index - (currentIndex + 1);
          if (
            currentIndex === post.images.length - 1 &&
            offsetX < 0 &&
            index === 0
          ) {
            positionIndex = post.images.length;
          }
          if (!image?.url) return <></>;
          return (
            <img
              key={`${index}-${nanoid()}`}
              src={image.url}
              onLoad={handleImageLoad}
              alt=""
              draggable="false"
              style={{
                transform: `translateX(calc(${positionIndex}00% + ${offsetX}px))`,
                transition: startX !== null ? "none" : undefined, // 드래그하는 동안 transition을 none으로 설정
                position: index === currentIndex ? "relative" : "absolute",
                left: 0,
                width: "100%",
                // minHeight: "600px",
                // maxHeight: "100%",
                userSelect: "none",
              }}
            />
          );
        })}
        {children}
      </div>
    );
  }
}

function Avatar({ post }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        zIndex: 1,
        width: "20%", // 상위 컴포넌트 가로 길이의 5분의 1
        maxWidth: "300px", // 컨테이너의 최대 너비 설정
        minWidth: "50px", // 컨테이너의 최대 너비 설정
      }}
    >
      <div style={{ flex: 2 }}>
        {post.user.name}
        {/* <h2 style={{ fontSize: "clamp(1rem, 5vw, 2rem)" }}>{}</h2> */}
      </div>

      <div style={{ flex: 1 }}>{/* 여기에 원하는 내용을 추가하세요. */}</div>

      <div style={{ flex: 2 }}>
        <div
          style={{ width: "100%", paddingBottom: "100%", position: "relative" }}
        >
          <img
            src={post.user.profile.avatar || NULL_IMG}
            alt={`${post.user.name}'s avatar`}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function HandlePostClick({ setCurrentIndex, post }) {
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  };

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + post.images.length) % post.images.length
    );
  };
  return (
    <>
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
    </>
  );
}

function PostIndexHole({ post, currentIndex }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px", // Adjust this value to give more or less margin
        display: "flex",
        justifyContent: "center",
        width: "100%",
        zIndex: 1,
      }}
    >
      {post.images.map((_, index) => (
        <div
          key={`${index}-${nanoid()}`}
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
  );
}
