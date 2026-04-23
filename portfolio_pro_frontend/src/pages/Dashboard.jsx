// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyPortfolio, publishPortfolio } from "../api/portfolioApi";
import "./Dashboard.css";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "";

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await getMyPortfolio();
      setPortfolio(data);
    } catch {
      setPortfolio(null); // no portfolio yet
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const updated = await publishPortfolio();
      setPortfolio(updated);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="db-root">
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="db-logo">
          <div className="db-logo-icon">PP</div>
          <span>
            Portfolio<strong>Pro</strong>
          </span>
        </div>

        <nav className="db-nav">
          <div className="db-nav-item active">
            <span className="db-nav-icon">⊞</span> Dashboard
          </div>
          <div
            className="db-nav-item"
            onClick={() => navigate("/portfolio/builder")}
          >
            <span className="db-nav-icon">✏</span> Portfolio Builder
          </div>
          <div className="db-nav-item disabled">
            <span className="db-nav-icon">⬡</span> Projects
            <span className="db-nav-badge">Day 4</span>
          </div>
          <div className="db-nav-item disabled">
            <span className="db-nav-icon">✉</span> Messages
            <span className="db-nav-badge">Day 4</span>
          </div>
        </nav>

        <div className="db-sidebar-bottom">
          <div className="db-user-chip">
            <div className="db-avatar">{initials}</div>
            <div className="db-user-info">
              <span className="db-user-name">{name}</span>
              <span className="db-user-email">{email}</span>
            </div>
          </div>
          <button className="db-logout-btn" onClick={handleLogout}>
            ⎋ Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`db-main ${visible ? "db-visible" : ""}`}>
        {/* Top bar */}
        <header className="db-header">
          <div>
            <h1 className="db-page-title">Dashboard</h1>
            <p className="db-page-sub">Welcome back, {name.split(" ")[0]} 👋</p>
          </div>
          <button
            className="db-build-btn"
            onClick={() => navigate("/portfolio/builder")}
          >
            {portfolio ? "✏ Edit Portfolio" : "+ Create Portfolio"}
          </button>
        </header>

        {loading ? (
          <div className="db-loading">
            <div className="db-spinner" />
            <p>Loading your portfolio...</p>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="db-stats">
              <div className="db-stat-card">
                <div
                  className="db-stat-icon"
                  style={{
                    background: "rgba(139,111,255,0.15)",
                    color: "#8b6fff",
                  }}
                >
                  ⊞
                </div>
                <div>
                  <div className="db-stat-num">{portfolio ? "1" : "0"}</div>
                  <div className="db-stat-label">Portfolio</div>
                </div>
              </div>
              <div className="db-stat-card">
                <div
                  className="db-stat-icon"
                  style={{
                    background: "rgba(79,158,255,0.15)",
                    color: "#4f9eff",
                  }}
                >
                  👁
                </div>
                <div>
                  <div className="db-stat-num">
                    {portfolio?.viewsCount || 0}
                  </div>
                  <div className="db-stat-label">Total Views</div>
                </div>
              </div>
              <div className="db-stat-card">
                <div
                  className="db-stat-icon"
                  style={{
                    background: "rgba(0,200,150,0.15)",
                    color: "#00c896",
                  }}
                >
                  ⚡
                </div>
                <div>
                  <div className="db-stat-num">
                    {portfolio?.skills?.length || 0}
                  </div>
                  <div className="db-stat-label">Skills Added</div>
                </div>
              </div>
              <div className="db-stat-card">
                <div
                  className="db-stat-icon"
                  style={{
                    background: "rgba(255,180,0,0.15)",
                    color: "#ffb400",
                  }}
                >
                  ★
                </div>
                <div>
                  <div className="db-stat-num">
                    {portfolio?.status === "PUBLISHED" ? "Live" : "Draft"}
                  </div>
                  <div className="db-stat-label">Status</div>
                </div>
              </div>
            </div>

            {/* Portfolio card or empty state */}
            {portfolio ? (
              <div className="db-portfolio-card">
                <div className="db-portfolio-card-header">
                  <div>
                    <h2>{portfolio.title || "My Portfolio"}</h2>
                    <p>{portfolio.designation || "No designation set"}</p>
                  </div>
                  <span
                    className={`db-status-badge ${portfolio.status === "PUBLISHED" ? "published" : "draft"}`}
                  >
                    {portfolio.status === "PUBLISHED"
                      ? "🟢 Published"
                      : "⚪ Draft"}
                  </span>
                </div>

                <p className="db-portfolio-bio">
                  {portfolio.bio ||
                    "No bio added yet. Click Edit Portfolio to add one."}
                </p>

                {/* Skills preview */}
                {portfolio.skills?.length > 0 && (
                  <div className="db-skills-preview">
                    <p className="db-section-label">Skills</p>
                    <div className="db-skills-list">
                      {portfolio.skills.slice(0, 8).map((s, i) => (
                        <span key={i} className="db-skill-tag">
                          {s.skillName}
                        </span>
                      ))}
                      {portfolio.skills.length > 8 && (
                        <span className="db-skill-tag-more">
                          +{portfolio.skills.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="db-portfolio-links">
                  {portfolio.githubUrl && (
                    <a
                      href={portfolio.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="db-link-chip"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {portfolio.linkedinUrl && (
                    <a
                      href={portfolio.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="db-link-chip"
                    >
                      LinkedIn ↗
                    </a>
                  )}
                  {portfolio.publicUrlSlug && (
                    <span className="db-link-chip slug">
                      portfoliopro.com/{portfolio.publicUrlSlug}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="db-portfolio-actions">
                  <button
                    className="db-action-btn primary"
                    onClick={() => navigate("/portfolio/builder")}
                  >
                    ✏ Edit Portfolio
                  </button>
                  <button
                    className="db-action-btn"
                    onClick={handlePublish}
                    disabled={publishing}
                  >
                    {publishing
                      ? "..."
                      : portfolio.status === "PUBLISHED"
                        ? "⏸ Unpublish"
                        : "🚀 Publish"}
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="db-empty">
                <div className="db-empty-icon">⊞</div>
                <h2>No portfolio yet</h2>
                <p>
                  Create your first portfolio and start showcasing your work to
                  the world.
                </p>
                <button
                  className="db-build-btn large"
                  onClick={() => navigate("/portfolio/builder")}
                >
                  + Create My Portfolio
                </button>
              </div>
            )}

            {/* Quick steps */}
            <div className="db-steps">
              <p className="db-section-label">Getting Started</p>
              <div className="db-steps-grid">
                {[
                  {
                    n: 1,
                    title: "Create Portfolio",
                    done: !!portfolio,
                    action: () => navigate("/portfolio/builder"),
                  },
                  {
                    n: 2,
                    title: "Add Skills",
                    done: portfolio?.skills?.length > 0,
                    action: () => navigate("/portfolio/builder"),
                  },
                  {
                    n: 3,
                    title: "Set Public URL",
                    done: !!portfolio?.publicUrlSlug,
                    action: () => navigate("/portfolio/builder"),
                  },
                  {
                    n: 4,
                    title: "Publish Live",
                    done: portfolio?.status === "PUBLISHED",
                    action: handlePublish,
                  },
                ].map((step) => (
                  <div
                    key={step.n}
                    className={`db-step ${step.done ? "done" : ""}`}
                    onClick={step.action}
                  >
                    <div className="db-step-num">
                      {step.done ? "✓" : step.n}
                    </div>
                    <span>{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
