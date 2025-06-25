export default function LoadingIndicator({ message }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem", color: "#555" }}>
      <div className="spinner" />
      <p>{message || "Loading..."}</p>
    </div>
  );
}
