import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function ProfileDetails() {
  const { user, updateUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    address: user?.address || "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      address: user?.address || "",
    });
    setError(null);
    setSuccess(false);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.patch("/auth/profile", formData);
      if (response.data && response.data.success) {
        updateUser({
          name: response.data.data.name,
          address: response.data.data.address,
        });
        setSuccess(true);
        setIsEditing(false);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map(e => e.message).join(", "));
      } else {
        setError(err.response?.data?.message || "Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex-row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
        <h3 className="card-title" style={{ margin: 0 }}>Profile Details</h3>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Profile updated successfully!</div>}

      {!isEditing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <div>
            <label className="form-label" style={{ color: "var(--text-secondary)" }}>Name</label>
            <div style={{ fontWeight: 500 }}>{user?.name}</div>
          </div>
          <div>
            <label className="form-label" style={{ color: "var(--text-secondary)" }}>Email (Login ID)</label>
            <div style={{ fontWeight: 500 }}>{user?.email}</div>
          </div>
          <div>
            <label className="form-label" style={{ color: "var(--text-secondary)" }}>Address</label>
            <div style={{ fontWeight: 500 }}>{user?.address || "N/A"}</div>
          </div>
          <div>
            <label className="form-label" style={{ color: "var(--text-secondary)" }}>Account Role</label>
            <div style={{ fontWeight: 500 }}>
              <span className="badge" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <div>
            <label className="form-label">Name</label>
            <input 
              className="form-input" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="form-label" style={{ color: "var(--text-secondary)" }}>Email (Login ID)</label>
            <input 
              className="form-input" 
              value={user?.email} 
              disabled 
              style={{ backgroundColor: "var(--surface)", cursor: "not-allowed" }}
            />
            <small style={{ color: "var(--text-secondary)", marginTop: "4px", display: "block" }}>
              Email cannot be changed as it is used for login.
            </small>
          </div>
          <div>
            <label className="form-label">Address</label>
            <input 
              className="form-input" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="flex-row" style={{ gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button className="btn btn-secondary" type="button" onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfileDetails;
