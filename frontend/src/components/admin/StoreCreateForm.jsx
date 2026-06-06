import { useState, useEffect } from "react";
import api from "../../services/api";

function StoreCreateForm({ onStoreCreated }) {
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await api.get("/admin/users", { params: { role: "STORE_OWNER" } });
        if (response.data && response.data.success) {
          setOwners(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch store owners for dropdown", err);
      }
    };
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post("/admin/stores", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", address: "", ownerId: "" });
      if (onStoreCreated) onStoreCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: "var(--spacing-xl)" }}>
      <h3 className="card-title" style={{ marginBottom: "var(--spacing-md)" }}>Create New Store</h3>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Store created successfully!</div>}
      
      <form onSubmit={handleSubmit} className="flex-row flex-wrap" style={{ alignItems: "flex-end", gap: "var(--spacing-md)" }}>
        <div style={{ flex: "1 1 200px" }}>
          <label className="form-label">Store Name</label>
          <input className="form-input" name="name" placeholder="Store Name" value={formData.name} onChange={handleChange} required />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label className="form-label">Store Email</label>
          <input className="form-input" name="email" type="email" placeholder="Store Email" value={formData.email} onChange={handleChange} required />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label className="form-label">Address</label>
          <input className="form-input" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        </div>
        <div style={{ flex: "1 1 250px" }}>
          <label className="form-label">Store Owner</label>
          <select className="form-select" name="ownerId" value={formData.ownerId} onChange={handleChange} required>
            <option value="" disabled>Select a Store Owner</option>
            {owners.map(owner => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ flex: "0 0 auto" }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Store"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StoreCreateForm;
