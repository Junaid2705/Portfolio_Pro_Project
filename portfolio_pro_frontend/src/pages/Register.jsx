// src/pages/Register.jsx
// FIX: After register → success message + countdown → redirect to login

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import "./Auth.css";

function AnimatedBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 180 + Math.random() * 220,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      hue: [200, 260, 230, 270, 210, 250][i],
      alpha: 0.1 + Math.random() * 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach((o) => {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},75%,60%,${o.alpha})`);
        g.addColorStop(1, `hsla(${o.hue},75%,60%,0)`);
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        o.x += o.dx;
        o.y += o.dy;
        if (o.x < -o.r) o.x = W + o.r;
        if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r;
        if (o.y > H + o.r) o.y = -o.r;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return <canvas ref={canvasRef} className="auth-canvas" />;
}

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const S_LABEL = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
const S_COLOR = ["", "#e53935", "#fb8c00", "#f9a825", "#43a047", "#00897b"];

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [registeredName, setRegisteredName] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  // Auto countdown after registration
  useEffect(() => {
    if (!registered) return;
    if (countdown === 0) {
      navigate("/login");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [registered, countdown, navigate]);

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setLoading(true);
    try {
      // Register — but DO NOT save token or redirect to dashboard
      // User must login manually after registration
      await registerUser(form.name, form.email, form.password);
      setRegisteredName(form.name);
      setRegisteredEmail(form.email);
      setRegistered(true);
    } catch (err) {
      const msg =
        err.response?.data?.email ||
        err.response?.data?.error ||
        "Registration failed. Try again.";
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  // ══════════════════════════════════════════
  // SUCCESS SCREEN — shown after registration
  // ══════════════════════════════════════════
  if (registered) {
    return (
      <div className="auth-root">
        <AnimatedBg />
        <div className="auth-grid-overlay" />
        <div className="success-screen">
          <div className="success-card">
            {/* Animated check icon */}
            <div className="success-icon-wrap">
              <svg className="success-svg" viewBox="0 0 80 80" fill="none">
                <circle
                  cx="40"
                  cy="40"
                  r="38"
                  stroke="url(#successGrad)"
                  strokeWidth="2"
                  strokeDasharray="239"
                  strokeDashoffset="0"
                  style={{ animation: "drawCircle 0.8s ease forwards" }}
                />
                <path
                  d="M24 40l12 12 20-24"
                  stroke="url(#successGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="50"
                  strokeDashoffset="50"
                  style={{ animation: "drawCheck 0.5s ease 0.7s forwards" }}
                />
                <defs>
                  <linearGradient
                    id="successGrad"
                    x1="0"
                    y1="0"
                    x2="80"
                    y2="80"
                  >
                    <stop offset="0%" stopColor="#8b6fff" />
                    <stop offset="100%" stopColor="#4f9eff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h2 className="success-title">Account Created! 🎉</h2>
            <p className="success-subtitle">
              Welcome to Portfolio Pro, <strong>{registeredName}</strong>!
            </p>

            {/* Account details */}
            <div className="success-details">
              <div className="success-detail-row">
                <span className="success-detail-label">📧 Email</span>
                <span className="success-detail-value">{registeredEmail}</span>
              </div>
              <div className="success-detail-row">
                <span className="success-detail-label">👤 Role</span>
                <span className="success-detail-value">Portfolio User</span>
              </div>
              <div className="success-detail-row">
                <span className="success-detail-label">✅ Status</span>
                <span
                  className="success-detail-value"
                  style={{ color: "#00c878" }}
                >
                  Active
                </span>
              </div>
            </div>

            {/* What's next */}
            <div className="success-next">
              <p className="success-next-label">What happens next?</p>
              <div className="success-next-steps">
                <div className="success-next-step done">
                  <span>✓</span> Account created
                </div>
                <div className="success-next-step active">
                  <span>→</span> Login with your credentials
                </div>
                <div className="success-next-step">
                  <span>○</span> Build your portfolio
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="success-countdown">
              <div className="countdown-circle">
                <svg viewBox="0 0 50 50">
                  <circle
                    cx="25"
                    cy="25"
                    r="22"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="25"
                    cy="25"
                    r="22"
                    fill="none"
                    stroke="url(#cdGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(countdown / 5) * 138.2} 138.2`}
                    transform="rotate(-90 25 25)"
                    style={{ transition: "stroke-dasharray 0.9s linear" }}
                  />
                  <defs>
                    <linearGradient id="cdGrad" x1="0" y1="0" x2="50" y2="50">
                      <stop offset="0%" stopColor="#8b6fff" />
                      <stop offset="100%" stopColor="#4f9eff" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="countdown-num">{countdown}</span>
              </div>
              <p>
                Redirecting to login in{" "}
                <strong>
                  {countdown} second{countdown !== 1 ? "s" : ""}
                </strong>
              </p>
            </div>

            <button className="submit-btn" onClick={() => navigate("/login")}>
              Go to Login Now →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // REGISTER FORM
  // ══════════════════════════════════════════
  return (
    <div className="auth-root">
      <AnimatedBg />
      <div className="auth-grid-overlay" />

      <div className={`auth-wrapper ${visible ? "auth-visible" : ""}`}>
        <div className="auth-brand-panel">
          <div className="auth-logo">
            <div className="logo-hex">
              <svg viewBox="0 0 40 46" fill="none">
                <path
                  d="M20 1L38 11.5V34.5L20 45L2 34.5V11.5L20 1Z"
                  stroke="url(#lg2)"
                  strokeWidth="1.5"
                  fill="url(#lgfill2)"
                />
                <text
                  x="20"
                  y="28"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="Outfit,sans-serif"
                >
                  PP
                </text>
                <defs>
                  <linearGradient id="lg2" x1="0" y1="0" x2="40" y2="46">
                    <stop offset="0%" stopColor="#4f9eff" />
                    <stop offset="100%" stopColor="#8b6fff" />
                  </linearGradient>
                  <linearGradient id="lgfill2" x1="0" y1="0" x2="40" y2="46">
                    <stop offset="0%" stopColor="#4f9eff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#8b6fff" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">
              Portfolio<span>Pro</span>
            </span>
          </div>

          <div className="brand-content">
            <h1 className="brand-headline">
              Start building
              <br />
              <span className="brand-gradient">your legacy.</span>
            </h1>
            <p className="brand-sub">
              Join thousands of developers and designers showcasing their work
              with Portfolio Pro.
            </p>
            <div className="brand-steps">
              {[
                { n: "01", label: "Create your account" },
                { n: "02", label: "Build your portfolio" },
                { n: "03", label: "Publish & get hired" },
              ].map((s, i) => (
                <div
                  className="brand-step"
                  key={i}
                  style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                >
                  <div className="step-num">{s.n}</div>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="glass-card">
            <div className="form-header">
              <h2>Create account</h2>
              <p>Free forever — no credit card needed</p>
            </div>

            {errors.general && (
              <div className="form-error">
                <span>⚠</span> {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="field">
                <label>Full name</label>
                <div
                  className={`input-wrap ${errors.name ? "input-error" : ""}`}
                >
                  <span className="input-icon">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="10" cy="7" r="3" />
                      <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" />
                    </svg>
                  </span>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <span className="field-err">{errors.name}</span>
                )}
              </div>

              <div className="field">
                <label>Email address</label>
                <div
                  className={`input-wrap ${errors.email ? "input-error" : ""}`}
                >
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
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="field-err">{errors.email}</span>
                )}
              </div>

              <div className="field">
                <label>Password</label>
                <div
                  className={`input-wrap ${errors.password ? "input-error" : ""}`}
                >
                  <span className="input-icon">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="8" width="14" height="10" rx="2" />
                      <path d="M7 8V6a3 3 0 016 0v2" />
                    </svg>
                  </span>
                  <input
                    name="password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPw((p) => !p)}
                    tabIndex={-1}
                  >
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
                {form.password && (
                  <div className="strength-bar">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="strength-seg"
                        style={{
                          background:
                            i <= strength
                              ? S_COLOR[strength]
                              : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                    <span
                      style={{
                        color: S_COLOR[strength],
                        fontSize: 11,
                        minWidth: 64,
                      }}
                    >
                      {S_LABEL[strength]}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <span className="field-err">{errors.password}</span>
                )}
              </div>

              <div className="field">
                <label>Confirm password</label>
                <div
                  className={`input-wrap ${errors.confirm ? "input-error" : ""}`}
                >
                  <span className="input-icon">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M5 10l4 4 6-7" />
                    </svg>
                  </span>
                  <input
                    name="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirm && (
                  <span className="field-err">{errors.confirm}</span>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <span>Create account</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <p className="switch-link" style={{ marginTop: 24 }}>
              Already have an account? <Link to="/login">Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
