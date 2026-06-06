import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import DataTable from "../../components/common/DataTable";
import StoreCreateForm from "../../components/admin/StoreCreateForm";

function AdminStoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    sortBy: "name",
    sortOrder: "asc"
  });

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      
      const response = await api.get("/admin/stores", { params: queryParams });
      if (response.data && response.data.success) {
        setStores(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch stores");
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

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Address", accessor: "address" },
    { header: "Rating", accessor: "rating" }
  ];

  return (
    <div>
      <h2>Manage Stores</h2>
      
      <StoreCreateForm onStoreCreated={fetchStores} />

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", padding: "15px", border: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
        <input name="name" placeholder="Search by name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Search by email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Search by address" value={filters.address} onChange={handleFilterChange} />
        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </select>
        <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <DataTable 
        columns={columns} 
        data={stores} 
        loading={loading} 
        emptyMessage="No stores found matching the criteria." 
      />
    </div>
  );
}

export default AdminStoresPage;

