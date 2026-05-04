// src/pages/TemplatePreview.jsx
import { useLocation, useNavigate } from "react-router-dom";
import PublicPortfolio from "./PublicPortfolio";

const MOCK_DATA = {
  portfolio: {
    userName: "Alex Morgan",
    designation: "Senior Full Stack Engineer",
    bio: "I build exceptional and accessible digital experiences for the web. With over 5 years of experience building scalable applications, I turn complex problems into beautiful, intuitive designs. Always learning, always coding.",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    websiteUrl: "https://alexmorgan.dev",
    profileImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    skills: [
      { skillName: "React & Redux", level: "EXPERT", category: "Frontend" },
      { skillName: "Spring Boot", level: "ADVANCED", category: "Backend" },
      { skillName: "PostgreSQL", level: "INTERMEDIATE", category: "Database" },
      {
        skillName: "AWS Cloud",
        level: "INTERMEDIATE",
        category: "Infrastructure",
      },
    ],
    status: "PUBLISHED",
  },
  projects: [
    {
      id: 1,
      title: "FinTech Dashboard Analytics",
      description:
        "A secure, real-time analytics dashboard for tracking personal finance metrics, built with React and D3.js. Features live WebSocket data streaming.",
      techStack: "React, Node.js, WebSockets",
      liveLink: "https://demo.com",
      githubLink: "https://github.com",
    },
    {
      id: 2,
      title: "E-Commerce Microservices",
      description:
        "A scalable backend architecture for a modern e-commerce platform handling 10k+ requests per minute.",
      techStack: "Java, Spring Boot, Docker",
      githubLink: "https://github.com",
    },
  ],
};

export default function TemplatePreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const templateId = queryParams.get("template") || "classic";

  // Inject the chosen template ID into our fake user data
  const previewData = {
    ...MOCK_DATA,
    portfolio: { ...MOCK_DATA.portfolio, template: templateId },
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Top Preview Bar */}
      <div
        style={{
          background: "#111",
          color: "white",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "1px",
            color: "#aaa",
          }}
        >
          👁 PREVIEWING:{" "}
          <strong style={{ color: "white" }}>
            {templateId.toUpperCase()} TEMPLATE
          </strong>
        </span>
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={() => navigate("/templates")}
            style={{
              background: "transparent",
              border: "1px solid #555",
              color: "white",
              padding: "8px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            ← Back to Gallery
          </button>
          <button
            onClick={() =>
              navigate(`/portfolio/builder?template=${templateId}`)
            }
            style={{
              background: "#4f9eff",
              border: "none",
              color: "white",
              padding: "8px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Use This Template
          </button>
        </div>
      </div>

      {/* Render the actual portfolio below the bar */}
      <div style={{ marginTop: "60px" }}>
        <PublicPortfolio mockData={previewData} />
      </div>
    </div>
  );
}
