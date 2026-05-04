// src/pages/TemplateGallery.jsx
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./TemplateGallery.css";

const AVAILABLE_TEMPLATES = [
  // --- FREE TEMPLATES (12) ---
  {
    id: "classic",
    name: "Classic Professional",
    description: "Clean, centered layout for general use.",
    previewColor: "#4f9eff",
    icon: "📄",
    isPremium: false,
  },
  {
    id: "modern",
    name: "Modern Sidebar",
    description: "Bold, split-screen design.",
    previewColor: "#ff6b6b",
    icon: "🗂",
    isPremium: false,
  },
  {
    id: "minimalist",
    name: "Clean Minimalist",
    description: "Stripped back and simple.",
    previewColor: "#00c896",
    icon: "✨",
    isPremium: false,
  },
  {
    id: "devdark",
    name: "Developer Dark",
    description: "Terminal-inspired dark theme.",
    previewColor: "#1e1e1e",
    icon: "⌨",
    isPremium: false,
  },
  {
    id: "agency",
    name: "Creative Agency",
    description: "Large typography and bold colors.",
    previewColor: "#ff9f43",
    icon: "🎨",
    isPremium: false,
  },
  {
    id: "academic",
    name: "Academic Scholar",
    description: "Traditional serif formatting for publications.",
    previewColor: "#8b6fff",
    icon: "📚",
    isPremium: false,
  },
  {
    id: "startup",
    name: "SaaS Startup",
    description: "Looks like a modern landing page.",
    previewColor: "#00d2d3",
    icon: "🚀",
    isPremium: false,
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "Strictly black, white, and gray.",
    previewColor: "#555555",
    icon: "⬛",
    isPremium: false,
  },
  {
    id: "vibrant",
    name: "Vibrant Gradient",
    description: "Heavy use of modern CSS gradients.",
    previewColor: "#f368e0",
    icon: "🌈",
    isPremium: false,
  },
  {
    id: "neobrutalism",
    name: "Neo-Brutalism",
    description: "Harsh shadows and bold outlines (Figma trend).",
    previewColor: "#ff9ff3",
    icon: "🏗",
    isPremium: false,
  },
  {
    id: "cards",
    name: "Card UI",
    description: "Everything separated into neat floating cards.",
    previewColor: "#54a0ff",
    icon: "🃏",
    isPremium: false,
  },
  {
    id: "timeline",
    name: "Timeline View",
    description: "Focuses on the chronological journey.",
    previewColor: "#1dd1a1",
    icon: "⏳",
    isPremium: false,
  },

  // --- PREMIUM TEMPLATES (3) ---
  {
    id: "bento",
    name: "Apple Bento Box",
    description: "Highly trendy grid layout popularized by Apple.",
    previewColor: "#222f3e",
    icon: "🍱",
    isPremium: true,
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism 3D",
    description: "Frosted glass effects over abstract backgrounds.",
    previewColor: "#48dbfb",
    icon: "🪞",
    isPremium: true,
  },
  {
    id: "notion",
    name: "Notion Document",
    description: "Mimics the clean, focused look of a Notion workspace.",
    previewColor: "#c8d6e5",
    icon: "📝",
    isPremium: true,
  },
];

export default function TemplateGallery() {
  const navigate = useNavigate();
  // In a real app, this would come from your backend user data.
  // We'll set it to false so the Premium lock logic triggers!
  const isUserPremium = false;

  const handleUseTemplate = (tpl) => {
    // If it's a premium template and the user isn't premium, block them.
    if (tpl.isPremium && !isUserPremium) {
      alert("This is a Premium template! Upgrade your account to unlock.");
      return;
    }
    // Otherwise, route them to the builder
    navigate(`/portfolio/builder?template=${tpl.id}`);
  };

  const handlePreview = (tpl) => {
    navigate(`/preview?template=${tpl.id}`);
  };

  return (
    <div className="page-root">
      <Sidebar />
      <main className="page-main page-visible">
        <header className="page-header">
          <div>
            <h1 className="page-title">Template Gallery</h1>
            <p className="page-sub">
              Choose a starting design for your portfolio. (15 Templates
              Available)
            </p>
          </div>
        </header>

        <div
          className="template-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "30px",
            marginTop: "20px",
            paddingBottom: "40px",
          }}
        >
          {AVAILABLE_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="template-card"
              style={{
                background: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                border: tpl.isPremium ? "2px solid #ffd700" : "1px solid #eee",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Premium Badge */}
              {tpl.isPremium && (
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "#ffd700",
                    color: "#000",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    zIndex: 10,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  }}
                >
                  👑 PREMIUM
                </div>
              )}

              <div
                style={{
                  height: "200px",
                  background: `linear-gradient(135deg, ${tpl.previewColor}22, ${tpl.previewColor}66)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "64px",
                }}
              >
                {tpl.icon}
              </div>

              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>
                  {tpl.name}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginBottom: "24px",
                    lineHeight: "1.5",
                    flex: 1,
                  }}
                >
                  {tpl.description}
                </p>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handlePreview(tpl)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#f8f9fa",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "#555",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    👁 Preview
                  </button>
                  <button
                    onClick={() => handleUseTemplate(tpl)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background:
                        tpl.isPremium && !isUserPremium
                          ? "#eee"
                          : tpl.previewColor,
                      color: tpl.isPremium && !isUserPremium ? "#999" : "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {tpl.isPremium && !isUserPremium ? "🔒 Unlock" : "✎ Edit"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
