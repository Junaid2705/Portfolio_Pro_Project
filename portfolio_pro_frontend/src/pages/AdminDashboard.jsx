// src/pages/AdminDashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminStats,
  getAllUsers,
  toggleUser,
  deleteUser,
  getAllPortfolios,
  approvePortfolio,
  rejectPortfolio,
} from "../api/adminApi";
import "./AdminDashboard.css";

const TABS = ["Dashboard", "Users", "Portfolios"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("Dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // --- NEW: Mobile Menu State ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const name = localStorage.getItem("name") || "Admin";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, u, p] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getAllPortfolios(),
      ]);
      setStats(s);
      setUsers(u);
      setPortfolios(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (id) => {
    try {
      const updated = await toggleUser(id);
      setUsers(users.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (
      !window.confirm(
        `Delete user "${name}"? This will also delete their portfolio.`,
      )
    )
      return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      setPortfolios(portfolios.filter((p) => p.userName !== name));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  const handleApprove = async (id) => {
    try {
      const updated = await approvePortfolio(id);
      setPortfolios(portfolios.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      const updated = await rejectPortfolio(id);
      setPortfolios(portfolios.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredPortfolios = portfolios.filter(
    (p) =>
      (p.userName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.title || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="adm-root">
      {/* --- NEW: Mobile Hamburger Button --- */}
      <button
        className="adm-mobile-hamburger"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      {/* --- NEW: Dark Mobile Overlay --- */}
      {isSidebarOpen && (
        <div
          className="adm-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- MODIFIED: Sidebar with dynamic 'open' class --- */}
      <aside className={`adm-sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* --- NEW: Mobile Close Button --- */}
        <button
          className="adm-mobile-close-btn"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>

        <div className="adm-logo">
          <div className="adm-logo-icon">PP</div>
          <span>
            Portfolio<strong>Pro</strong>
          </span>
          <span className="adm-badge">Admin</span>
        </div>

        <nav className="adm-nav">
          {TABS.map((t) => (
            <div
              key={t}
              className={`adm-nav-item ${tab === t ? "active" : ""}`}
              onClick={() => {
                setTab(t);
                setIsSidebarOpen(false); /* Auto-close menu on click */
              }}
            >
              <span className="adm-nav-icon">
                {t === "Dashboard" ? "⊞" : t === "Users" ? "👥" : "📁"}
              </span>
              {t}
              {t === "Users" && users.length > 0 && (
                <span className="adm-count">{users.length}</span>
              )}
              {t === "Portfolios" && portfolios.length > 0 && (
                <span className="adm-count">{portfolios.length}</span>
              )}
            </div>
          ))}
        </nav>

        <div className="adm-sidebar-bottom">
          <div className="adm-user-chip">
            <div className="adm-avatar">{initials}</div>
            <div>
              <span className="adm-user-name">{name}</span>
              <span className="adm-user-role">Administrator</span>
            </div>
          </div>
          <button
            className="adm-logout"
            onClick={() => {
              localStorage.clear();
              setIsSidebarOpen(false);
              navigate("/login");
            }}
          >
            ⎋ Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`adm-main ${visible ? "adm-visible" : ""}`}>
        {/* Header */}
        <header className="adm-header">
          <div>
            <h1 className="adm-page-title">{tab}</h1>
            <p className="adm-page-sub">
              {tab === "Dashboard" && "System overview and analytics"}
              {tab === "Users" && `${users.length} registered users`}
              {tab === "Portfolios" && `${portfolios.length} total portfolios`}
            </p>
          </div>
          {(tab === "Users" || tab === "Portfolios") && (
            <div className="adm-search-wrap">
              <span className="adm-search-icon">⌕</span>
              <input
                className="adm-search"
                placeholder={`Search ${tab.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
        </header>

        {loading ? (
          <div className="adm-loading">
            <div className="adm-spinner" />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* ═══ DASHBOARD TAB ═══ */}
            {tab === "Dashboard" && stats && (
              <div className="adm-dashboard">
                {/* Stats */}
                <div className="adm-stats">
                  {[
                    {
                      label: "Total Users",
                      value: stats.totalUsers,
                      icon: "👥",
                      color: "#8b6fff",
                    },
                    {
                      label: "Total Portfolios",
                      value: stats.totalPortfolios,
                      icon: "📁",
                      color: "#4f9eff",
                    },
                    {
                      label: "Published",
                      value: stats.publishedPortfolios,
                      icon: "🌐",
                      color: "#00c896",
                    },
                    {
                      label: "Messages",
                      value: stats.totalMessages,
                      icon: "✉",
                      color: "#ffb400",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="adm-stat-card"
                      style={{ "--sc": s.color }}
                    >
                      <div className="adm-stat-icon">{s.icon}</div>
                      <div className="adm-stat-num">{s.value}</div>
                      <div className="adm-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Quick overview */}
                <div className="adm-overview-grid">
                  <div className="adm-overview-card">
                    <h3>Recent Users</h3>
                    <div className="adm-mini-list">
                      {users.slice(0, 5).map((u) => (
                        <div key={u.id} className="adm-mini-row">
                          <div className="adm-mini-avatar">
                            {u.name[0].toUpperCase()}
                          </div>
                          <div className="adm-mini-info">
                            <span>{u.name}</span>
                            <span>{u.email}</span>
                          </div>
                          <span
                            className={`adm-role-tag ${u.role.toLowerCase()}`}
                          >
                            {u.role}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="adm-view-all"
                      onClick={() => setTab("Users")}
                    >
                      View All Users →
                    </button>
                  </div>

                  <div className="adm-overview-card">
                    <h3>Portfolio Status</h3>
                    <div className="adm-status-breakdown">
                      {[
                        {
                          label: "Draft",
                          color: "#6b6988",
                          count: portfolios.filter((p) => p.status === "DRAFT")
                            .length,
                        },
                        {
                          label: "Published",
                          color: "#00c896",
                          count: portfolios.filter(
                            (p) => p.status === "PUBLISHED",
                          ).length,
                        },
                        {
                          label: "Rejected",
                          color: "#ff7070",
                          count: portfolios.filter(
                            (p) => p.status === "REJECTED",
                          ).length,
                        },
                      ].map((s) => (
                        <div key={s.label} className="adm-status-row">
                          <div
                            className="adm-status-dot"
                            style={{ background: s.color }}
                          />
                          <span className="adm-status-label">{s.label}</span>
                          <span
                            className="adm-status-count"
                            style={{ color: s.color }}
                          >
                            {s.count}
                          </span>
                          <div className="adm-status-bar-wrap">
                            <div
                              className="adm-status-bar"
                              style={{
                                width: `${portfolios.length ? (s.count / portfolios.length) * 100 : 0}%`,
                                background: s.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="adm-view-all"
                      onClick={() => setTab("Portfolios")}
                    >
                      Manage Portfolios →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ USERS TAB ═══ */}
            {tab === "Users" && (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="adm-table-user">
                            <div className="adm-table-avatar">
                              {user.name[0].toUpperCase()}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="adm-table-email">{user.email}</td>
                        <td>
                          <span
                            className={`adm-role-tag ${user.role.toLowerCase()}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`adm-status-tag ${user.status.toLowerCase()}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="adm-table-date">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </td>
                        <td>
                          {user.role !== "ADMIN" && (
                            <div className="adm-table-actions">
                              <button
                                className={`adm-action-btn ${user.status === "ACTIVE" ? "deactivate" : "activate"}`}
                                onClick={() => handleToggleUser(user.id)}
                              >
                                {user.status === "ACTIVE"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                              <button
                                className="adm-action-btn delete"
                                onClick={() =>
                                  handleDeleteUser(user.id, user.name)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          )}
                          {user.role === "ADMIN" && (
                            <span className="adm-protected">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="adm-empty">No users found</div>
                )}
              </div>
            )}

            {/* ═══ PORTFOLIOS TAB ═══ */}
            {tab === "Portfolios" && (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Owner</th>
                      <th>Title</th>
                      <th>Slug / URL</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPortfolios.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="adm-table-user">
                            <div className="adm-table-avatar">
                              {(p.userName || "U")[0].toUpperCase()}
                            </div>
                            <span>{p.userName}</span>
                          </div>
                        </td>
                        <td className="adm-table-title">{p.title || "—"}</td>
                        <td className="adm-table-slug">
                          {p.publicUrlSlug ? (
                            <span>/p/{p.publicUrlSlug}</span>
                          ) : (
                            <span className="adm-no-slug">Not set</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`adm-status-tag ${p.status?.toLowerCase()}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="adm-table-views">{p.viewsCount || 0}</td>
                        <td>
                          <div className="adm-table-actions">
                            {p.status !== "PUBLISHED" && (
                              <button
                                className="adm-action-btn activate"
                                onClick={() => handleApprove(p.id)}
                              >
                                Approve
                              </button>
                            )}
                            {p.status === "PUBLISHED" && (
                              <button
                                className="adm-action-btn deactivate"
                                onClick={() => handleReject(p.id)}
                              >
                                Unpublish
                              </button>
                            )}
                            {p.publicUrlSlug && (
                              <a
                                href={`/p/${p.publicUrlSlug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="adm-action-btn view"
                              >
                                View ↗
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPortfolios.length === 0 && (
                  <div className="adm-empty">No portfolios found</div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
