// src/pages/ForgotPassword.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email },
      );
      setToken(res.data.token);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
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
          <p>Enter your email to get a reset token</p>
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
                  <span className="input-icon">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M2 5l8 6 8-6M2 5h16v12H2z"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
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
                  "Get Reset Token →"
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
              <p style={{ color: "#00c878", fontWeight: 600, marginBottom: 8 }}>
                ✓ Token Generated!
              </p>
              <p style={{ color: "#6b6988", fontSize: 13, marginBottom: 16 }}>
                Your reset token (copy this):
              </p>
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontFamily: "monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#f0eeff",
                  letterSpacing: "0.15em",
                }}
              >
                {token}
              </div>
              <p style={{ color: "#4a4868", fontSize: 11, marginTop: 10 }}>
                In production this would be sent to your email
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
              Use Token to Reset Password →
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
