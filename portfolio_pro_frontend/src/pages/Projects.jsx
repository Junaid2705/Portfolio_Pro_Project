// src/pages/Projects.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projectApi";
import "./Dashboard.css";
import "./Projects.css";
import Sidebar from '../components/Sidebar'

const EMPTY_FORM = {
  title: "",
  description: "",
  techStack: "",
  imageUrl: "",
  liveLink: "",
  githubLink: "",
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 60);
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getMyProjects();
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Project title is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateProject(editingId, form);
        setProjects(projects.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await createProject(form);
        setProjects([...projects, created]);
      }
      handleCloseForm();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      techStack: project.techStack || "",
      imageUrl: project.imageUrl || "",
      liveLink: project.liveLink || "",
      githubLink: project.githubLink || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete project");
    } finally {
      setDeleting(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const techList = (techStack) =>
    techStack
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) || [];

  return (
    <div className="proj-root">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className={`proj-main ${visible ? "proj-visible" : ""}`}>
        <header className="proj-header">
          <div>
            <h1 className="proj-title">Projects</h1>
            <p className="proj-sub">
              {projects.length} project{projects.length !== 1 ? "s" : ""} added
            </p>
          </div>
          <button
            className="proj-add-btn"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm(EMPTY_FORM);
            }}
          >
            + Add Project
          </button>
        </header>

        {/* Project Form */}
        {showForm && (
          <div className="proj-form-card">
            <div className="proj-form-header">
              <h2>{editingId ? "✏ Edit Project" : "+ New Project"}</h2>
              <button className="proj-close-btn" onClick={handleCloseForm}>
                ✕
              </button>
            </div>

            {error && <div className="proj-error">⚠ {error}</div>}

            <form onSubmit={handleSubmit} className="proj-form">
              <div className="proj-form-grid">
                <div className="proj-field full">
                  <label>Project Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. E-Commerce Platform"
                    required
                  />
                </div>

                <div className="proj-field full">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe what this project does, your role, and key achievements..."
                  />
                </div>

                <div className="proj-field full">
                  <label>Tech Stack</label>
                  <input
                    name="techStack"
                    value={form.techStack}
                    onChange={handleChange}
                    placeholder="React, Spring Boot, MySQL, Docker (comma separated)"
                  />
                  {form.techStack && (
                    <div className="proj-tech-preview">
                      {techList(form.techStack).map((t, i) => (
                        <span key={i} className="proj-tech-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="proj-field">
                  <label>Live Link</label>
                  <input
                    name="liveLink"
                    value={form.liveLink}
                    onChange={handleChange}
                    placeholder="https://yourproject.com"
                  />
                </div>

                <div className="proj-field">
                  <label>GitHub Link</label>
                  <input
                    name="githubLink"
                    value={form.githubLink}
                    onChange={handleChange}
                    placeholder="https://github.com/you/project"
                  />
                </div>

                <div className="proj-field full">
                  <label>
                    Image URL <span className="proj-optional">(optional)</span>
                  </label>
                  <input
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://i.imgur.com/yourimage.png"
                  />
                  {form.imageUrl && (
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      className="proj-img-preview"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>
              </div>

              <div className="proj-form-actions">
                <button
                  type="button"
                  className="proj-cancel-btn"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="proj-submit-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="proj-spinner" />
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Add Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        {loading ? (
          <div className="proj-loading">
            <div className="proj-spinner large" />
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="proj-empty">
            <div className="proj-empty-icon">⬡</div>
            <h2>No projects yet</h2>
            <p>Add your first project to showcase your work.</p>
            <button className="proj-add-btn" onClick={() => setShowForm(true)}>
              + Add First Project
            </button>
          </div>
        ) : (
          <div className="proj-grid">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className="proj-card"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {/* Project image */}
                {project.imageUrl ? (
                  <div className="proj-card-img">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      onError={(e) => {
                        e.target.parentElement.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="proj-card-img-placeholder">
                    <span>⬡</span>
                  </div>
                )}

                <div className="proj-card-body">
                  <h3 className="proj-card-title">{project.title}</h3>
                  {project.description && (
                    <p className="proj-card-desc">{project.description}</p>
                  )}

                  {/* Tech stack */}
                  {project.techStack && (
                    <div className="proj-card-tech">
                      {techList(project.techStack)
                        .slice(0, 5)
                        .map((t, i) => (
                          <span key={i} className="proj-tech-tag small">
                            {t}
                          </span>
                        ))}
                      {techList(project.techStack).length > 5 && (
                        <span className="proj-tech-tag small muted">
                          +{techList(project.techStack).length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="proj-card-links">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="proj-link live"
                      >
                        🔗 Live Demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="proj-link github"
                      >
                        ⌨ GitHub
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="proj-card-actions">
                    <button
                      className="proj-edit-btn"
                      onClick={() => handleEdit(project)}
                    >
                      ✏ Edit
                    </button>
                    <button
                      className="proj-delete-btn"
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting === project.id}
                    >
                      {deleting === project.id ? "..." : "🗑 Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
