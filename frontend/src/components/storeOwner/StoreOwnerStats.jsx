function StoreOwnerStats({ stats, loading, error }) {
  if (loading) return <div style={{ color: "var(--text-muted)" }}>Loading dashboard summary...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!stats) return null;

  return (
    <div className="grid-cols-2" style={{ marginBottom: "var(--spacing-xl)" }}>
      <div className="card" style={{ marginBottom: 0, padding: "var(--spacing-lg)" }}>
        <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: "500", textTransform: "uppercase", margin: 0 }}>Store Name</h3>
        <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-main)", marginTop: "var(--spacing-xs)" }}>{stats.storeName}</div>
      </div>
      <div className="card" style={{ marginBottom: 0, padding: "var(--spacing-lg)" }}>
        <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: "500", textTransform: "uppercase", margin: 0 }}>Average Rating</h3>
        <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-main)", marginTop: "var(--spacing-xs)" }}>{stats.averageRating}</div>
      </div>
      <div className="card" style={{ marginBottom: 0, padding: "var(--spacing-lg)" }}>
        <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: "500", textTransform: "uppercase", margin: 0 }}>Total Ratings</h3>
        <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-main)", marginTop: "var(--spacing-xs)" }}>{stats.totalRatings}</div>
      </div>
    </div>
  );
}

export default StoreOwnerStats;

