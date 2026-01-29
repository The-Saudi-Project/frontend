import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import { apiRequest } from "./api/client";
import RoleSelect from "./pages/RoleSelect";


export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [error, setError] = useState("");


  if (loading) return <Loader />;

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<RoleSelect />} />

        <Route
          path="/login/customer"
          element={
            <Login
              expectedRole="customer"
              title="Customer Login"
              subtitle="Book home services easily"
              onLogin={login}
            />
          }
        />

        <Route
          path="/login/provider"
          element={
            <Login
              expectedRole="provider"
              title="Provider Login"
              subtitle="Manage your service jobs"
              onLogin={login}
            />
          }
        />

        <Route
          path="/login/admin"
          element={
            <Login
              expectedRole="admin"
              title="Admin Login"
              subtitle="Platform management console"
              onLogin={login}
            />
          }
        />

        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  /* ---------------- LOGGED IN ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header role={user.role} onLogout={logout} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              user.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* CUSTOMER */}
          <Route
            path="/customer"
            element={
              user.role === "customer" ? (
                <CustomerDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* PROVIDER */}
          <Route
            path="/provider"
            element={
              user.role === "provider" ? (
                <ProviderDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* ROOT REDIRECT */}
          <Route
            path="/"
            element={
              <Navigate to={`/${user.role}`} replace />
            }
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}
