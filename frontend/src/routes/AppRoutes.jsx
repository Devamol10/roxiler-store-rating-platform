import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import RoleRoute from "../components/guards/RoleRoute";

// Pages
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminStoresPage from "../pages/admin/AdminStoresPage";
import UserDashboardPage from "../pages/user/UserDashboardPage";
import StoreOwnerDashboardPage from "../pages/storeOwner/StoreOwnerDashboardPage";
import SettingsPage from "../pages/common/SettingsPage";
import NotFoundPage from "../pages/common/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminDashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminUsersPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminStoresPage />
            </RoleRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <RoleRoute allowedRoles={["USER"]}>
              <UserDashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/store-owner/dashboard"
          element={
            <RoleRoute allowedRoles={["STORE_OWNER"]}>
              <StoreOwnerDashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <RoleRoute allowedRoles={["USER", "STORE_OWNER", "ADMIN"]}>
              <SettingsPage />
            </RoleRoute>
          }
        />
      </Route>

      {/* Catch-all Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

