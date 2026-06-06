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
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, var(--primary-light) 0%, var(--bg-body) 100%)"
    }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "var(--spacing-md)" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
          <h1 style={{ color: "var(--primary)", fontSize: "2rem", marginBottom: "var(--spacing-xs)" }}>Roxiler</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Store Rating Platform</p>
        </div>
        <div className="card" style={{ padding: "var(--spacing-xl)" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
