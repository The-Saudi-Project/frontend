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

export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // login | signup

  if (loading) return <Loader />;

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!user) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onLogin={async (email, password) => {
                try {
                  await login(email, password);
                } catch (e) {
                  setError(e.message);
                }
              }}
              error={error}
              onSwitch={() => {
                setError("");
                setMode("signup");
              }}
            />
          }
        />

        <Route
          path="/signup"
          element={
            <Signup
              onSignup={async (data) => {
                try {
                  await apiRequest("/auth/register", "POST", data);
                  await login(data.email, data.password);
                } catch (e) {
                  setError(e.message);
                }
              }}
              error={error}
              onSwitch={() => {
                setError("");
                setMode("login");
              }}
            />
          }
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
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
