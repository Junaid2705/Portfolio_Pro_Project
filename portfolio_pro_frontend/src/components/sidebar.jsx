// src/components/Sidebar.jsx
// Shared sidebar — import this in Dashboard, Projects, Messages, PortfolioBuilder

import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

export default function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const path      = location.pathname

  const name      = localStorage.getItem('name')  || 'User'
  const email     = localStorage.getItem('email') || ''
  const initials  = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const navItems = [
    { icon: '⊞', label: 'Dashboard',        route: '/dashboard' },
    { icon: '✏', label: 'Portfolio Builder', route: '/portfolio/builder' },
    { icon: '⬡', label: 'Projects',          route: '/projects' },
    { icon: '✉', label: 'Messages',          route: '/messages' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
        <div className="sidebar-logo-icon">PP</div>
        <span>Portfolio<strong>Pro</strong></span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.route}
            className={`sidebar-nav-item ${path === item.route ? 'active' : ''}`}
            onClick={() => navigate(item.route)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{name}</span>
            <span className="sidebar-user-email">{email}</span>
          </div>
        </div>
        <button
          className="sidebar-logout"
          onClick={() => { localStorage.clear(); navigate('/login') }}>
          ⎋ Logout
        </button>
      </div>
    </aside>
  )
}
