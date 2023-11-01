export function FilterButton({toggleModal}) {
    return <button
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
    </button>;
}