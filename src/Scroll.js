import React, { useState, useEffect } from "react";
import "./App.css";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치에 따라 버튼의 가시성을 토글하는 함수
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      if (!isVisible) {
        setIsVisible(true);
      }
    } else {
      if (isVisible) {
        setIsVisible(false);
      }
    }
  };

  // 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <div onClick={scrollToTop} style={styles.scrollButton}>
          ↑
        </div>
      )}
    </div>
  );
}

// 버튼 스타일링을 위한 CSS 객체
const styles = {
  scrollButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    backgroundColor: "#3498db",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2em",
    color: "#fff",
    cursor: "pointer",
    zIndex: 1000,
  },
};

export default ScrollToTopButton;
