import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import "./Auth.css";

function BrandMark() {
  return (
    <svg className="auth-brand-mark" viewBox="0 0 64 38" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M3 19C8 7 18 7 26 19s18 12 23 0c5-12 14-12 18 0"/>
      <path d="M3 19c5 12 15 12 23 0S44 7 49 19c5 12 14 12 18 0"/>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await authService.login({ email, password });
      localStorage.setItem("cc-auth-popup-dismissed", "true");
      navigate("/");
    } catch (issue) {
      setError(issue.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* Left intro */}
      <section className="auth-intro">
        <Link to="/" className="auth-brand">
          <BrandMark />
          career<em>copilot</em>
        </Link>
        <span className="eyebrow">Your future, your way</span>
        <h1>Every great journey<br />starts with a <em>hello.</em></h1>
        <p>Explore what excites you, at your own pace. Nova is ready whenever you are.</p>
        <span className="auth-trust">A judgment-free space for curious minds</span>
      </section>

      {/* Right form */}
      <section className="auth-form-side">
        <div className="auth-box">
          <span className="auth-kicker">Welcome back</span>
          <h2>Continue your journey</h2>
          <p className="auth-subtitle">Pick up right where you left off.</p>
          <form onSubmit={submit}>
            <label>
              Email address
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter your password" required />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="primary-auth" disabled={loading} type="submit">
              {loading ? "Signing in…" : "Continue"}
            </button>
          </form>
          <p className="auth-switch">New here? <Link to="/signup">Create your free account</Link></p>
        </div>
      </section>
    </div>
  );
}
