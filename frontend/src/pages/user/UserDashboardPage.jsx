import StoreList from "../../components/user/StoreList";

function UserDashboardPage() {
  return (
    <div>
      <h2 style={{ marginBottom: "var(--spacing-xl)" }}>User Dashboard</h2>
      
      <StoreList />
    </div>
  );
}

export default UserDashboardPage;
