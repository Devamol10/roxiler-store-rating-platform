import ChangePasswordForm from "../../components/user/ChangePasswordForm";

function SettingsPage() {
  return (
    <div>
      <h2 style={{ marginBottom: "var(--spacing-xl)" }}>Account Settings</h2>
      <div className="card">
        <ChangePasswordForm />
      </div>
    </div>
  );
}

export default SettingsPage;
