import { Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  return (
    <div className="auth-page">
      <div className="stars"></div>

      <header className="auth-header">
        <div className="pixel-plane">✈</div>

        <h1>CareerCoPilot</h1>

        <p>PLAN &gt; LEARN &gt; BUILD &gt; GROW</p>
      </header>

      <div className="auth-card">
        <div className="card-title">LOGIN</div>

        <div className="card-content">
          <h2>Welcome back, Pilot!</h2>

          <p className="subtitle">
            Continue your journey 🚀
          </p>

          <form className="auth-form">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
            />

            <button type="submit" className="main-btn">
              LOGIN <span>➜</span>
            </button>
          </form>

          <div className="divider">
            <span></span>
            OR
            <span></span>
          </div>

          <button className="social-btn">
            <span>G</span> Continue with Google
          </button>

          <button className="social-btn">
            <span>◉</span> Continue with GitHub
          </button>

          <p className="switch-text">
            Don't have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>

      <div className="quote">
        "A SMALL STEP TODAY,
        <br />
        A BIGGER TOMORROW."
      </div>

      <div className="progress-bar">
        <div></div>
      </div>
    </div>
  );
}

export default Login;