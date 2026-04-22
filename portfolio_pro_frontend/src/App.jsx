// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'

// Placeholder dashboards — you'll replace these on Day 3 & 5
const UserDashboard = () => (
  <div style={{
    minHeight: '100vh', background: '#060612', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16
  }}>
    <h1 style={{ fontFamily: 'Outfit', color: '#e8e6f0', fontSize: 32 }}>
      Welcome, {localStorage.getItem('name')} 👋
    </h1>
    <p style={{ color: '#9896b0' }}>User Dashboard — Portfolio Builder coming Day 3</p>
    <button
      onClick={() => { localStorage.clear(); window.location.href = '/login' }}
      style={{ marginTop: 16, padding: '10px 28px', background: '#5b4bde',
        color: '#fff', borderRadius: 10, fontSize: 15, cursor: 'pointer' }}>
      Logout
    </button>
  </div>
)

const AdminDashboard = () => (
  <div style={{
    minHeight: '100vh', background: '#060612', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16
  }}>
    <h1 style={{ fontFamily: 'Outfit', color: '#e8e6f0', fontSize: 32 }}>
      Admin Panel 🛡️
    </h1>
    <p style={{ color: '#9896b0' }}>Admin Dashboard — Coming Day 5</p>
    <button
      onClick={() => { localStorage.clear(); window.location.href = '/login' }}
      style={{ marginTop: 16, padding: '10px 28px', background: '#5b4bde',
        color: '#fff', borderRadius: 10, fontSize: 15, cursor: 'pointer' }}>
      Logout
    </button>
  </div>
)

// Protects routes — kicks to /login if no token
function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token')
  const role  = localStorage.getItem('role')
  if (!token) return <Navigate to="/login" replace />
  if (requiredRole && role !== requiredRole) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <PrivateRoute requiredRole="USER">
            <UserDashboard />
          </PrivateRoute>
        } />

        <Route path="/admin/dashboard" element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
