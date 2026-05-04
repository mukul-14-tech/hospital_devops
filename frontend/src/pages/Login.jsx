import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  :root {
    --primary: #0d9488;
    --primary-hover: #0f766e;
    --bg-light: #f8fafc;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --font-main: 'Plus Jakarta Sans', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-layout {
    display: flex;
    min-height: 100vh;
    font-family: var(--font-main);
    background: var(--bg-light);
  }

  /* Left Branding Panel */
  .auth-brand {
    display: none;
    width: 45%;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    position: relative;
    overflow: hidden;
    padding: 3rem;
    flex-direction: column;
    justify-content: space-between;
    color: white;
  }
  @media (min-width: 1024px) { .auth-brand { display: flex; } }

  .brand-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    background-image: radial-gradient(#ffffff 2px, transparent 2px);
    background-size: 30px 30px;
  }

  .brand-glow {
    position: absolute;
    top: -20%; left: -10%;
    width: 60%; height: 60%;
    background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
    opacity: 0.15;
    filter: blur(60px);
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10;
  }
  .logo-icon {
    background: var(--primary);
    padding: 10px;
    border-radius: 12px;
    display: flex;
  }
  .logo-text { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.5px; }

  .brand-content { z-index: 10; }
  .brand-title {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    letter-spacing: -1px;
  }
  .brand-title span { color: var(--primary); }
  .brand-desc {
    font-size: 1.125rem;
    color: #cbd5e1;
    line-height: 1.6;
    max-width: 85%;
  }

  /* ── NEW: Stats bar ── */
  .brand-stats {
    display: flex;
    gap: 0;
    z-index: 10;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .stat-item {
    flex: 1;
    padding: 1.1rem 1rem;
    background: rgba(255,255,255,0.04);
    text-align: center;
    border-right: 1px solid rgba(255,255,255,0.08);
  }
  .stat-item:last-child { border-right: none; }
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.5px;
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-value span { color: var(--primary); }
  .stat-label {
    font-size: 0.72rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  /* ── NEW: Testimonial card ── */
  .testimonial-card {
    z-index: 10;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1.5rem;
  }
  .testimonial-stars {
    display: flex;
    gap: 3px;
    margin-bottom: 0.75rem;
  }
  .testimonial-quote {
    font-size: 0.95rem;
    color: #cbd5e1;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-style: italic;
  }
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .testimonial-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), #0891b2);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 700; color: white;
    flex-shrink: 0;
  }
  .testimonial-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    line-height: 1.2;
  }
  .testimonial-role {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 1px;
  }
  .testimonial-badge {
    margin-left: auto;
    background: rgba(13,148,136,0.15);
    border: 1px solid rgba(13,148,136,0.25);
    color: #5eead4;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 99px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* Right Form Panel */
  .auth-form-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .auth-card {
    width: 100%;
    max-width: 440px;
    background: white;
    padding: 3rem 2.5rem;
    border-radius: 24px;
    box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05);
    border: 1px solid var(--border);
  }

  .mobile-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; }
  @media (min-width: 1024px) { .mobile-logo { display: none; } }

  .form-header { margin-bottom: 2.5rem; }
  .form-header h1 { font-size: 2rem; color: var(--text-main); margin-bottom: 0.5rem; letter-spacing: -0.5px; }
  .form-header p { color: var(--text-muted); font-size: 1rem; }

  .input-group { margin-bottom: 1.5rem; }
  .input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 0.5rem;
  }
  .input-wrapper { position: relative; }
  .input-icon {
    position: absolute;
    left: 1rem; top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }
  .input-field {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 2.75rem;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-family: inherit;
    font-size: 1rem;
    color: var(--text-main);
    transition: all 0.2s ease;
  }
  .input-field:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1);
  }
  .input-field::placeholder { color: #94a3b8; }

  /* ── NEW: Remember me checkbox row ── */
  .form-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .remember-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: var(--text-muted);
    cursor: pointer;
    user-select: none;
  }
  .remember-label input[type="checkbox"] {
    accent-color: var(--primary);
    width: 15px; height: 15px;
    cursor: pointer;
  }

  /* ── NEW: Divider ── */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 1.5rem 0;
    color: var(--text-muted);
    font-size: 0.8rem;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── NEW: Quick access chips ── */
  .quick-access {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 0.25rem;
  }
  .quick-chip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0.65rem 1rem;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-main);
    background: white;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
  }
  .quick-chip:hover { border-color: var(--primary); color: var(--primary); background: #f0fdfa; }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex; justify-content: center; align-items: center; gap: 8px;
    margin-top: 1rem;
  }
  .submit-btn:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  /* ── NEW: Security note ── */
  .security-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 1.25rem;
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .form-footer { margin-top: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; }
  .form-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
  .form-footer a:hover { text-decoration: underline; }

  .loader {
    width: 20px; height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const IconActivity = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const IconActivityDark = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please fill in all fields");
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">

      {/* ── LEFT BRANDING PANEL ── */}
      <div className="auth-brand">
        <div className="brand-pattern" />
        <div className="brand-glow" />

        {/* 1. Logo — top */}
        <div className="logo-wrapper">
          <div className="logo-icon"><IconActivity /></div>
          <div className="logo-text">MediCare</div>
        </div>

        {/* 2. Headline — middle */}
        <div className="brand-content">
          <h1 className="brand-title">Healthcare,<br /><span>simplified.</span></h1>
          <p className="brand-desc">
            Access your secure portal to manage appointments, view vital medical records,
            and stay connected with your care team — all in one place.
          </p>
        </div>

        {/* 3. Bottom section — stats + testimonial (was EMPTY) */}
        <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Stats bar */}
          <div className="brand-stats">
            <div className="stat-item">
              <div className="stat-value">10<span>K+</span></div>
              <div className="stat-label">Patients</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">500<span>+</span></div>
              <div className="stat-label">Doctors</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">4.9<span>★</span></div>
              <div className="stat-label">Avg. Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">24<span>/7</span></div>
              <div className="stat-label">Support</div>
            </div>
          </div>

          {/* Testimonial card */}
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
            </div>
            <p className="testimonial-quote">
              "Booking my follow-up appointments used to take hours on the phone.
              With MediConnect I do it in seconds, and my prescriptions are always right there."
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">PR</div>
              <div>
                <div className="testimonial-name">Priya Rajan</div>
                <div className="testimonial-role">Cardiology Patient · Mumbai</div>
              </div>
              <div className="testimonial-badge">Verified</div>
            </div>
          </div>

        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="auth-form-wrapper">
        <div className="auth-card">

          {/* Mobile logo */}
          <div className="mobile-logo">
            <IconActivityDark />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>MediCare</span>
          </div>

          <div className="form-header">
            <h1>Welcome back</h1>
            <p>Please enter your details to sign in.</p>
          </div>

          {/* Quick access (role-hint chips) */}
          <div className="quick-access">
            <button
              type="button"
              className="quick-chip"
              onClick={() => setForm({ email: '', password: '' })}
            >
              🧑‍⚕️ Patient 
            </button>
            <button
              type="button"
              className="quick-chip"
              onClick={() => setForm({ email: '', password: '' })}
            >
              🩺 Doctor 
            </button>
          </div>

          <div className="divider">or sign in with your account</div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  className="input-field"
                  placeholder="doctor@hospital.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label" style={{ margin: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                  Forgot password?
                </a>
              </div>
              <div className="input-wrapper" style={{ marginTop: '0.5rem' }}>
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="form-options">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Keep me signed in
              </label>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>For 30 days</span>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <div className="loader" /> : "Sign In →"}
            </button>
          </form>

          {/* Security note */}
          <div className="security-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            256-bit SSL encrypted · HIPAA compliant
          </div>

          <div className="form-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;