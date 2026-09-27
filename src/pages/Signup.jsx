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

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await authService.signup({ name, email, password });
      localStorage.setItem("cc-profile", JSON.stringify(user.profile));
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
        <h1>Let curiosity<br />lead the <em>way.</em></h1>
        <p>There's no test to pass here — just a better way to learn about yourself and the possibilities ahead.</p>
        <span className="auth-trust">Join thousands of students exploring their future</span>
      </section>

      {/* Right form */}
      <section className="auth-form-side">
        <div className="auth-box">
          <span className="auth-kicker">Start exploring</span>
          <h2>Create your account</h2>
          <p className="auth-subtitle">Your account and profile are saved securely.</p>
          <form onSubmit={submit}>
            <label>
              Your name
              <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="What should we call you?" required />
            </label>
            <label>
              Email address
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" minLength={8} placeholder="At least 8 characters" required />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="primary-auth" disabled={loading} type="submit">
              {loading ? "Creating account…" : "Create my account"}
            </button>
          </form>
          <p className="terms">By continuing, you agree to our Terms and Privacy Policy.</p>
          <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </section>
    </div>
  );
}
