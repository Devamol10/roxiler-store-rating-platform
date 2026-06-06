import ChangePasswordForm from "../../components/user/ChangePasswordForm";
import ProfileDetails from "../../components/common/ProfileDetails";

function SettingsPage() {
  return (
    <div>
      <h2 style={{ marginBottom: "var(--spacing-xl)" }}>Account Settings</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "var(--spacing-xl)" }}>
        <ProfileDetails />
        <div className="card">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
