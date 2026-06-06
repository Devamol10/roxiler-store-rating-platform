import { useState, useEffect } from "react";
import api from "../../services/api";
import AdminStats from "../../components/admin/AdminStats";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch dashboard statistics.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AdminStats stats={stats} loading={loading} error={error} />
    </div>
  );
}

export default AdminDashboardPage;

