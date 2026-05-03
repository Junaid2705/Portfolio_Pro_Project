// src/pages/ForgotPassword.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Hit your new Spring Boot endpoint
      await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email,
      });

      // Store email temporarily so ResetPassword page knows who is resetting
      sessionStorage.setItem("resetEmail", email);

      setDone(true);

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate("/reset-password");
      }, 3000);
    } catch (err) {
      // Temporarily show the REAL error to help us debug
      setError(err.message || "Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-root"
      style={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div
        className="glass-card"
        style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}
      >
        <div className="form-header">
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a 6-digit code</p>
        </div>

        {!done ? (
          <>
            {error && (
              <div className="form-error">
                <span>⚠</span> {error}
              </div>
            )}
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label>Email address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  "Send Reset Code →"
                )}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                background: "rgba(0,200,120,0.1)",
                border: "1px solid rgba(0,200,120,0.25)",
                borderRadius: 14,
                padding: "20px",
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  color: "#00c878",
                  fontWeight: 600,
                  marginBottom: 8,
                  fontSize: 18,
                }}
              >
                ✓ Code Sent!
              </p>
              <p style={{ color: "#c8c6e0", fontSize: 14 }}>
                Check your email inbox (and spam folder) for the 6-digit code.
              </p>
            </div>
            <Link
              to="/reset-password"
              className="submit-btn"
              style={{
                display: "block",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Enter Code →
            </Link>
          </div>
        )}

        <p className="switch-link" style={{ marginTop: 20 }}>
          Remember it? <Link to="/login">Back to Login →</Link>
        </p>
      </div>
    </div>
  );
}
