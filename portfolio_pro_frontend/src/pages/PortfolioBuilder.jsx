// src/pages/PortfolioBuilder.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyPortfolio, createPortfolio, updatePortfolio } from '../api/portfolioApi'
import './PortfolioBuilder.css'

const THEMES = [
  { key: 'default',  label: 'Classic Blue',   color: '#4f9eff' },
  { key: 'dark',     label: 'Dark Mode',       color: '#8b6fff' },
  { key: 'minimal',  label: 'Clean Minimal',   color: '#00c896' },
  { key: 'creative', label: 'Bold Creative',   color: '#ff6b6b' },
]

const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']

const STEPS = ['Profile', 'Social Links', 'Skills', 'Theme & URL', 'Preview']

export default function PortfolioBuilder() {
  const [step, setStep]           = useState(0)
  const [isEdit, setIsEdit]       = useState(false)
  const [saving, setSaving]       = useState(false)
  const [loading, setLoading]     = useState(true)
  const [saveMsg, setSaveMsg]     = useState('')
  const [error, setError]         = useState('')
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title:         '',
    designation:   '',
    bio:           '',
    githubUrl:     '',
    linkedinUrl:   '',
    websiteUrl:    '',
    theme:         'default',
    publicUrlSlug: '',
    skills:        [],
  })

  const [newSkill, setNewSkill] = useState({ skillName: '', level: 'INTERMEDIATE', category: '' })

  useEffect(() => {
    loadExisting()
  }, [])

  const loadExisting = async () => {
    try {
      const data = await getMyPortfolio()
      setIsEdit(true)
      setForm({
        title:         data.title         || '',
        designation:   data.designation   || '',
        bio:           data.bio           || '',
        githubUrl:     data.githubUrl     || '',
        linkedinUrl:   data.linkedinUrl   || '',
        websiteUrl:    data.websiteUrl    || '',
        theme:         data.theme         || 'default',
        publicUrlSlug: data.publicUrlSlug || '',
        skills:        data.skills?.map(s => ({
          skillName: s.skillName,
          level:     s.level,
          category:  s.category || '',
        })) || [],
      })
    } catch {
      setIsEdit(false)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const addSkill = () => {
    if (!newSkill.skillName.trim()) return
    setForm({ ...form, skills: [...form.skills, { ...newSkill }] })
    setNewSkill({ skillName: '', level: 'INTERMEDIATE', category: '' })
  }

  const removeSkill = (idx) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== idx) })
  }

  const handleSave = async () => {
    setSaving(true); setError(''); setSaveMsg('')
    try {
      if (isEdit) {
        await updatePortfolio(form)
      } else {
        await createPortfolio(form)
        setIsEdit(true)
      }
      setSaveMsg('Saved successfully!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleFinish = async () => {
    await handleSave()
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="pb-loading">
        <div className="pb-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="pb-root">

      {/* Top bar */}
      <header className="pb-topbar">
        <button className="pb-back-btn" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
        <div className="pb-topbar-center">
          <span className="pb-logo">Portfolio<strong>Pro</strong></span>
          <span className="pb-mode-badge">{isEdit ? 'Editing' : 'Creating'}</span>
        </div>
        <button className="pb-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? '...' : saveMsg ? '✓ Saved' : 'Save Draft'}
        </button>
      </header>

      {/* Step progress */}
      <div className="pb-steps-bar">
        {STEPS.map((s, i) => (
          <div key={i} className={`pb-step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            onClick={() => setStep(i)}>
            <div className="pb-dot">{i < step ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
        <div className="pb-step-line" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
      </div>

      {/* Content */}
      <div className="pb-content">
        {error && <div className="pb-error">⚠ {error}</div>}

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
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. John Doe — Full Stack Developer" />
              </div>
              <div className="pb-field">
                <label>Designation / Role</label>
                <input name="designation" value={form.designation} onChange={handleChange}
                  placeholder="e.g. Full Stack Developer" />
              </div>
              <div className="pb-field full">
                <label>Bio / About Me</label>
                <textarea name="bio" value={form.bio} onChange={handleChange}
                  placeholder="Write a short bio about yourself, your experience and what you're passionate about..."
                  rows={5} />
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
                  <input name="githubUrl" value={form.githubUrl} onChange={handleChange}
                    placeholder="https://github.com/yourusername" />
                </div>
              </div>
              <div className="pb-field">
                <label>LinkedIn URL</label>
                <div className="pb-input-wrap">
                  <span className="pb-input-prefix">in/</span>
                  <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile" />
                </div>
              </div>
              <div className="pb-field full">
                <label>Personal Website</label>
                <input name="websiteUrl" value={form.websiteUrl} onChange={handleChange}
                  placeholder="https://yourwebsite.com" />
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
                onChange={e => setNewSkill({ ...newSkill, skillName: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
              />
              <select className="pb-skill-select"
                value={newSkill.level}
                onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}>
                {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <input
                className="pb-skill-input small"
                placeholder="Category (e.g. Frontend)"
                value={newSkill.category}
                onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
              />
              <button className="pb-skill-add-btn" onClick={addSkill}>+ Add</button>
            </div>

            {/* Skills list */}
            <div className="pb-skills-list">
              {form.skills.length === 0 && (
                <p className="pb-skills-empty">No skills added yet. Type above and press Add.</p>
              )}
              {form.skills.map((s, i) => (
                <div key={i} className="pb-skill-item">
                  <div className="pb-skill-info">
                    <span className="pb-skill-name">{s.skillName}</span>
                    {s.category && <span className="pb-skill-cat">{s.category}</span>}
                  </div>
                  <span className={`pb-skill-level ${s.level.toLowerCase()}`}>{s.level}</span>
                  <button className="pb-skill-remove" onClick={() => removeSkill(i)}>✕</button>
                </div>
              ))}
            </div>

            {/* Quick add popular skills */}
            <div className="pb-quick-skills">
              <p className="pb-quick-label">Quick add:</p>
              {['React', 'Java', 'Spring Boot', 'MySQL', 'JavaScript', 'HTML/CSS', 'Git', 'Python'].map(s => (
                <button key={s} className="pb-quick-skill-btn"
                  onClick={() => {
                    if (!form.skills.find(sk => sk.skillName === s))
                      setForm(f => ({ ...f, skills: [...f.skills, { skillName: s, level: 'INTERMEDIATE', category: '' }] }))
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 — Theme & URL */}
        {step === 3 && (
          <div className="pb-panel">
            <div className="pb-panel-header">
              <h2>Theme & Public URL</h2>
              <p>Choose your style and set your portfolio address</p>
            </div>

            <div className="pb-themes">
              {THEMES.map(t => (
                <div key={t.key}
                  className={`pb-theme-card ${form.theme === t.key ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, theme: t.key })}>
                  <div className="pb-theme-preview" style={{ background: `linear-gradient(135deg, ${t.color}22, ${t.color}44)`, borderColor: t.color + '44' }}>
                    <div className="pb-theme-dot" style={{ background: t.color }} />
                    <div className="pb-theme-lines">
                      <div style={{ background: t.color + '66', width: '70%' }} />
                      <div style={{ background: t.color + '44', width: '50%' }} />
                      <div style={{ background: t.color + '33', width: '80%' }} />
                    </div>
                  </div>
                  <div className="pb-theme-info">
                    <span className="pb-theme-name">{t.label}</span>
                    {form.theme === t.key && <span className="pb-theme-check">✓</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="pb-url-section">
              <label>Public Portfolio URL</label>
              <div className="pb-url-input-wrap">
                <span className="pb-url-prefix">portfoliopro.com/</span>
                <input
                  name="publicUrlSlug"
                  value={form.publicUrlSlug}
                  onChange={e => setForm({ ...form, publicUrlSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  placeholder="your-name"
                />
              </div>
              <p className="pb-url-hint">Only lowercase letters, numbers and hyphens. This will be your public portfolio address.</p>
            </div>
          </div>
        )}

        {/* STEP 4 — Preview */}
        {step === 4 && (
          <div className="pb-panel">
            <div className="pb-panel-header">
              <h2>Preview & Finish</h2>
              <p>Review your portfolio before publishing</p>
            </div>
            <div className="pb-preview-card">
              <div className="pb-preview-header">
                <div className="pb-preview-avatar">
                  {(form.title || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h3>{form.title || 'Your Name'}</h3>
                  <p>{form.designation || 'Your Role'}</p>
                </div>
              </div>
              <p className="pb-preview-bio">{form.bio || 'Your bio will appear here.'}</p>
              {form.skills.length > 0 && (
                <div className="pb-preview-skills">
                  {form.skills.map((s, i) => (
                    <span key={i} className="db-skill-tag">{s.skillName}</span>
                  ))}
                </div>
              )}
              {form.publicUrlSlug && (
                <div className="pb-preview-url">
                  🔗 portfoliopro.com/<strong>{form.publicUrlSlug}</strong>
                </div>
              )}
              <div className="pb-preview-theme">
                Theme: <strong>{THEMES.find(t => t.key === form.theme)?.label}</strong>
              </div>
            </div>

            <button className="pb-finish-btn" onClick={handleFinish} disabled={saving}>
              {saving ? 'Saving...' : isEdit ? '✓ Save & Go to Dashboard' : '🚀 Create Portfolio'}
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="pb-nav-btns">
          {step > 0 && (
            <button className="pb-nav-btn prev" onClick={() => setStep(s => s - 1)}>
              ← Previous
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button className="pb-nav-btn next" onClick={() => setStep(s => s + 1)}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
