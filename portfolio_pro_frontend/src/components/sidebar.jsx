import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // --- NEW: Mobile Menu State ---
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navItems = [
    { icon: "⊞", label: "Dashboard", route: "/dashboard" },
    { icon: "✏", label: "Portfolio Builder", route: "/portfolio/builder" },
    { icon: "⬡", label: "Projects", route: "/projects" },
    { icon: "✉", label: "Messages", route: "/messages" },
  ];

  return (
    <>
      {/* NEW: Hamburger Button for Mobile */}
      <button className="mobile-hamburger" onClick={() => setIsOpen(true)}>
        ☰
      </button>

      {/* NEW: Dark overlay behind the sidebar on mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}

      {/* MODIFIED: Added dynamic 'open' class */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* NEW: Close button inside the sidebar for mobile */}
        <button className="mobile-close-btn" onClick={closeMenu}>
          ✕
        </button>

        <div
          className="sidebar-logo"
          onClick={() => {
            navigate("/dashboard");
            closeMenu();
          }}
        >
          <div className="sidebar-logo-icon">PP</div>
          <span>
            Portfolio<strong>Pro</strong>
          </span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.route}
              className={`sidebar-nav-item ${path === item.route ? "active" : ""}`}
              onClick={() => {
                navigate(item.route);
                closeMenu();
              }}
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
            onClick={() => {
              localStorage.clear();
              navigate("/login");
              closeMenu();
            }}
          >
            ⎋ Logout
          </button>
        </div>
      </aside>
    </>
  );
}
