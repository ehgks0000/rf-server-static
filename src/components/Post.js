import {useState, useRef} from "react";
import { NULL_IMG } from "../const";
export function Post({ id, post }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startX, setStartX] = useState(null);
    const [offsetX, setOffsetX] = useState(0);
    const containerRef = useRef(null);

    const handleMouseDown = (e) => {
      if (post.images.length < 2) return;
      setStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
      if (post.images.length < 2 || startX === null) return;
      const diffX = e.clientX - startX;
      setOffsetX(diffX);
    };

    const handleMouseUp = () => {
      if (post.images.length < 2) return;
      const width = containerRef.current.offsetWidth;
      if (offsetX > width / 3) {
        setCurrentIndex((currentIndex - 1 + post.images.length) % post.images.length);
      } else if (offsetX < -width / 3) {
        setCurrentIndex((currentIndex + 1) % post.images.length);
      }
      setOffsetX(0);
      setStartX(null);
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
            width: "50vw", // 브라우저 가로길이 50퍼센트
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 0", // 600px의 10%는 60px
            backgroundColor: "grey", // 여백 부분을 회색으로 설정
            border: "solid",
            borderColor: "black",
          }}
        >
          <PostContainer post={post} currentIndex={currentIndex} handleMouseDown={handleMouseDown} handleMouseMove={handleMouseMove} handleMouseUp={handleMouseUp}>
              <Avatar post={post} />
          </PostContainer>
          <HandlePostClick setCurrentIndex={setCurrentIndex} post={post} />
          <PostIndexHole post={post} currentIndex={currentIndex} />
        </div>
      </div>
    );
  
      function PostContainer({post, currentIndex, handleMouseDown, handleMouseMove, handleMouseUp, children}) {
          return <div
              ref={containerRef}
              style={{
                  width: "100%",
                  // width: "600px",
                  height: "auto",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden"
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
          >
            {
              post.images.map((image, index) => {
                return <img 
                  src={image.url}
                  alt=""
                  draggable="false"
                  style={{
                    transform: `translateX(calc(${index - currentIndex}00% + ${offsetX}px))`,
                    transition: startX !== null ? "none" : "transform 0.3s",
                    position: index === currentIndex ? "relative" : "absolute",
                    left: 0,
                    width: "100%",
                  }}
                />
              })
            }
              {/* <img
                  src={post.images[currentIndex]?.url || NULL_IMG}
                  alt={post.images[currentIndex]?.url || NULL_IMG}
                  // onMouseDown={handleMouseDown}
                  // onMouseMove={handleMouseMove}
                  // onMouseUp={handleMouseUp}
                  draggable="false"
                  style={{
                      width: "100%",
                      // height: "600px",
                      height: "auto",
                      userSelect: "none",
                      transform: `translateX(${offsetX}px)`,
                      transition: startX !== null ? "none" : "transform 0.3s",
                  }} /> */}
              {children}
          </div>;
      }
  }
  
  function Avatar({post}) {
      return <div
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
              }} />
      </div>;
  }

  function HandlePostClick({setCurrentIndex, post}) {

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % post.images.length);
      };
    
      const handlePrevClick = () => {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + post.images.length) % post.images.length
        );
      };
    return <>
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
}

function PostIndexHole({post, currentIndex}) {
    return <div
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
    </div>;
}
