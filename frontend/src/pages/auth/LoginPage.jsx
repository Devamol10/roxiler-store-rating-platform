import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const processLogin = async (loginEmail, loginPassword) => {
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(loginEmail, loginPassword);
      
      // Redirect based on role
      switch (user.role) {
        case "ADMIN":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "USER":
          navigate("/user/dashboard", { replace: true });
          break;
        case "STORE_OWNER":
          navigate("/store-owner/dashboard", { replace: true });
          break;
        default:
          setError("Unknown user role");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await processLogin(email, password);
  };

  return (
    <>
      <h2 style={{ marginBottom: "var(--spacing-lg)", textAlign: "center", color: "var(--text-main)" }}>Welcome back</h2>
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: "flex", gap: "10px", marginBottom: "var(--spacing-lg)", justifyContent: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn" style={{ padding: "8px 12px", fontSize: "0.85rem", backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }} onClick={() => { setEmail("admin@demo.com"); setPassword("password123"); processLogin("admin@demo.com", "password123"); }} disabled={isLoading}>
          Demo Admin
        </button>
        <button type="button" className="btn" style={{ padding: "8px 12px", fontSize: "0.85rem", backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }} onClick={() => { setEmail("store@demo.com"); setPassword("password123"); processLogin("store@demo.com", "password123"); }} disabled={isLoading}>
          Demo Store
        </button>
        <button type="button" className="btn" style={{ padding: "8px 12px", fontSize: "0.85rem", backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }} onClick={() => { setEmail("user@demo.com"); setPassword("password123"); processLogin("user@demo.com", "password123"); }} disabled={isLoading}>
          Demo User
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "var(--spacing-md)", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        Or login manually:
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            placeholder="you@example.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--spacing-md)" }} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p style={{ marginTop: "var(--spacing-lg)", textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
        Don't have an account? <Link to="/signup" style={{ fontWeight: "500" }}>Sign up</Link>
      </p>
    </>
  );
}

export default LoginPage;

