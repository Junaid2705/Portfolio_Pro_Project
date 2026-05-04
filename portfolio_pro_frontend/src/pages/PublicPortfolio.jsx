// src/pages/PublicPortfolio.jsx
// Public portfolio — accessible via /p/:slug by anyone including recruiters

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { sendContactMessage } from "../api/contactApi";
import "./PublicPortfolio.css";

export default function PublicPortfolio({
  previewMode = false,
  mockData = null,
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const contactRef = useRef(null);

  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("about");

  // Contact form
  const [contactForm, setContactForm] = useState({
    senderName: "",
    senderEmail: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [contactMsg, setContactMsg] = useState("");
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    if (mockData) {
      // If mockData is provided, skip the backend and use it immediately!
      setPortfolio(mockData.portfolio);
      setProjects(mockData.projects);
      setLoading(false);
    } else {
      loadPortfolio();
    }
  }, [slug, mockData]);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }),
      { threshold: 0.4 },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [portfolio]);

  const loadPortfolio = async () => {
    try {
      let data, projectData;
      if (previewMode) {
        const res = await API.get("/api/portfolio/my");
        data = res.data;
        const pRes = await API.get("/api/projects");
        projectData = pRes.data;
      } else {
        const res = await API.get(`/api/portfolio/public/${slug}`);
        data = res.data;
        // Public projects endpoint
        try {
          const pRes = await API.get(`/api/portfolio/public/${slug}/projects`);
          projectData = pRes.data;
        } catch {
          projectData = [];
        }
      }
      setPortfolio(data);
      setProjects(projectData || []);
    } catch {
      setError("Portfolio not found or not published yet.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (
      !contactForm.senderName ||
      !contactForm.senderEmail ||
      !contactForm.message
    ) {
      setContactError("All fields are required");
      return;
    }
    setSending(true);
    setContactError("");
    try {
      const portfolioSlug = portfolio.publicUrlSlug || slug;
      await sendContactMessage(portfolioSlug, contactForm);
      setContactMsg("Message sent! The portfolio owner will get back to you.");
      setContactForm({ senderName: "", senderEmail: "", message: "" });
    } catch (err) {
      setContactError(
        err.response?.data?.error || "Failed to send. Try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const getThemeColors = (theme) => {
    const themes = {
      default: { primary: "#4f9eff", secondary: "#8b6fff", accent: "#00c8ff" },
      dark: { primary: "#8b6fff", secondary: "#c084fc", accent: "#a78bff" },
      minimal: { primary: "#00c896", secondary: "#4f9eff", accent: "#00ffb3" },
      creative: { primary: "#ff6b6b", secondary: "#ffd93d", accent: "#ff9f43" },
    };
    return themes[theme] || themes.default;
  };

  if (loading)
    return (
      <div className="pp-loading">
        <div className="pp-spinner" />
        <p>Loading portfolio...</p>
      </div>
    );

  if (error)
    return (
      <div className="pp-error-screen">
        <div className="pp-error-card">
          <div className="pp-error-icon">📂</div>
          <h2>Portfolio Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/login")}>Go Home</button>
        </div>
      </div>
    );

  const colors = getThemeColors(portfolio.theme);
  const initials = (portfolio.userName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const skillsByCategory =
    portfolio.skills?.reduce((acc, skill) => {
      const cat = skill.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {}) || {};

  const techList = (str) =>
    str
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) || [];

  const navLinks = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];
  // ==========================================
  // TEMPLATE 1: MINIMALIST (Serif Fonts, Clean Grid, Grayscale)
  // ==========================================
  if (portfolio.template === "minimalist") {
    return (
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          backgroundColor: "#fcfcfc",
          color: "#111",
          minHeight: "100vh",
          padding: "100px 20px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <header style={{ textAlign: "center", marginBottom: "80px" }}>
            {portfolio.profileImage && (
              <img
                src={portfolio.profileImage}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "30px",
                  filter: "grayscale(100%)",
                }}
              />
            )}
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "normal",
                letterSpacing: "-1px",
                margin: "0 0 10px 0",
              }}
            >
              {portfolio.userName}
            </h1>
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "4px",
                color: "#666",
              }}
            >
              {portfolio.designation}
            </p>
          </header>

          <section style={{ marginBottom: "80px" }}>
            <h2
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
                marginBottom: "30px",
                color: "#999",
              }}
            >
              Profile
            </h2>
            <p
              style={{
                fontSize: "22px",
                lineHeight: "1.9",
                color: "#333",
                fontStyle: "italic",
              }}
            >
              "{portfolio.bio}"
            </p>
          </section>

          {projects.length > 0 && (
            <section style={{ marginBottom: "80px" }}>
              <h2
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "10px",
                  marginBottom: "40px",
                  color: "#999",
                }}
              >
                Selected Works
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "50px",
                }}
              >
                {projects.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      borderBottom: "1px dotted #ccc",
                      paddingBottom: "20px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: "28px",
                          margin: "0 0 15px 0",
                          fontWeight: "normal",
                        }}
                      >
                        {p.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "Arial, sans-serif",
                          color: "#666",
                          lineHeight: "1.6",
                          margin: "0 0 15px 0",
                          fontSize: "14px",
                          maxWidth: "500px",
                        }}
                      >
                        {p.description}
                      </p>
                    </div>
                    <div style={{ marginLeft: "40px" }}>
                      {p.liveLink && (
                        <a
                          href={p.liveLink}
                          style={{
                            fontFamily: "Arial, sans-serif",
                            color: "#111",
                            textDecoration: "none",
                            borderBottom: "1px solid #111",
                            fontSize: "13px",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                          }}
                        >
                          View Live ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 2: MODERN (Dark Mode, Split Sidebar, Bold Sans-Serif)
  // ==========================================
  if (portfolio.template === "modern") {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          background: "#0f172a",
          color: "#f8fafc",
        }}
      >
        {/* Left Sidebar Fixed */}
        <div
          style={{
            width: "350px",
            background: "#1e293b",
            padding: "60px 40px",
            position: "sticky",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #334155",
          }}
        >
          {portfolio.profileImage ? (
            <img
              src={portfolio.profileImage}
              alt="Profile"
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "20px",
                objectFit: "cover",
                marginBottom: "30px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              }}
            />
          ) : (
            <div
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "20px",
                background: "#334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                marginBottom: "30px",
              }}
            >
              {initials}
            </div>
          )}
          <h1
            style={{
              margin: "0 0 5px 0",
              fontSize: "32px",
              fontWeight: "800",
              color: "#fff",
            }}
          >
            {portfolio.userName}
          </h1>
          <h3
            style={{
              margin: "0 0 30px 0",
              fontWeight: "500",
              color: "#94a3b8",
              fontSize: "16px",
            }}
          >
            {portfolio.designation}
          </h3>

          <div style={{ display: "flex", gap: "15px", marginTop: "auto" }}>
            {portfolio.githubUrl && (
              <a
                href={portfolio.githubUrl}
                style={{
                  background: "#334155",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                GitHub
              </a>
            )}
            {portfolio.linkedinUrl && (
              <a
                href={portfolio.linkedinUrl}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Right Content Scrollable */}
        <div
          style={{
            marginLeft: "350px",
            flex: 1,
            padding: "80px",
            maxWidth: "1000px",
          }}
        >
          <section style={{ marginBottom: "80px" }}>
            <h2
              style={{
                fontSize: "42px",
                fontWeight: "800",
                color: "#fff",
                marginBottom: "30px",
              }}
            >
              About Me.
            </h2>
            <p
              style={{ fontSize: "20px", lineHeight: "1.8", color: "#cbd5e1" }}
            >
              {portfolio.bio}
            </p>
          </section>

          {portfolio.skills?.length > 0 && (
            <section style={{ marginBottom: "80px" }}>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginBottom: "30px",
                  color: "#fff",
                }}
              >
                Tech Stack
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {portfolio.skills.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      color: "#60a5fa",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "15px",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    {s.skillName}
                  </span>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginBottom: "30px",
                  color: "#fff",
                }}
              >
                Featured Work
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "30px",
                }}
              >
                {projects.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: "#1e293b",
                      padding: "30px",
                      borderRadius: "16px",
                      border: "1px solid #334155",
                      transition: "transform 0.2s",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 15px 0",
                        color: "#fff",
                        fontSize: "22px",
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "16px",
                        lineHeight: "1.6",
                        marginBottom: "20px",
                      }}
                    >
                      {p.description}
                    </p>
                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      {p.techStack?.split(",").map((t, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "12px",
                            background: "#0f172a",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            color: "#cbd5e1",
                          }}
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 3: CLASSIC (Your original design)
  // ==========================================

  return (
    <div
      className="pp-root"
      style={{
        "--pp-primary": colors.primary,
        "--pp-secondary": colors.secondary,
        "--pp-accent": colors.accent,
      }}
    >
      {/* Preview Banner */}
      {previewMode && (
        <div className="pp-preview-banner">
          <span>
            👁 Preview Mode — This is how recruiters see your portfolio
          </span>
          <button onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav className={`pp-nav ${previewMode ? "has-banner" : ""}`}>
        <div className="pp-nav-brand">
          {portfolio.title || portfolio.userName}
        </div>
        <div className="pp-nav-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`pp-nav-link ${activeSection === link.id ? "active" : ""}`}
              onClick={() =>
                document
                  .getElementById(link.id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {link.label}
            </button>
          ))}
          {portfolio.githubUrl && (
            <a
              href={portfolio.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="pp-nav-cta"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </nav>

      {/* ═══ HERO / ABOUT ═══ */}
      <section id="about" className="pp-hero">
        <div className="pp-hero-orb pp-orb-1" />
        <div className="pp-hero-orb pp-orb-2" />

        <div className="pp-hero-inner">
          <div className="pp-hero-left">
            <div className="pp-avatar-ring">
              {portfolio.profileImage ? (
                <img
                  src={portfolio.profileImage}
                  alt={portfolio.userName}
                  className="pp-avatar-img"
                />
              ) : (
                <div className="pp-avatar-initials">{initials}</div>
              )}
            </div>
            {portfolio.status === "PUBLISHED" && (
              <div className="pp-available">✦ Open to opportunities</div>
            )}
          </div>

          <div className="pp-hero-right">
            <p className="pp-hello">Hello, I'm</p>
            <h1 className="pp-name">{portfolio.userName}</h1>
            <h2 className="pp-role">{portfolio.designation || "Developer"}</h2>
            <p className="pp-bio">{portfolio.bio}</p>

            <div className="pp-cta-row">
              <button
                className="pp-cta-primary"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Get In Touch
              </button>
              {portfolio.githubUrl && (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pp-cta-outline"
                >
                  GitHub ↗
                </a>
              )}
              {portfolio.linkedinUrl && (
                <a
                  href={portfolio.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pp-cta-outline"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pp-scroll-hint">
          <div className="pp-scroll-mouse">
            <div className="pp-scroll-wheel" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ═══ SKILLS ═══ */}
      {portfolio.skills?.length > 0 && (
        <section id="skills" className="pp-section">
          <div className="pp-section-inner">
            <div className="pp-section-label">Expertise</div>
            <h2 className="pp-section-title">Skills & Technologies</h2>
            <p className="pp-section-desc">Technologies I build with</p>

            <div className="pp-skills-grid">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="pp-skill-group">
                  <h3 className="pp-skill-group-title">{category}</h3>
                  <div className="pp-skill-chips">
                    {skills.map((skill, i) => (
                      <div key={i} className="pp-skill-chip">
                        <span className="pp-skill-chip-name">
                          {skill.skillName}
                        </span>
                        <span
                          className={`pp-skill-chip-level level-${skill.level?.toLowerCase()}`}
                        >
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ PROJECTS ═══ */}
      {projects.length > 0 && (
        <section id="projects" className="pp-section pp-section-alt">
          <div className="pp-section-inner">
            <div className="pp-section-label">Work</div>
            <h2 className="pp-section-title">Featured Projects</h2>
            <p className="pp-section-desc">Things I've built</p>

            <div className="pp-projects-grid">
              {projects.map((project, i) => (
                <div
                  key={project.id}
                  className="pp-project-card"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {project.imageUrl ? (
                    <div className="pp-project-img">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        onError={(e) => {
                          e.target.parentElement.style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="pp-project-img-placeholder">
                      <span style={{ fontSize: 36, opacity: 0.2 }}>⬡</span>
                    </div>
                  )}

                  <div className="pp-project-body">
                    <h3 className="pp-project-title">{project.title}</h3>
                    {project.description && (
                      <p className="pp-project-desc">{project.description}</p>
                    )}

                    {project.techStack && (
                      <div className="pp-project-tech">
                        {techList(project.techStack)
                          .slice(0, 5)
                          .map((t, ti) => (
                            <span key={ti} className="pp-tech-tag">
                              {t}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="pp-project-links">
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="pp-project-link live"
                        >
                          🔗 Live Demo
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="pp-project-link github"
                        >
                          ⌨ GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="pp-section" ref={contactRef}>
        <div className="pp-section-inner">
          <div className="pp-section-label">Get In Touch</div>
          <h2 className="pp-section-title">Let's Work Together</h2>
          <p className="pp-section-desc">
            Have a project or opportunity? I'd love to hear from you.
          </p>

          <div className="pp-contact-layout">
            {/* Info */}
            <div className="pp-contact-info">
              <div className="pp-contact-links">
                {portfolio.linkedinUrl && (
                  <a
                    href={portfolio.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pp-contact-link-card"
                  >
                    <span className="pp-contact-link-icon">💼</span>
                    <div>
                      <strong>LinkedIn</strong>
                      <span>Connect with me</span>
                    </div>
                    <span className="pp-contact-link-arrow">↗</span>
                  </a>
                )}
                {portfolio.githubUrl && (
                  <a
                    href={portfolio.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pp-contact-link-card"
                  >
                    <span className="pp-contact-link-icon">⌨</span>
                    <div>
                      <strong>GitHub</strong>
                      <span>See my code</span>
                    </div>
                    <span className="pp-contact-link-arrow">↗</span>
                  </a>
                )}
                {portfolio.websiteUrl && (
                  <a
                    href={portfolio.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pp-contact-link-card"
                  >
                    <span className="pp-contact-link-icon">🌐</span>
                    <div>
                      <strong>Website</strong>
                      <span>Visit my site</span>
                    </div>
                    <span className="pp-contact-link-arrow">↗</span>
                  </a>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="pp-contact-form-wrap">
              {contactMsg ? (
                <div className="pp-contact-success">
                  <div className="pp-contact-success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>{contactMsg}</p>
                  <button onClick={() => setContactMsg("")}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form
                  className="pp-contact-form"
                  onSubmit={handleContactSubmit}
                  noValidate
                >
                  <h3 className="pp-form-title">Send a Message</h3>

                  {contactError && (
                    <div className="pp-form-error">⚠ {contactError}</div>
                  )}

                  <div className="pp-form-row">
                    <div className="pp-form-field">
                      <label>Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={contactForm.senderName}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            senderName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="pp-form-field">
                      <label>Your Email</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={contactForm.senderEmail}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            senderEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="pp-form-field">
                    <label>Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell me about your project or opportunity..."
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="pp-form-submit"
                    disabled={sending}
                  >
                    {sending ? (
                      <span className="pp-form-spinner" />
                    ) : (
                      "Send Message →"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pp-footer">
        <p>
          <strong>{portfolio.userName}</strong>
          {portfolio.publicUrlSlug && (
            <span> · portfoliopro.com/p/{portfolio.publicUrlSlug}</span>
          )}
        </p>
        <p className="pp-footer-sub">Built with Portfolio Pro</p>
      </footer>
    </div>
  );

  // ==========================================
  // PREMIUM TEMPLATE: BENTO BOX (Figma-Inspired Grid)
  // ==========================================
  if (portfolio.template === "bento") {
    return (
      <div
        style={{
          background: "#f4f5f7",
          minHeight: "100vh",
          padding: "60px 20px",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Bento Grid Container */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              gridAutoRows: "minmax(200px, auto)",
            }}
          >
            {/* Box 1: Profile (Spans 2 columns on desktop) */}
            <div
              style={{
                background: "white",
                borderRadius: "32px",
                padding: "40px",
                gridColumn: "1 / -1",
                display: "flex",
                alignItems: "center",
                gap: "40px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
              }}
            >
              {portfolio.profileImage ? (
                <img
                  src={portfolio.profileImage}
                  alt="Profile"
                  style={{
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    background: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                  }}
                >
                  {initials}
                </div>
              )}
              <div>
                <h1
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "48px",
                    fontWeight: "800",
                    letterSpacing: "-1px",
                    color: "#111",
                  }}
                >
                  {portfolio.userName}
                </h1>
                <h2
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "24px",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  {portfolio.designation}
                </h2>
                <div style={{ display: "flex", gap: "15px" }}>
                  {portfolio.githubUrl && (
                    <a
                      href={portfolio.githubUrl}
                      style={{
                        background: "#111",
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: "100px",
                        textDecoration: "none",
                        fontWeight: "600",
                      }}
                    >
                      GitHub
                    </a>
                  )}
                  {portfolio.linkedinUrl && (
                    <a
                      href={portfolio.linkedinUrl}
                      style={{
                        background: "#0a66c2",
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: "100px",
                        textDecoration: "none",
                        fontWeight: "600",
                      }}
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Box 2: Bio */}
            <div
              style={{
                background: "white",
                borderRadius: "32px",
                padding: "40px",
                gridColumn: "span 2",
                boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "20px",
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                About Me
              </h3>
              <p
                style={{
                  fontSize: "22px",
                  lineHeight: "1.6",
                  color: "#333",
                  fontWeight: "500",
                }}
              >
                {portfolio.bio}
              </p>
            </div>

            {/* Box 3: Skills (Mini Bento) */}
            <div
              style={{
                background: "linear-gradient(135deg, #4f9eff, #8b6fff)",
                borderRadius: "32px",
                padding: "40px",
                color: "white",
                boxShadow: "0 10px 40px rgba(79, 158, 255, 0.2)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "20px",
                  opacity: 0.9,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Tech Stack
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {portfolio.skills?.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      padding: "10px 20px",
                      borderRadius: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {s.skillName}
                  </span>
                ))}
              </div>
            </div>

            {/* Box 4+: Projects */}
            {projects.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "white",
                  borderRadius: "32px",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    flex: 1,
                  }}
                >
                  {p.description}
                </p>
                {p.liveLink && (
                  <a
                    href={p.liveLink}
                    style={{
                      marginTop: "20px",
                      display: "inline-block",
                      color: "#4f9eff",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE: DEVELOPER DARK (Terminal Inspired)
  // ==========================================
  if (portfolio.template === "devdark") {
    return (
      <div
        style={{
          background: "#0d1117",
          minHeight: "100vh",
          padding: "60px 20px",
          fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
          color: "#c9d1d9",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            border: "1px solid #30363d",
            borderRadius: "10px",
            background: "#161b22",
            overflow: "hidden",
          }}
        >
          {/* Mock Mac Window Header */}
          <div
            style={{
              background: "#21262d",
              padding: "10px 20px",
              display: "flex",
              gap: "8px",
              borderBottom: "1px solid #30363d",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#ff5f56",
              }}
            ></div>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#ffbd2e",
              }}
            ></div>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#27c93f",
              }}
            ></div>
            <span
              style={{ marginLeft: "15px", fontSize: "12px", color: "#8b949e" }}
            >
              ~/portfolio/{portfolio.userName.toLowerCase().replace(" ", "_")}
            </span>
          </div>

          <div style={{ padding: "40px" }}>
            <h1
              style={{
                color: "#58a6ff",
                fontSize: "32px",
                margin: "0 0 10px 0",
              }}
            >{`> Hello, I'm ${portfolio.userName}_`}</h1>
            <h2
              style={{
                color: "#8b949e",
                fontSize: "18px",
                fontWeight: "normal",
                marginBottom: "30px",
              }}
            >{`/* ${portfolio.designation} */`}</h2>

            <p
              style={{
                lineHeight: "1.7",
                color: "#c9d1d9",
                marginBottom: "40px",
              }}
            >
              {portfolio.bio}
            </p>

            <h3
              style={{
                color: "#7ee787",
                borderBottom: "1px solid #30363d",
                paddingBottom: "10px",
              }}
            >
              $ ls ./skills
            </h3>
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "40px",
                marginTop: "20px",
              }}
            >
              {portfolio.skills?.map((s, i) => (
                <span key={i} style={{ color: "#d2a8ff" }}>
                  [{s.skillName}]
                </span>
              ))}
            </div>

            <h3
              style={{
                color: "#7ee787",
                borderBottom: "1px solid #30363d",
                paddingBottom: "10px",
              }}
            >
              $ cat ./projects.txt
            </h3>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "30px",
              }}
            >
              {projects.map((p) => (
                <div key={p.id}>
                  <h4
                    style={{
                      color: "#58a6ff",
                      margin: "0 0 10px 0",
                      fontSize: "20px",
                    }}
                  >
                    {p.title}
                  </h4>
                  <p style={{ color: "#8b949e", margin: "0 0 10px 0" }}>
                    {p.description}
                  </p>
                  {p.liveLink && (
                    <a
                      href={p.liveLink}
                      style={{ color: "#7ee787", textDecoration: "none" }}
                    >
                      --view-live
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE: NEO-BRUTALISM (Figma Trend)
  // ==========================================
  if (portfolio.template === "neobrutalism") {
    return (
      <div
        style={{
          background: "#fdf8e2",
          minHeight: "100vh",
          padding: "80px 20px",
          fontFamily: "Space Grotesk, sans-serif",
          color: "#000",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              border: "4px solid #000",
              boxShadow: "8px 8px 0px #000",
              padding: "50px",
              marginBottom: "60px",
              display: "flex",
              gap: "40px",
              alignItems: "center",
            }}
          >
            {portfolio.profileImage ? (
              <img
                src={portfolio.profileImage}
                alt="Profile"
                style={{
                  width: "150px",
                  height: "150px",
                  border: "4px solid #000",
                  boxShadow: "6px 6px 0px #ff6b6b",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  border: "4px solid #000",
                  boxShadow: "6px 6px 0px #ff6b6b",
                  background: "#4f9eff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                {initials}
              </div>
            )}
            <div>
              <h1
                style={{
                  fontSize: "60px",
                  fontWeight: "900",
                  margin: "0 0 10px 0",
                  textTransform: "uppercase",
                }}
              >
                {portfolio.userName}
              </h1>
              <h2
                style={{
                  fontSize: "24px",
                  background: "#4f9eff",
                  display: "inline-block",
                  padding: "5px 15px",
                  border: "3px solid #000",
                  margin: "0",
                }}
              >
                {portfolio.designation}
              </h2>
            </div>
          </div>

          <div
            style={{
              background: "#ff9ff3",
              border: "4px solid #000",
              boxShadow: "8px 8px 0px #000",
              padding: "40px",
              marginBottom: "60px",
            }}
          >
            <h3
              style={{
                fontSize: "30px",
                fontWeight: "900",
                margin: "0 0 20px 0",
                textTransform: "uppercase",
              }}
            >
              ABOUT ME
            </h3>
            <p
              style={{ fontSize: "20px", fontWeight: "600", lineHeight: "1.6" }}
            >
              {portfolio.bio}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
            }}
          >
            {projects.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  border: "4px solid #000",
                  boxShadow: "8px 8px 0px #000",
                  padding: "30px",
                  transition: "transform 0.1s",
                }}
                className="neo-card"
              >
                <h4
                  style={{
                    fontSize: "24px",
                    fontWeight: "900",
                    margin: "0 0 15px 0",
                  }}
                >
                  {p.title}
                </h4>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "20px",
                  }}
                >
                  {p.description}
                </p>
                {p.liveLink && (
                  <a
                    href={p.liveLink}
                    style={{
                      background: "#1dd1a1",
                      color: "#000",
                      border: "3px solid #000",
                      padding: "10px 20px",
                      textDecoration: "none",
                      fontWeight: "900",
                      display: "inline-block",
                      boxShadow: "4px 4px 0px #000",
                    }}
                  >
                    OPEN LINK →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
