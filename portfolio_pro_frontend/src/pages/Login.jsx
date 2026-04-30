// src/pages/Login.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, saveAuthData } from "../api/authApi";
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
      r: 200 + Math.random() * 220,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      hue: [258, 220, 190, 280, 245, 265][i],
      alpha: 0.12 + Math.random() * 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach((o) => {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},80%,60%,${o.alpha})`);
        g.addColorStop(1, `hsla(${o.hue},80%,60%,0)`);
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

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(form.email, form.password);
      saveAuthData(data);
      navigate(data.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <AnimatedBg />
      <div className="auth-grid-overlay" />

      <div className={`auth-wrapper ${visible ? "auth-visible" : ""}`}>
        {/* ── Left panel ── */}
        <div className="auth-brand-panel">
          <div className="auth-logo">
            <div className="logo-hex">
              <svg viewBox="0 0 40 46" fill="none">
                <path
                  d="M20 1L38 11.5V34.5L20 45L2 34.5V11.5L20 1Z"
                  stroke="url(#lg1)"
                  strokeWidth="1.5"
                  fill="url(#lgfill)"
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
                  <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="46">
                    <stop offset="0%" stopColor="#8b6fff" />
                    <stop offset="100%" stopColor="#4f9eff" />
                  </linearGradient>
                  <linearGradient id="lgfill" x1="0" y1="0" x2="40" y2="46">
                    <stop offset="0%" stopColor="#8b6fff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4f9eff" stopOpacity="0.1" />
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
              Your career,
              <br />
              <span className="brand-gradient">brilliantly told.</span>
            </h1>
            <p className="brand-sub">
              Build a stunning portfolio without writing a single line of code.
              Stand out. Get hired.
            </p>
            <div className="brand-features">
              {[
                { icon: "⚡", label: "Live in minutes" },
                { icon: "🎨", label: "Beautiful themes" },
                { icon: "📱", label: "Mobile perfect" },
                { icon: "🔒", label: "Secure & private" },
              ].map((f, i) => (
                <div
                  className="brand-feature"
                  key={i}
                  style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                >
                  <span className="feature-icon">{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="brand-stats">
            <div className="bstat">
              <span className="bstat-n">2.4K+</span>
              <span className="bstat-l">Portfolios</span>
            </div>
            <div className="bstat-divider" />
            <div className="bstat">
              <span className="bstat-n">98%</span>
              <span className="bstat-l">Satisfaction</span>
            </div>
            <div className="bstat-divider" />
            <div className="bstat">
              <span className="bstat-n">Free</span>
              <span className="bstat-l">Forever</span>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="auth-form-panel">
          <div className="glass-card">
            <div className="form-header">
              <h2>Welcome back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="form-error">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="field">
                <label htmlFor="email">Email address</label>
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
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">
                  Password
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot?
                  </Link>
                </label>
                <div className="input-wrap">
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
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
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
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <span>Sign in</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="form-divider">
              <span>demo credentials</span>
            </div>

            {/* <div className="demo-box">
              <div className="demo-grid">
                <div>
                  <strong>Admin login</strong>
                  <code>admin@portfoliopro.com</code>
                  <code>Admin@123</code>
                </div>
                <div>
                  <strong>User</strong>
                  <code>Register a new</code>
                  <code>account below</code>
                </div>
              </div>
            </div> */}

            <p className="switch-link">
              Don&apos;t have an account?{" "}
              <Link to="/register">Create one free →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
