import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, label }) => (
    <Link 
      to={to} 
      style={{
        display: "block",
        padding: "0.75rem 1rem",
        borderRadius: "var(--radius-md)",
        color: isActive(to) ? "var(--primary)" : "var(--text-muted)",
        backgroundColor: isActive(to) ? "var(--primary-light)" : "transparent",
        fontWeight: isActive(to) ? "600" : "500",
        marginBottom: "0.25rem",
        transition: "all 0.2s"
      }}
    >
      {label}
    </Link>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>
      {/* Sidebar */}
      <aside style={{ 
        width: "var(--sidebar-width)", 
        backgroundColor: "var(--bg-surface)", 
        borderRight: "1px solid var(--border-light)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, bottom: 0, left: 0
      }}>
        <div style={{ padding: "var(--spacing-xl) var(--spacing-lg)", borderBottom: "1px solid var(--border-light)" }}>
          <h2 style={{ margin: 0, color: "var(--primary)", fontSize: "1.5rem" }}>Roxiler</h2>
        </div>
        
        <nav style={{ flex: 1, padding: "var(--spacing-lg) var(--spacing-md)", overflowY: "auto" }}>
          <div style={{ marginBottom: "var(--spacing-xs)", padding: "0 1rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: "600" }}>
            Menu
          </div>
          {user?.role === "ADMIN" && (
            <>
              <NavLink to="/admin/dashboard" label="Dashboard" />
              <NavLink to="/admin/users" label="Users" />
              <NavLink to="/admin/stores" label="Stores" />
              <NavLink to="/settings" label="Settings" />
            </>
          )}
          {user?.role === "USER" && (
            <>
              <NavLink to="/user/dashboard" label="Dashboard" />
              <NavLink to="/settings" label="Settings" />
            </>
          )}
          {user?.role === "STORE_OWNER" && (
            <>
              <NavLink to="/store-owner/dashboard" label="Dashboard" />
              <NavLink to="/settings" label="Settings" />
            </>
          )}
          
          <button 
            onClick={handleLogout}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              color: "var(--danger)",
              backgroundColor: "transparent",
              fontWeight: "500",
              border: "none",
              cursor: "pointer",
              marginTop: "1rem",
              transition: "all 0.2s"
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div style={{ flex: 1, marginLeft: "var(--sidebar-width)", display: "flex", flexDirection: "column" }}>
        {/* Top Header */}
        <header style={{ 
          height: "var(--header-height)", 
          backgroundColor: "var(--bg-surface)", 
          borderBottom: "1px solid var(--border-light)",
          display: "flex", 
          justifyContent: "flex-end", 
          alignItems: "center", 
          padding: "0 var(--spacing-xl)",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}>
          <div className="flex-row">
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>{user?.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{user?.role.replace('_', ' ').toLowerCase()}</div>
            </div>
            <button className="btn btn-outline" style={{ padding: "0.375rem 0.75rem" }} onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: "var(--spacing-xl)", flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;



