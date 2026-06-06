import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "STORE_OWNER") return <Navigate to="/store-owner/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)", display: "flex", flexDirection: "column" }}>
      {/* Flipkart-style Yellow-Blue Header Bar */}
      <div style={{
        background: "linear-gradient(135deg, #2874F0 0%, #1a5dc8 60%, #FFB800 100%)",
        padding: "var(--spacing-xl) var(--spacing-xl)",
        textAlign: "center"
      }}>
        <h1 style={{ color: "#FFFFFF", fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.25rem", letterSpacing: "-0.5px" }}>Roxiler</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", fontWeight: "500" }}>Store Rating Platform</p>
      </div>

      {/* Card below the header */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "var(--spacing-xl) var(--spacing-md)" }}>
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <div className="card" style={{ padding: "var(--spacing-xl)", boxShadow: "var(--shadow-lg)", border: "none" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
