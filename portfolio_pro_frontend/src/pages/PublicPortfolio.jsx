// src/pages/PublicPortfolio.jsx
// Public portfolio — accessible via /p/:slug by anyone including recruiters

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axiosConfig'
import { sendContactMessage } from '../api/contactApi'
import './PublicPortfolio.css'

export default function PublicPortfolio({ previewMode = false }) {
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const contactRef  = useRef(null)

  const [portfolio, setPortfolio]     = useState(null)
  const [projects, setProjects]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [activeSection, setActiveSection] = useState('about')

  // Contact form
  const [contactForm, setContactForm] = useState({ senderName: '', senderEmail: '', message: '' })
  const [sending, setSending]         = useState(false)
  const [contactMsg, setContactMsg]   = useState('')
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    loadPortfolio()
  }, [slug])

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.4 }
    )
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [portfolio])

  const loadPortfolio = async () => {
    try {
      let data, projectData
      if (previewMode) {
        const res = await API.get('/api/portfolio/my')
        data = res.data
        const pRes = await API.get('/api/projects')
        projectData = pRes.data
      } else {
        const res = await API.get(`/api/portfolio/public/${slug}`)
        data = res.data
        // Public projects endpoint
        try {
          const pRes = await API.get(`/api/portfolio/public/${slug}/projects`)
          projectData = pRes.data
        } catch { projectData = [] }
      }
      setPortfolio(data)
      setProjects(projectData || [])
    } catch {
      setError('Portfolio not found or not published yet.')
    } finally {
      setLoading(false)
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (!contactForm.senderName || !contactForm.senderEmail || !contactForm.message) {
      setContactError('All fields are required')
      return
    }
    setSending(true)
    setContactError('')
    try {
      const portfolioSlug = portfolio.publicUrlSlug || slug
      await sendContactMessage(portfolioSlug, contactForm)
      setContactMsg('Message sent! The portfolio owner will get back to you.')
      setContactForm({ senderName: '', senderEmail: '', message: '' })
    } catch (err) {
      setContactError(err.response?.data?.error || 'Failed to send. Try again.')
    } finally {
      setSending(false)
    }
  }

  const getThemeColors = (theme) => {
    const themes = {
      default:  { primary: '#4f9eff', secondary: '#8b6fff', accent: '#00c8ff' },
      dark:     { primary: '#8b6fff', secondary: '#c084fc', accent: '#a78bff' },
      minimal:  { primary: '#00c896', secondary: '#4f9eff', accent: '#00ffb3' },
      creative: { primary: '#ff6b6b', secondary: '#ffd93d', accent: '#ff9f43' },
    }
    return themes[theme] || themes.default
  }

  if (loading) return (
    <div className="pp-loading">
      <div className="pp-spinner" />
      <p>Loading portfolio...</p>
    </div>
  )

  if (error) return (
    <div className="pp-error-screen">
      <div className="pp-error-card">
        <div className="pp-error-icon">📂</div>
        <h2>Portfolio Not Found</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Go Home</button>
      </div>
    </div>
  )

  const colors = getThemeColors(portfolio.theme)
  const initials = (portfolio.userName || 'U').split(' ')
    .map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const skillsByCategory = portfolio.skills?.reduce((acc, skill) => {
    const cat = skill.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {}) || {}

  const techList = (str) => str?.split(',').map(t => t.trim()).filter(Boolean) || []

  const navLinks = [
    { id: 'about',    label: 'About' },
    { id: 'skills',   label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact',  label: 'Contact' },
  ]

  return (
    <div className="pp-root" style={{
      '--pp-primary':   colors.primary,
      '--pp-secondary': colors.secondary,
      '--pp-accent':    colors.accent,
    }}>

      {/* Preview Banner */}
      {previewMode && (
        <div className="pp-preview-banner">
          <span>👁 Preview Mode — This is how recruiters see your portfolio</span>
          <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        </div>
      )}

      {/* Navbar */}
      <nav className={`pp-nav ${previewMode ? 'has-banner' : ''}`}>
        <div className="pp-nav-brand">
          {portfolio.title || portfolio.userName}
        </div>
        <div className="pp-nav-links">
          {navLinks.map(link => (
            <button key={link.id}
              className={`pp-nav-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })}>
              {link.label}
            </button>
          ))}
          {portfolio.githubUrl && (
            <a href={portfolio.githubUrl} target="_blank" rel="noreferrer"
              className="pp-nav-cta">GitHub ↗</a>
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
              {portfolio.profileImage
                ? <img src={portfolio.profileImage} alt={portfolio.userName} className="pp-avatar-img" />
                : <div className="pp-avatar-initials">{initials}</div>
              }
            </div>
            {portfolio.status === 'PUBLISHED' && (
              <div className="pp-available">✦ Open to opportunities</div>
            )}
          </div>

          <div className="pp-hero-right">
            <p className="pp-hello">Hello, I'm</p>
            <h1 className="pp-name">{portfolio.userName}</h1>
            <h2 className="pp-role">{portfolio.designation || 'Developer'}</h2>
            <p className="pp-bio">{portfolio.bio}</p>

            <div className="pp-cta-row">
              <button className="pp-cta-primary"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Get In Touch
              </button>
              {portfolio.githubUrl && (
                <a href={portfolio.githubUrl} target="_blank" rel="noreferrer" className="pp-cta-outline">
                  GitHub ↗
                </a>
              )}
              {portfolio.linkedinUrl && (
                <a href={portfolio.linkedinUrl} target="_blank" rel="noreferrer" className="pp-cta-outline">
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pp-scroll-hint">
          <div className="pp-scroll-mouse"><div className="pp-scroll-wheel" /></div>
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
                        <span className="pp-skill-chip-name">{skill.skillName}</span>
                        <span className={`pp-skill-chip-level level-${skill.level?.toLowerCase()}`}>
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
                <div key={project.id} className="pp-project-card"
                  style={{ animationDelay: `${i * 0.1}s` }}>

                  {project.imageUrl ? (
                    <div className="pp-project-img">
                      <img src={project.imageUrl} alt={project.title}
                        onError={e => { e.target.parentElement.style.display = 'none' }} />
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
                        {techList(project.techStack).slice(0, 5).map((t, ti) => (
                          <span key={ti} className="pp-tech-tag">{t}</span>
                        ))}
                      </div>
                    )}

                    <div className="pp-project-links">
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noreferrer"
                          className="pp-project-link live">
                          🔗 Live Demo
                        </a>
                      )}
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noreferrer"
                          className="pp-project-link github">
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
          <p className="pp-section-desc">Have a project or opportunity? I'd love to hear from you.</p>

          <div className="pp-contact-layout">
            {/* Info */}
            <div className="pp-contact-info">
              <div className="pp-contact-links">
                {portfolio.linkedinUrl && (
                  <a href={portfolio.linkedinUrl} target="_blank" rel="noreferrer"
                    className="pp-contact-link-card">
                    <span className="pp-contact-link-icon">💼</span>
                    <div>
                      <strong>LinkedIn</strong>
                      <span>Connect with me</span>
                    </div>
                    <span className="pp-contact-link-arrow">↗</span>
                  </a>
                )}
                {portfolio.githubUrl && (
                  <a href={portfolio.githubUrl} target="_blank" rel="noreferrer"
                    className="pp-contact-link-card">
                    <span className="pp-contact-link-icon">⌨</span>
                    <div>
                      <strong>GitHub</strong>
                      <span>See my code</span>
                    </div>
                    <span className="pp-contact-link-arrow">↗</span>
                  </a>
                )}
                {portfolio.websiteUrl && (
                  <a href={portfolio.websiteUrl} target="_blank" rel="noreferrer"
                    className="pp-contact-link-card">
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
                  <button onClick={() => setContactMsg('')}>Send Another</button>
                </div>
              ) : (
                <form className="pp-contact-form" onSubmit={handleContactSubmit} noValidate>
                  <h3 className="pp-form-title">Send a Message</h3>

                  {contactError && (
                    <div className="pp-form-error">⚠ {contactError}</div>
                  )}

                  <div className="pp-form-row">
                    <div className="pp-form-field">
                      <label>Your Name</label>
                      <input type="text" placeholder="John Doe"
                        value={contactForm.senderName}
                        onChange={e => setContactForm({ ...contactForm, senderName: e.target.value })}/>
                    </div>
                    <div className="pp-form-field">
                      <label>Your Email</label>
                      <input type="email" placeholder="john@example.com"
                        value={contactForm.senderEmail}
                        onChange={e => setContactForm({ ...contactForm, senderEmail: e.target.value })}/>
                    </div>
                  </div>

                  <div className="pp-form-field">
                    <label>Message</label>
                    <textarea rows={5}
                      placeholder="Tell me about your project or opportunity..."
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })} />
                  </div>

                  <button type="submit" className="pp-form-submit" disabled={sending}>
                    {sending ? <span className="pp-form-spinner" /> : 'Send Message →'}
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
  )
}
