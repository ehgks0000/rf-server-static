import { useEffect } from "react";

export function Modal({ showModal, setFilter, toggleModal }) {
    const handleClick = (e, sex) => {
      setFilter(sex);
      toggleModal(e);
    };
  
    useEffect(() => {
      if (showModal) {
        // 모달이 열릴 때 body의 스크롤을 방지
        document.body.style.overflow = 'hidden';
      } else {
        // 모달이 닫힐 때 body의 스크롤 방지를 해제
        document.body.style.overflow = 'unset';
      }
  
      // 컴포넌트가 unmount될 때 스크롤 방지를 해제
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [showModal]);
  
    if(!showModal) return;
  
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