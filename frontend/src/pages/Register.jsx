import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShieldCheck, CalendarClock, ActivitySquare } from "lucide-react";

const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  :root {
    --primary: #0d9488;
    --primary-hover: #0f766e;
    --primary-light: #ccfbf1;
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
    position: absolute; inset: 0; opacity: 0.05;
    background-image: radial-gradient(#ffffff 2px, transparent 2px);
    background-size: 30px 30px;
  }

  .logo-wrapper { display: flex; align-items: center; gap: 12px; z-index: 10; }
  .logo-icon { background: var(--primary); padding: 10px; border-radius: 12px; display: flex; }
  .logo-text { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.5px; }

  /* Feature items — middle (unchanged) */
  .brand-middle {
    margin: auto 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    padding-right: 2rem;
  }
  .feature-item { display: flex; align-items: flex-start; gap: 1.25rem; }
  .feature-icon-wrap {
    width: 48px; height: 48px; flex-shrink: 0;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: #5eead4;
  }
  .feature-text h4 { color: white; font-size: 1.05rem; font-weight: 600; margin-bottom: 4px; }
  .feature-text p { color: #cbd5e1; font-size: 0.9rem; line-height: 1.5; }

  /* ── NEW: Bottom section of left panel ── */
  .brand-bottom {
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .brand-bottom-heading {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1.25;
    color: white;
  }
  .brand-bottom-heading span { color: var(--primary); }
  .brand-bottom-sub {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.6;
    max-width: 90%;
  }
  /* Trust badges row */
  .trust-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .trust-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 600;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8;
    letter-spacing: 0.02em;
  }
  .trust-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--primary);
    flex-shrink: 0;
  }
  /* Avatar stack */
  .avatar-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .avatar-stack { display: flex; }
  .avatar-stack-item {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 2px solid #1e293b;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 700; color: white;
    margin-left: -8px;
    flex-shrink: 0;
  }
  .avatar-stack-item:first-child { margin-left: 0; }
  .avatar-row-text { font-size: 0.8rem; color: #64748b; line-height: 1.4; }
  .avatar-row-text strong { color: #94a3b8; }

  /* ────────────────────────── Right Panel ────────────────────────── */
  .auth-form-wrapper {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 2rem; overflow-y: auto;
  }
  .auth-card {
    width: 100%; max-width: 480px; background: white;
    padding: 3rem 2.5rem; border-radius: 24px;
    box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05);
    border: 1px solid var(--border);
  }

  .form-header { margin-bottom: 2rem; }
  .form-header h1 { font-size: 1.8rem; color: var(--text-main); margin-bottom: 0.5rem; letter-spacing: -0.5px; }
  .form-header p { color: var(--text-muted); font-size: 0.95rem; }

  .role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
  .role-card {
    padding: 1rem; border: 2px solid var(--border); border-radius: 16px;
    cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px;
  }
  .role-card.active { border-color: var(--primary); background: var(--primary-light); }
  .role-card-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: white; display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .role-info h4 { font-size: 0.95rem; color: var(--text-main); margin-bottom: 2px; }
  .role-info p { font-size: 0.75rem; color: var(--text-muted); }

  .input-group { margin-bottom: 1.25rem; }
  .input-label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.5rem; }
  .input-wrapper { position: relative; }
  .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
  .input-field {
    width: 100%; padding: 0.875rem 1rem 0.875rem 2.75rem;
    border: 1.5px solid var(--border); border-radius: 12px;
    font-family: inherit; font-size: 0.95rem; color: var(--text-main); transition: all 0.2s ease;
  }
  .input-field:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1); }
  .input-field::placeholder { color: #94a3b8; }
  .input-hint { font-size: 0.75rem; color: #94a3b8; margin-top: 5px; }

  /* ── NEW: Password strength bar ── */
  .pw-strength { margin-top: 8px; }
  .pw-strength-bars {
    display: flex;
    gap: 4px;
    margin-bottom: 4px;
  }
  .pw-bar {
    flex: 1;
    height: 3px;
    border-radius: 99px;
    background: var(--border);
    transition: background 0.3s ease;
  }
  .pw-bar.filled-weak   { background: #ef4444; }
  .pw-bar.filled-fair   { background: #f59e0b; }
  .pw-bar.filled-good   { background: #3b82f6; }
  .pw-bar.filled-strong { background: var(--primary); }
  .pw-strength-label { font-size: 0.72rem; color: #94a3b8; }

  /* ── NEW: Terms row ── */
  .terms-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 0.5rem;
    margin-top: 0.25rem;
  }
  .terms-row input[type="checkbox"] {
    accent-color: var(--primary);
    width: 15px; height: 15px;
    margin-top: 2px;
    cursor: pointer; flex-shrink: 0;
  }
  .terms-text { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }
  .terms-text a { color: var(--primary); text-decoration: none; font-weight: 600; }

  .submit-btn {
    width: 100%; padding: 1rem; background: var(--text-main); color: white;
    border: none; border-radius: 12px; font-size: 1rem; font-weight: 600;
    font-family: inherit; cursor: pointer; transition: all 0.2s ease;
    display: flex; justify-content: center; align-items: center; margin-top: 1.25rem;
  }
  .submit-btn:hover:not(:disabled) { background: #000; transform: translateY(-1px); }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  /* ── NEW: Security note ── */
  .security-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .form-footer { margin-top: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; }
  .form-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }

  .loader { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const IconActivity = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

/* Password strength logic */
function getPasswordStrength(pw) {
  if (!pw) return { level: 0, label: '', cls: '' };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const classes = ['', 'filled-weak', 'filled-fair', 'filled-good', 'filled-strong'];
  return { level: score, label: labels[score], cls: classes[score] };
}

const AVATAR_COLORS = ['#0d9488','#0891b2','#7c3aed','#db2777'];
const AVATAR_INITIALS = ['AS','RK','PM','NS'];

function Register() {
  const [form, setForm]       = useState({ name: "", email: "", password: "", role: "patient" });
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const navigate = useNavigate();

  const strength = getPasswordStrength(form.password);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("Please fill in all fields");
    if (!agreed) return toast.error("Please accept the terms to continue");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      toast.success("Account created! Please sign in.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">

      {/* ── LEFT BRANDING PANEL ── */}
      <div className="auth-brand">
        <div className="brand-pattern" />

        {/* 1. Logo — top */}
        <div className="logo-wrapper">
          <div className="logo-icon"><IconActivity /></div>
          <div className="logo-text">MediCare</div>
        </div>

        {/* 2. Features — middle (unchanged) */}
        <div className="brand-middle">
          <div className="feature-item">
            <div className="feature-icon-wrap"><ShieldCheck size={24} /></div>
            <div className="feature-text">
              <h4>Bank-Grade Security</h4>
              <p>Your medical records are protected with end-to-end 256-bit encryption and HIPAA compliance.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrap"><CalendarClock size={24} /></div>
            <div className="feature-text">
              <h4>Smart Scheduling</h4>
              <p>Book, reschedule, or cancel your clinical visits instantly without making a single phone call.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrap"><ActivitySquare size={24} /></div>
            <div className="feature-text">
              <h4>Centralised Health Data</h4>
              <p>Keep all your lab results, imaging, and doctor prescriptions safely stored in one easy-to-access portal.</p>
            </div>
          </div>
        </div>

        {/* 3. Bottom — was just a big headline, now fully fleshed out */}
        <div className="brand-bottom">
          <div>
            <p className="brand-bottom-heading">
              Join the future of <span>patient care.</span>
            </p>
            <p className="brand-bottom-sub">
              Trusted by patients and physicians across India. Get started in under 2 minutes — no paperwork required.
            </p>
          </div>

          {/* Avatar stack + social proof */}
          <div className="avatar-row">
            <div className="avatar-stack">
              {AVATAR_INITIALS.map((init, i) => (
                <div
                  key={i}
                  className="avatar-stack-item"
                  style={{ background: AVATAR_COLORS[i] }}
                >
                  {init}
                </div>
              ))}
            </div>
            <div className="avatar-row-text">
              <strong>10,000+ members</strong> already on board.<br />
              500+ verified doctors available now.
            </div>
          </div>

          {/* Trust badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <div className="trust-badge-dot"></div>HIPAA Compliant
            </div>
            <div className="trust-badge">
              <div className="trust-badge-dot"></div>SSL Encrypted
            </div>
            <div className="trust-badge">
              <div className="trust-badge-dot"></div>ISO 27001
            </div>
            <div className="trust-badge">
              <div className="trust-badge-dot"></div>Free to Join
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="auth-form-wrapper">
        <div className="auth-card">
          <div className="form-header">
            <h1>Create Account</h1>
            <p>Select your role and set up your credentials below.</p>
          </div>

          {/* Role selector (unchanged) */}
          <div className="role-selector">
            <div className={`role-card ${form.role === 'patient' ? 'active' : ''}`} onClick={() => setForm({...form, role: 'patient'})}>
              <div className="role-card-icon">🧑‍⚕️</div>
              <div className="role-info"><h4>Patient</h4><p>Book & Manage</p></div>
            </div>
            <div className={`role-card ${form.role === 'doctor' ? 'active' : ''}`} onClick={() => setForm({...form, role: 'doctor'})}>
              <div className="role-card-icon">🩺</div>
              <div className="role-info"><h4>Doctor</h4><p>Provide Care</p></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  className="input-field"
                  placeholder={form.role === 'doctor' ? 'Dr. Anjali Sharma' : 'Rahul Verma'}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <p className="input-hint">
                {form.role === 'doctor' ? 'Use your registered medical name as it appears on your certificate.' : 'Enter your full legal name as on your ID.'}
              </p>
            </div>

            {/* Email */}
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
                  placeholder={form.role === 'doctor' ? 'doctor@hospital.com' : 'john@example.com'}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <p className="input-hint">We'll send a verification link to this address.</p>
            </div>

            {/* Password + strength bar */}
            <div className="input-group" style={{ marginBottom: '0.75rem' }}>
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              {/* Password strength indicator */}
              {form.password && (
                <div className="pw-strength">
                  <div className="pw-strength-bars">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`pw-bar ${i <= strength.level ? strength.cls : ''}`}
                      />
                    ))}
                  </div>
                  <p className="pw-strength-label">
                    {strength.label} password
                    {strength.level < 3 && ' — try adding numbers or symbols'}
                  </p>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="terms-row">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
              />
              <label htmlFor="terms" className="terms-text">
                I agree to MediConnect's{' '}
                <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>. I understand my health data is stored securely.
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <div className="loader" /> : "Complete Registration →"}
            </button>
          </form>

          {/* Security note */}
          <div className="security-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Your data is encrypted and never shared without consent.
          </div>

          <div className="form-footer">
            Already registered? <Link to="/">Sign in instead</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;