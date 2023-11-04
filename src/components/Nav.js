export function NavBar({ parentWidth }) {
  return (
    <div
      style={{
        display: "flex",
        position: "fixed",
        bottom: 0,
        zIndex: 1,
        width: parentWidth,
        // width: `${parentWidth}px`,
        // alignItems: "stretch",
        backgroundColor: "green",
      }}
    >
      <div
        style={{
          flex: 1,
          border: "solid",
          borderColor: "black",
          //   alignItems: "center",
          //   justifyContent: "center",
          textAlign: "center",
        }}
      >
        HOME
      </div>
      <div
        style={{
          flex: 1,
          border: "solid",
          borderColor: "black",
          //   alignItems: "center",
          //   justifyContent: "center",
          textAlign: "center",
        }}
      >
        SCRAP
      </div>
      <div
        style={{
          flex: 1,
          border: "solid",
          borderColor: "black",
          //   alignItems: "center",
          //   justifyContent: "center",
          textAlign: "center",
        }}
      >
        MyPage
      </div>
    </div>
  );
}
