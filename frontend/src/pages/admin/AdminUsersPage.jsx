import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import DataTable from "../../components/common/DataTable";
import UserCreateForm from "../../components/admin/UserCreateForm";
import UserDetails from "../../components/admin/UserDetails";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
    sortBy: "name",
    sortOrder: "asc"
  });

  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Clean empty filters
      const queryParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      
      const response = await api.get("/admin/users", { params: queryParams });
      if (response.data && response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Address", accessor: "address" },
    { header: "Role", accessor: "role" },
    {
      header: "Actions",
      render: (row) => (
        <button onClick={() => setSelectedUserId(row.id)}>View Details</button>
      )
    }
  ];

  return (
    <div>
      <h2>Manage Users</h2>
      
      <UserCreateForm onUserCreated={fetchUsers} />

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", padding: "15px", border: "1px solid #ccc", backgroundColor: "#f9f9f9" }}>
        <input name="name" placeholder="Search by name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Search by email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Search by address" value={filters.address} onChange={handleFilterChange} />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="STORE_OWNER">STORE_OWNER</option>
        </select>
        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="role">Sort by Role</option>
        </select>
        <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <DataTable 
        columns={columns} 
        data={users} 
        loading={loading} 
        emptyMessage="No users found matching the criteria." 
      />

      {selectedUserId && (
        <UserDetails 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}
    </div>
  );
}

export default AdminUsersPage;

