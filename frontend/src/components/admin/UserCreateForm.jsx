import { useState } from "react";
import api from "../../services/api";

function UserCreateForm({ onUserCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post("/admin/users", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", address: "", password: "", role: "USER" });
      if (onUserCreated) onUserCreated();
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map(e => e.message).join(", "));
      } else {
        setError(err.response?.data?.message || "Failed to create user");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: "var(--spacing-xl)" }}>
      <h3 className="card-title" style={{ marginBottom: "var(--spacing-md)" }}>Create New User</h3>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">User created successfully!</div>}
      
      <form onSubmit={handleSubmit} className="flex-row flex-wrap" style={{ alignItems: "flex-end", gap: "var(--spacing-md)" }}>
        <div style={{ flex: "1 1 200px" }}>
          <label className="form-label">Name</label>
          <input className="form-input" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label className="form-label">Address</label>
          <input className="form-input" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label className="form-label">Password</label>
          <input className="form-input" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </div>
        <div style={{ flex: "1 1 150px" }}>
          <label className="form-label">Role</label>
          <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
            <option value="USER">User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div style={{ flex: "0 0 auto" }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserCreateForm;
