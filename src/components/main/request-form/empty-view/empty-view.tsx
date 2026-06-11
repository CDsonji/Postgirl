import "./empty-view.css";

const EmptyView = () => {
  return (
    <div className="empty-view-container">
      <img
        className="post-img"
        src="/assets/wallpaper-dark.svg"
        alt="post-logo"
      />
      <p style={{ color: "#878787", fontWeight: "bold", fontSize: "1.4rem" }}>
        Select or Create an HTTP Request
      </p>
    </div>
  );
};

export default EmptyView;
