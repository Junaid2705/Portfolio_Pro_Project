// src/pages/ResetPassword.jsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

export default function ResetPassword() {
  const [form, setForm]       = useState({ token: '', newPassword: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.token.trim())           { setError('Token is required'); return }
    if (form.newPassword.length < 6)  { setError('Password must be at least 6 characters'); return }
    if (form.newPassword !== form.confirm) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', {
        token:       form.token.trim().toUpperCase(),
        newPassword: form.newPassword
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ color: '#f0eeff', marginBottom: 8 }}>Password Reset!</h2>
            <p style={{ color: '#6b6988', marginBottom: 20 }}>
              Your password has been changed. Redirecting to login...
            </p>
            <Link to="/login" className="submit-btn"
              style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
              Go to Login →
            </Link>
          </div>
        ) : (
          <>
            <div className="form-header">
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔑</div>
              <h2>Reset Password</h2>
              <p>Enter your token and new password</p>
            </div>

            {error && <div className="form-error"><span>⚠</span> {error}</div>}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label>Reset Token</label>
                <div className="input-wrap">
                  <span className="input-icon" style={{ fontSize: 16 }}>🔑</span>
                  <input name="token" type="text" value={form.token}
                    onChange={handleChange}
                    placeholder="Enter your 8-character token"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                </div>
              </div>

              <div className="field">
                <label>New Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="8" width="14" height="10" rx="2"/>
                      <path d="M7 8V6a3 3 0 016 0v2"/>
                    </svg>
                  </span>
                  <input name="newPassword" type={showPw ? 'text' : 'password'}
                    value={form.newPassword} onChange={handleChange}
                    placeholder="Minimum 6 characters" />
                  <button type="button" className="pw-toggle"
                    onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="field">
                <label>Confirm New Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 10l4 4 6-7"/>
                    </svg>
                  </span>
                  <input name="confirm" type="password" value={form.confirm}
                    onChange={handleChange} placeholder="Repeat new password" />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : 'Reset Password →'}
              </button>
            </form>

            <p className="switch-link" style={{ marginTop: 20 }}>
              <Link to="/forgot-password">← Get a new token</Link>
              {' · '}
              <Link to="/login">Back to Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
