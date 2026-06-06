import { useState, useEffect } from "react";
import api from "../../services/api";

function UserDetails({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/admin/users/${userId}`);
        if (response.data && response.data.success) {
          setUser(response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch user details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (!userId) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 50
    }}>
      <div className="card" style={{ width: "90%", maxWidth: "500px", margin: 0, maxHeight: "90vh", overflowY: "auto" }}>
        <div className="card-header">
          <h3 className="card-title">User Details</h3>
          <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem" }} onClick={onClose}>Close</button>
        </div>

        {loading && <div style={{ color: "var(--text-muted)" }}>Loading details...</div>}
        {error && <div className="alert alert-error">{error}</div>}
        
        {!loading && !error && user && (
          <div>
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <p style={{ margin: "0 0 var(--spacing-xs) 0" }}><strong>ID:</strong> <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{user.id}</span></p>
              <p style={{ margin: "0 0 var(--spacing-xs) 0" }}><strong>Name:</strong> {user.name}</p>
              <p style={{ margin: "0 0 var(--spacing-xs) 0" }}><strong>Email:</strong> {user.email}</p>
              <p style={{ margin: "0 0 var(--spacing-xs) 0" }}><strong>Address:</strong> {user.address}</p>
              <p style={{ margin: "0 0 var(--spacing-xs) 0" }}><strong>Role:</strong> <span className="badge badge-purple">{user.role}</span></p>
            </div>

            {user.role === "STORE_OWNER" && (
              <div style={{ marginTop: "var(--spacing-md)", paddingTop: "var(--spacing-md)", borderTop: "1px solid var(--border-light)" }}>
                <h4 style={{ marginBottom: "var(--spacing-sm)" }}>Owned Stores Summary</h4>
                <p style={{ marginBottom: "var(--spacing-xs)" }}><strong>Average Rating across stores:</strong> {user.rating}</p>
                {user.stores && user.stores.length > 0 ? (
                  <ul style={{ paddingLeft: "var(--spacing-lg)", margin: 0, color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    {user.stores.map(store => (
                      <li key={store.id} style={{ marginBottom: "var(--spacing-xs)" }}>
                        {store.name} - Rating: {store.rating}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No stores owned.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetails;
