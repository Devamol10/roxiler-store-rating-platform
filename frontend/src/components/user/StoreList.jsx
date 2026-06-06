import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import DataTable from "../common/DataTable";

function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    address: "",
    sortBy: "name",
    sortOrder: "asc"
  });

  const [ratingStatus, setRatingStatus] = useState({ loading: false, error: null, success: null });
  const [activeRatingStoreId, setActiveRatingStoreId] = useState(null);
  const [newRating, setNewRating] = useState("");

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      
      const response = await api.get("/stores/search", { params: queryParams });
      if (response.data && response.data.success) {
        setStores(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch stores.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitRating = async (storeId, existingRating) => {
    if (!newRating || isNaN(newRating) || newRating < 1 || newRating > 5) {
      setRatingStatus({ loading: false, error: "Rating must be between 1 and 5", success: null });
      return;
    }

    setRatingStatus({ loading: true, error: null, success: null });
    
    try {
      if (existingRating === null) {
        // Create new rating
        await api.post("/ratings", { storeId, rating: Number(newRating) });
      } else {
        // Update existing rating
        await api.patch(`/ratings/${storeId}`, { rating: Number(newRating) });
      }
      setRatingStatus({ loading: false, error: null, success: "Rating saved!" });
      setActiveRatingStoreId(null);
      setNewRating("");
      fetchStores(); // Refresh the list to show new averages/my rating
    } catch (err) {
      setRatingStatus({ loading: false, error: err.response?.data?.message || "Failed to save rating", success: null });
    }
  };

  const columns = [
    { header: "Store Name", accessor: "name" },
    { header: "Address", accessor: "address" },
    { 
      header: "Overall Rating", 
      render: (row) => row.overallRating !== null ? row.overallRating : "No ratings yet" 
    },
    { 
      header: "My Rating", 
      render: (row) => row.userRating !== null ? row.userRating : "Not rated" 
    },
    {
      header: "Action",
      render: (row) => {
        if (activeRatingStoreId === row.id) {
          return (
            <div className="flex-row" style={{ gap: "var(--spacing-xs)" }}>
              <input 
                type="number" 
                min="1" max="5" 
                className="form-input"
                value={newRating} 
                onChange={(e) => setNewRating(e.target.value)} 
                placeholder="1-5"
                style={{ width: "70px", padding: "0.25rem 0.5rem" }}
              />
              <button 
                className="btn btn-primary"
                style={{ padding: "0.25rem 0.75rem" }}
                onClick={() => submitRating(row.id, row.userRating)}
                disabled={ratingStatus.loading}
              >
                Save
              </button>
              <button className="btn btn-outline" style={{ padding: "0.25rem 0.75rem" }} onClick={() => { setActiveRatingStoreId(null); setRatingStatus({ loading: false, error: null, success: null }); }}>Cancel</button>
            </div>
          );
        }

        return (
          <button className="btn btn-outline" style={{ padding: "0.375rem 0.75rem" }} onClick={() => { setActiveRatingStoreId(row.id); setNewRating(row.userRating || ""); setRatingStatus({ loading: false, error: null, success: null }); }}>
            {row.userRating !== null ? "Update Rating" : "Rate"}
          </button>
        );
      }
    }
  ];

  return (
    <div style={{ marginBottom: "var(--spacing-xl)" }}>
      <h3 style={{ marginBottom: "var(--spacing-md)" }}>Stores Directory</h3>

      <div className="card flex-row" style={{ padding: "var(--spacing-md)", marginBottom: "var(--spacing-lg)", flexWrap: "wrap", gap: "10px" }}>
        <input className="form-input" name="name" placeholder="Search by name" value={filters.name} onChange={handleFilterChange} style={{ flex: 1, minWidth: "150px" }} />
        <input className="form-input" name="address" placeholder="Search by address" value={filters.address} onChange={handleFilterChange} style={{ flex: 1, minWidth: "150px" }} />
        <select className="form-input" name="sortBy" value={filters.sortBy} onChange={handleFilterChange} style={{ flex: 1, minWidth: "150px" }}>
          <option value="name">Sort by Name</option>
          <option value="address">Sort by Address</option>
          <option value="overallRating">Sort by Overall Rating</option>
          <option value="userRating">Sort by My Rating</option>
        </select>
        <select className="form-input" name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange} style={{ flex: 1, minWidth: "150px" }}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      
      {ratingStatus.error && <div className="alert alert-error">{ratingStatus.error}</div>}
      {ratingStatus.success && <div className="alert alert-success">{ratingStatus.success}</div>}

      <DataTable 
        columns={columns} 
        data={stores} 
        loading={loading} 
        emptyMessage="No stores found." 
      />
    </div>
  );
}

export default StoreList;
