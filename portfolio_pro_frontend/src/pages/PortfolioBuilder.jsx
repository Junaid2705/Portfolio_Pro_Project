// src/pages/PortfolioBuilder.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // <-- Add useLocation
import {
  getMyPortfolio,
  createPortfolio,
  updatePortfolio,
} from "../api/portfolioApi";
import "./PortfolioBuilder.css";
import Sidebar from "../components/Sidebar";
import API from "../api/axiosConfig";
import PublicPortfolio from "./PublicPortfolio";

const TEMPLATE_OPTIONS = [
  { id: "classic", name: "Classic Professional" },
  { id: "modern", name: "Modern Sidebar" },
  { id: "minimalist", name: "Clean Minimalist" },
  { id: "devdark", name: "Developer Dark" },
  { id: "agency", name: "Creative Agency" },
  { id: "academic", name: "Academic Scholar" },
  { id: "startup", name: "SaaS Startup" },
  { id: "monochrome", name: "Monochrome" },
  { id: "vibrant", name: "Vibrant Gradient" },
  { id: "neobrutalism", name: "Neo-Brutalism" },
  { id: "cards", name: "Card UI" },
  { id: "timeline", name: "Timeline View" },
  { id: "bento", name: "Apple Bento Box 👑" },
  { id: "glassmorphism", name: "Glassmorphism 👑" },
  { id: "notion", name: "Notion Document 👑" },
];

const THEMES = [
  { key: "default", label: "Classic Blue", color: "#4f9eff" },
  { key: "dark", label: "Dark Mode", color: "#8b6fff" },
  { key: "minimal", label: "Clean Minimal", color: "#00c896" },
  { key: "creative", label: "Bold Creative", color: "#ff6b6b" },
];

const SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const STEPS = ["Profile", "Social Links", "Skills", "Theme & URL", "Preview"];

