import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import DataTable from "../common/DataTable";

function StoreOwnerRatingsTable() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    sortBy: "name",
    sortOrder: "asc"
  });

  const fetchRatings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/store-owner/ratings", { params: sortConfig });
      if (response.data && response.data.success) {
        setRatings(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch ratings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sortConfig]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleSortChange = (e) => {
    setSortConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const columns = [
    { header: "User Name", accessor: "name" },
    { header: "User Email", accessor: "email" },
    { header: "Rating", accessor: "rating" }
  ];

  return (
    <div style={{ marginBottom: "var(--spacing-xl)" }}>
      <h3 style={{ marginBottom: "var(--spacing-md)" }}>Ratings Received</h3>

      <div className="card flex-row" style={{ padding: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
        <select className="form-select" name="sortBy" value={sortConfig.sortBy} onChange={handleSortChange} style={{ flex: 1 }}>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="rating">Sort by Rating</option>
        </select>
        <select className="form-select" name="sortOrder" value={sortConfig.sortOrder} onChange={handleSortChange} style={{ flex: 1 }}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <DataTable 
        columns={columns} 
        data={ratings} 
        loading={loading} 
        emptyMessage="No ratings received yet." 
      />
    </div>
  );
}

export default StoreOwnerRatingsTable;
