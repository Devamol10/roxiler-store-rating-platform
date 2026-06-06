import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      return "Name must be between 20 and 60 characters.";
    }
    if (formData.address.length > 400) {
      return "Address must be maximum 400 characters.";
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      return "Password must be between 8 and 16 characters.";
    }
    if (!/[A-Z]/.test(formData.password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      return "Password must contain at least one special character.";
    }
    return null;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/signup", formData);
      if (response.data && response.data.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 style={{ marginBottom: "var(--spacing-lg)", textAlign: "center", color: "var(--text-main)" }}>Create an account</h2>
      {error && <div className="alert alert-error">{error}</div>}

      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address" className="form-label">Address</label>
          <textarea
            id="address"
            name="address"
            className="form-input"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Your full address"
            rows="3"
            style={{ resize: "vertical" }}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Min 8 chars, 1 uppercase, 1 special char"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--spacing-md)" }} disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p style={{ marginTop: "var(--spacing-lg)", textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
        Already have an account? <Link to="/login" style={{ fontWeight: "500" }}>Log in</Link>
      </p>
    </>
  );
}

export default SignupPage;
