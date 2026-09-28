import { useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import { Mark, Icon } from "../components/Icons";

/* ── Data ── */
const NAV = [
  ["Careers",       "/careers"],
  ["Resume Studio", "/resumes"],
  ["Opportunities", "/jobs"],
  ["Ask Nova",      "/nova"],
];

const AVATAR_COLORS = ["#5B6BF8","#8B5CF6","#3B82F6","#06B6D4","#10B981"];
const AVATAR_LETTERS = ["A","R","S","M","P"];

const PARTNERS = [
  { name: "Internshala", Icon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  )},
  { name: "LinkedIn", Icon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="2" y="2" width="20" height="20" rx="4"/>
      <path d="M7 10v7M7 7v.01M12 10v7M12 13a3 3 0 0 1 6 0v4"/>
    </svg>
  )},
  { name: "Unstop", Icon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )},
  { name: "Naukri", Icon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )},
];

const STATS = [
  { label: "Active Students",  value: "+10K",      sub: "Across India" },
  { label: "Careers Explored", value: "Real-time", sub: "Total career paths" },
  { label: "Student Trust",    value: "99%",       sub: "Guidance you can rely on" },
];

/* ── Component ── */
export default function Dashboard() {
  const [showAuth, setShowAuth] = useState(
    () => localStorage.getItem("cc-auth-popup-dismissed") !== "true"
  );
  const [authMode, setAuthMode] = useState("signup");

  const dismiss = () => {
    localStorage.setItem("cc-auth-popup-dismissed", "true");
    setShowAuth(false);
  };
  const openAuth = (mode) => { setAuthMode(mode); setShowAuth(true); };

  return (
    <div className="landing">

      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <Link to="/" className="nav-logo">
          <Mark small />
          <span>career<span>copilot</span></span>
        </Link>

        <div className="nav-center">
          {NAV.map(([name, path]) => (
            <Link key={name} to={path}>{name}</Link>
          ))}
        </div>

        <div className="nav-right">
          <button className="btn-ghost" onClick={() => openAuth("login")}>Sign in</button>
          <button className="btn-pill"  onClick={() => openAuth("signup")}>Get Started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="hero-section">

        {/* Background orb layers */}
        <div className="orb-wrap" aria-hidden="true">
          <div className="orb-glow-top" />
          <div className="orb-outer-ring" />
          <div className="orb-mid-ring" />
          <div className="orb">
            <div className="orb-bottom-light" />
          </div>
          <div className="streak left" />
          <div className="streak right" />
        </div>

        {/* Content */}
        <div className="hero-content">
          <div className="pill-badge">
            <span className="pill-dot" />
            Career Intelligence, Simplified
          </div>

          <h1>
            Your career clarity,<br />
            built <em>for your future.</em>
          </h1>

          <p className="hero-sub">
            One place to explore careers, understand the path ahead,
            and prepare for opportunities that fit your ambitions.
          </p>

          <div className="social-proof">
            <div className="avatars">
              {AVATAR_LETTERS.map((l, i) => (
                <span key={i} style={{ background: AVATAR_COLORS[i] }}>{l}</span>
              ))}
            </div>
            <span className="social-text">
              Trusted already by <b>10,000+</b> students
            </span>
          </div>

          <div className="hero-cta">
            <Link to="/careers" className="cta-primary">
              Start Exploring <Icon type="arrow" />
            </Link>
            <Link to="/simulator" className="cta-secondary">
              Explore The Platform
            </Link>
          </div>
        </div>
      </main>

      {/* ── Logos bar ── */}
      <section className="logos-bar" aria-label="Featured platforms">
        {PARTNERS.map(({ name, Icon: PIcon }) => (
          <div key={name} className="logo-item">
            <span className="logo-icon"><PIcon /></span>
            <span>{name}</span>
          </div>
        ))}
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="stats-bar">
          {STATS.map(({ label, value, sub }) => (
            <div key={label} className="stat-card">
              <span className="stat-label">{label}</span>
              <span className="stat-value">{value}</span>
              <span className="stat-sub">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Auth modal ── */}
      {showAuth && (
        <div className="auth-overlay-v2" role="dialog" aria-modal="true">
          <div className="auth-modal-v2">
            <button className="modal-x" onClick={dismiss} aria-label="Close">
              <Icon type="close" />
            </button>

            <div className="modal-mark"><Mark /></div>
            <span className="eyebrow-v2">WELCOME TO CAREERCOPILOT</span>

            <h2>{authMode === "login" ? "Welcome back." : "Your future has a starting point."}</h2>
            <p>
              {authMode === "login"
                ? "Sign in to continue your career journey."
                : "Create an account to save your discoveries, paths, and career progress."}
            </p>

            <div className="mode-switch">
              <button onClick={() => setAuthMode("signup")} className={authMode === "signup" ? "on" : ""}>
                Create account
              </button>
              <button onClick={() => setAuthMode("login")} className={authMode === "login" ? "on" : ""}>
                Sign in
              </button>
            </div>

            <Link className="modal-cta" to={authMode === "login" ? "/login" : "/signup"}>
              {authMode === "login" ? "Sign in" : "Create free account"} <Icon type="arrow" />
            </Link>
            <button className="skip-button" onClick={dismiss}>Continue exploring</button>
          </div>
        </div>
      )}

    </div>
  );
}
