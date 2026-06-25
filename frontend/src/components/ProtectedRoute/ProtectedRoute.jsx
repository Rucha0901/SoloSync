import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "var(--font-sans)",
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
          gap: "16px"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid var(--accent-soft)",
            borderTopColor: "var(--accent)",
            animation: "spin 1s linear infinite"
          }}
        />
        <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 500 }}>
          Authenticating session...
        </span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
