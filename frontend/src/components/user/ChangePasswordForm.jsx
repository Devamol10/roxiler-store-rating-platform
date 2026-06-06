import { useState } from "react";
import api from "../../services/api";

function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
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

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      setLoading(false);
      return;
    }

    try {
      await api.patch("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccess(true);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "480px" }}>
      <h3 className="card-title" style={{ marginBottom: "var(--spacing-md)" }}>Change Password</h3>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Password changed successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input className="form-input" name="currentPassword" type="password" placeholder="Enter current password" value={formData.currentPassword} onChange={handleChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input className="form-input" name="newPassword" type="password" placeholder="Enter new password" value={formData.newPassword} onChange={handleChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <input className="form-input" name="confirmPassword" type="password" placeholder="Confirm new password" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Changing..." : "Update Password"}</button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;
