import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      <div style={{ textAlign: "center", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        Use the "Quick Access" buttons to test all 3 roles instantly.
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "var(--spacing-lg)", justifyContent: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn" style={{ padding: "8px 12px", fontSize: "0.85rem", backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }} onClick={() => { setEmail("admin@demo.com"); setPassword("password123"); processLogin("admin@demo.com", "password123"); }} disabled={isLoading}>
          Admin
        </button>
        <button type="button" className="btn" style={{ padding: "8px 12px", fontSize: "0.85rem", backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }} onClick={() => { setEmail("store@demo.com"); setPassword("password123"); processLogin("store@demo.com", "password123"); }} disabled={isLoading}>
          Store
        </button>
        <button type="button" className="btn" style={{ padding: "8px 12px", fontSize: "0.85rem", backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }} onClick={() => { setEmail("user@demo.com"); setPassword("password123"); processLogin("user@demo.com", "password123"); }} disabled={isLoading}>
          User
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
            placeholder="Enter email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="••••••••"
              style={{ paddingRight: "40px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px"
              }}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
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

