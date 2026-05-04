// src/App.jsx
// FIX 5: /p/:slug is now completely public — no PrivateRoute wrapper

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import Projects from "./pages/Projects";
import Messages from "./pages/Messages";
import PublicPortfolio from "./pages/PublicPortfolio";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TemplateGallery from "./pages/TemplateGallery";
import TemplatePreview from "./pages/TemplatePreview";

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
        {/* Auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/preview" element={<TemplatePreview />} />

        {/* ✅ PUBLIC — anyone can visit without login */}
        <Route path="/portfolio/:slug" element={<PublicPortfolio />} />

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
        <Route
          path="/projects"
          element={
            <PrivateRoute requiredRole="USER">
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute requiredRole="USER">
              <Messages />
            </PrivateRoute>
          }
        />
        <Route
          path="/portfolio/preview"
          element={
            <PrivateRoute requiredRole="USER">
              <PublicPortfolio previewMode={true} />
            </PrivateRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
