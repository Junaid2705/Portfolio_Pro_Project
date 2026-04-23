// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PortfolioBuilder from "./pages/PortfolioBuilder";

function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole)
    return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="USER">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/portfolio/builder"
          element={
            <PrivateRoute requiredRole="USER">
              <PortfolioBuilder />
            </PrivateRoute>
          }
        />

        {/* Admin placeholder — Day 5 */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <div style={{ padding: 40, color: "#fff", fontFamily: "Outfit" }}>
                <h1>Admin Panel — Coming Day 5</h1>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                  style={{
                    marginTop: 20,
                    padding: "10px 24px",
                    background: "#5b4bde",
                    color: "#fff",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