export default function PortfolioBuilder() {
  const [step, setStep] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const selectedTemplate = queryParams.get("template") || "classic";
  const [form, setForm] = useState({
    title: "",
    designation: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    theme: "default",
    template: selectedTemplate,
    publicUrlSlug: "",
    skills: [],
  });

  const [uploadingImg, setUploadingImg] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [newSkill, setNewSkill] = useState({
    skillName: "",
    level: "INTERMEDIATE",
    category: "",
  });

  useEffect(() => {
    loadExisting();
  }, []);
  // Add this function inside your component
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (Max 5MB to match your backend rule)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large! Please pick an image under 5MB.");
        return;
      }

      setUploadingImg(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Send the file to your existing Spring Boot backend
        const res = await API.post("/api/upload/profile-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // The backend returns { imageUrl: "http://localhost:8080/uploads/..." }
        // Save this URL to our local state so the preview updates immediately
        setProfileImageUrl(res.data.imageUrl);
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload image. Make sure your backend is running.");
      } finally {
        setUploadingImg(false);
      }
    }
  };
  const loadExisting = async () => {
    try {
      // Fetch your saved portfolio
      const data = await getMyPortfolio();

      // Check the URL to see if you just clicked a template in the Gallery
      const queryParams = new URLSearchParams(location.search);
      const urlTemplate = queryParams.get("template");

      setProfileImageUrl(data.profileImage || "");
      setIsEdit(true);

      setForm({
        title: data.title || "",
        designation: data.designation || "",
        bio: data.bio || "",
        githubUrl: data.githubUrl || "",
        linkedinUrl: data.linkedinUrl || "",
        websiteUrl: data.websiteUrl || "",
        theme: data.theme || "default",

        // --- THE FIX: Make the URL selection win over the database! ---
        template: urlTemplate || data.template || "classic",

        publicUrlSlug: data.publicUrlSlug || "",
        skills:
          data.skills?.map((s) => ({
            skillName: s.skillName,
            level: s.level,
            category: s.category || "",
          })) || [],
      });
    } catch {
      setIsEdit(false);

      // Even if they don't have a portfolio yet, we still need to catch the template!
      const queryParams = new URLSearchParams(location.search);
      const urlTemplate = queryParams.get("template");
      if (urlTemplate) {
        setForm((prevForm) => ({ ...prevForm, template: urlTemplate }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const addSkill = () => {
    if (!newSkill.skillName.trim()) return;
    setForm({ ...form, skills: [...form.skills, { ...newSkill }] });
    setNewSkill({ skillName: "", level: "INTERMEDIATE", category: "" });
  };

  const removeSkill = (idx) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== idx) });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaveMsg("");
    try {
      if (isEdit) {
        await updatePortfolio(form);
      } else {
        await createPortfolio(form);
        setIsEdit(true);
      }
      setSaveMsg("Saved successfully!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = async () => {
    await handleSave();
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="pb-loading">
        <div className="pb-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="pb-root">
      {/* Top bar */}
      <header className="pb-topbar">
        <button className="pb-back-btn" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
        <div className="pb-topbar-center">
          <span className="pb-logo">
            Portfolio<strong>Pro</strong>
          </span>
          <span className="pb-mode-badge">
            {isEdit ? "Editing" : "Creating"}
          </span>
        </div>
        <button className="pb-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "..." : saveMsg ? "✓ Saved" : "Save Draft"}
        </button>
      </header>

      {/* Step progress */}
      <div className="pb-steps-bar">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`pb-step-dot ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            onClick={() => setStep(i)}
          >
            <div className="pb-dot">{i < step ? "✓" : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
        <div
          className="pb-step-line"
          style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="pb-content">
        {error && <div className="pb-error">⚠ {error}</div>}
        <div className="pb-image-section">
          <div className="pb-image-preview">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="pb-profile-img"
              />
            ) : (
              <div className="pb-profile-placeholder">
                {form.title ? form.title[0].toUpperCase() : "?"}
              </div>
            )}
          </div>
          <div className="pb-image-controls">
            <label className="pb-upload-btn" htmlFor="profile-img-input">
              📷 Upload Photo
            </label>
            <input
              id="profile-img-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={handleImageUpload}
              disabled={uploadingImg}
            />
            <p className="pb-upload-hint">JPG, PNG or WEBP · Max 5MB</p>
          </div>
        </div>
        {/* STEP 0 — Profile */}
        {step === 0 && (
          <div className="pb-panel">
            <div className="pb-panel-header">
              <h2>Your Profile</h2>
              <p>Tell the world who you are</p>
            </div>
            <div className="pb-form-grid">
              <div className="pb-field">
                <label>Portfolio Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. John Doe — Full Stack Developer"
                />
              </div>
              <div className="pb-field">
                <label>Designation / Role</label>
                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                />
              </div>
              <div className="pb-field full">
                <label>Bio / About Me</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Write a short bio about yourself, your experience and what you're passionate about..."
                  rows={5}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 — Social Links */}
        {step === 1 && (
          <div className="pb-panel">
            <div className="pb-panel-header">
              <h2>Social Links</h2>
              <p>Connect your online presence</p>
            </div>
            <div className="pb-form-grid">
              <div className="pb-field">
                <label>GitHub URL</label>
                <div className="pb-input-wrap">
                  <span className="pb-input-prefix">github.com/</span>
                  <input
                    name="githubUrl"
                    value={form.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
              <div className="pb-field">
                <label>LinkedIn URL</label>
                <div className="pb-input-wrap">
                  <span className="pb-input-prefix">in/</span>
                  <input
                    name="linkedinUrl"
                    value={form.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
              <div className="pb-field full">
                <label>Personal Website</label>
                <input
                  name="websiteUrl"
                  value={form.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Skills */}
        {step === 2 && (
          <div className="pb-panel">
            <div className="pb-panel-header">
              <h2>Skills</h2>
              <p>Showcase your technical expertise</p>
            </div>

            {/* Add skill form */}
            <div className="pb-skill-add">
              <input
                className="pb-skill-input"
                placeholder="Skill name (e.g. React)"
                value={newSkill.skillName}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, skillName: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <select
                className="pb-skill-select"
                value={newSkill.level}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, level: e.target.value })
                }
              >
                {SKILL_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <input
                className="pb-skill-input small"
                placeholder="Category (e.g. Frontend)"
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, category: e.target.value })
                }
              />
              <button className="pb-skill-add-btn" onClick={addSkill}>
                + Add
              </button>
            </div>

            {/* Skills list */}
            <div className="pb-skills-list">
              {form.skills.length === 0 && (
                <p className="pb-skills-empty">
                  No skills added yet. Type above and press Add.
                </p>
              )}
              {form.skills.map((s, i) => (
                <div key={i} className="pb-skill-item">
                  <div className="pb-skill-info">
                    <span className="pb-skill-name">{s.skillName}</span>
                    {s.category && (
                      <span className="pb-skill-cat">{s.category}</span>
                    )}
                  </div>
                  <span className={`pb-skill-level ${s.level.toLowerCase()}`}>
                    {s.level}
                  </span>
                  <button
                    className="pb-skill-remove"
                    onClick={() => removeSkill(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Quick add popular skills */}
            <div className="pb-quick-skills">
              <p className="pb-quick-label">Quick add:</p>
              {[
                "React",
                "Java",
                "Spring Boot",
                "MySQL",
                "JavaScript",
                "HTML/CSS",
                "Git",
                "Python",
              ].map((s) => (
                <button
                  key={s}
                  className="pb-quick-skill-btn"
                  onClick={() => {
                    if (!form.skills.find((sk) => sk.skillName === s))
                      setForm((f) => ({
                        ...f,
                        skills: [
                          ...f.skills,
                          { skillName: s, level: "INTERMEDIATE", category: "" },
                        ],
                      }));
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="pb-panel">
            <div className="pb-panel-header">
              <h2>Design, Theme & Public URL</h2>
              <p>Choose your layout, colors, and set your portfolio address</p>
            </div>

            <div className="pb-themes">
              {THEMES.map((t) => (
                <div
                  key={t.key}
                  className={`pb-theme-card ${form.theme === t.key ? "selected" : ""}`}
                  onClick={() => setForm({ ...form, theme: t.key })}
                >
                  <div
                    className="pb-theme-preview"
                    style={{
                      background: `linear-gradient(135deg, ${t.color}22, ${t.color}44)`,
                      borderColor: t.color + "44",
                    }}
                  >
                    <div
                      className="pb-theme-dot"
                      style={{ background: t.color }}
                    />
                    <div className="pb-theme-lines">
                      <div
                        style={{ background: t.color + "66", width: "70%" }}
                      />
                      <div
                        style={{ background: t.color + "44", width: "50%" }}
                      />
                      <div
                        style={{ background: t.color + "33", width: "80%" }}
                      />
                    </div>
                  </div>
                  <div className="pb-theme-info">
                    <span className="pb-theme-name">{t.label}</span>
                    {form.theme === t.key && (
                      <span className="pb-theme-check">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* --- NEW TEMPLATE SELECTOR SECTION --- */}
            <div
              className="pb-templates-section"
              style={{
                marginBottom: "30px",
                marginTop: "10px",
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                🎨 Selected Layout Template
              </label>
              <select
                value={form.template || "classic"}
                onChange={(e) => setForm({ ...form, template: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  backgroundColor: "white",
                }}
              >
                {TEMPLATE_OPTIONS.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </select>
              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                You selected this from the Template Gallery. You can change it
                here at any time!
              </p>
            </div>

            <div className="pb-url-section">
              <label>Public Portfolio URL</label>
              <div className="pb-url-input-wrap">
                <span className="pb-url-prefix">portfoliopro.com/</span>
                <input
                  name="publicUrlSlug"
                  value={form.publicUrlSlug}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      publicUrlSlug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                  placeholder="your-name"
                />
              </div>
              <p className="pb-url-hint">
                Only lowercase letters, numbers and hyphens. This will be your
                public portfolio address.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4 — Preview */}
        {step === 4 && (
          <div className="pb-panel" style={{ padding: 0, overflow: "hidden" }}>
            <div
              className="pb-panel-header"
              style={{ padding: "30px", borderBottom: "1px solid #eee" }}
            >
              <h2>Live Preview & Finish</h2>
              <p>This is exactly how your portfolio will look to visitors.</p>
            </div>

            {/* Embedded Live Template */}
            <div style={{ height: "60vh", overflowY: "auto", background: "#eee" }}>
              <PublicPortfolio 
                previewMode={true}
                mockData={{
                  portfolio: {
                    ...form,  // <--- This pushes your live dropdown choice into the preview!
                    userName: form.title || "Your Name",
                    profileImage: profileImageUrl, 
                    status: "PUBLISHED" 
                  },
                  projects: [] 
                }} 
              />
            </div>

            <div
              style={{
                padding: "30px",
                background: "white",
                borderTop: "1px solid #eee",
              }}
            >
              <button
                className="pb-finish-btn"
                onClick={handleFinish}
                disabled={saving}
                style={{ width: "100%" }}
              >
                {saving
                  ? "Saving..."
                  : isEdit
                    ? "✓ Save & Go to Dashboard"
                    : "🚀 Publish Portfolio"}
              </button>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="pb-nav-btns">
          {step > 0 && (
            <button
              className="pb-nav-btn prev"
              onClick={() => setStep((s) => s - 1)}
            >
              ← Previous
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button
              className="pb-nav-btn next"
              onClick={() => setStep((s) => s + 1)}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
