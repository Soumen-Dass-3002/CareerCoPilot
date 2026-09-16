import { Link } from "react-router-dom";
import "./Auth.css";

function Signup() {
  return (
    <div className="auth-page">
      <div className="stars"></div>

      <header className="auth-header">
        <div className="pixel-plane">✈</div>

        <h1>CareerCoPilot</h1>

        <p>PLAN &gt; LEARN &gt; BUILD &gt; GROW</p>
      </header>

      <div className="auth-card">
        <div
          className="card-title"
          style={{ background: "#4fcf82" }}
        >
          SIGN UP
        </div>

        <div className="card-content">
          <h2>Join the Journey!</h2>

          <p className="subtitle">
            Create your account and start building 🚀
          </p>

          <form className="auth-form">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              required
            />

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              required
            />

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              required
            />

            <button type="submit" className="main-btn">
              CREATE ACCOUNT <span>➜</span>
            </button>
          </form>

          <div className="divider">
            <span></span>
            OR
            <span></span>
          </div>

          <button className="social-btn">
            <span>G</span>
            Continue with Google
          </button>

          <button className="social-btn">
            <span>◉</span>
            Continue with GitHub
          </button>

          <p className="switch-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

      <div className="quote">
        "SAME YOU,
        <br />
        HIGHER POTENTIAL."
      </div>

      <div className="progress-bar">
        <div style={{ width: "55%" }}></div>
      </div>
    </div>
  );
}

export default Signup;