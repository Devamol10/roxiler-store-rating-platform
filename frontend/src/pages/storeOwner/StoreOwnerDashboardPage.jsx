import { useState, useEffect } from "react";
import api from "../../services/api";
import StoreOwnerStats from "../../components/storeOwner/StoreOwnerStats";
import StoreOwnerRatingsTable from "../../components/storeOwner/StoreOwnerRatingsTable";

function StoreOwnerDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/store-owner/dashboard");
        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch dashboard summary.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "var(--spacing-xl)" }}>Store Owner Dashboard</h2>
      
      <StoreOwnerStats stats={stats} loading={loading} error={error} />
      
      <StoreOwnerRatingsTable />
    </div>
  );
}

export default StoreOwnerDashboardPage;

