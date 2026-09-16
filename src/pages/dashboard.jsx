import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const popupShown = sessionStorage.getItem("signupPopupShown");

    if (!popupShown) {
      setShowPopup(true);
      sessionStorage.setItem("signupPopupShown", "true");
    }
  }, []);

  return (
    <div className="dashboard">
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          ✈ CareerCoPilot
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>

          <Link to="/login" className="nav-login">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="hero-section">
        <div className="hero-content">

          <p className="pixel-label">
            &gt; SYSTEM ONLINE_
          </p>

          <h1>
            YOUR CAREER.
            <br />
            YOUR <span>JOURNEY.</span>
          </h1>

          <p className="hero-description">
            Plan your career, build your skills,
            discover opportunities and become
            the best version of yourself.
          </p>

          <div className="hero-buttons">
            <button className="start-btn">
              START JOURNEY ➜
            </button>

            <a href="#features" className="explore-btn">
              EXPLORE
            </a>
          </div>

        </div>

        {/* Pixel Character */}
        <div className="hero-character">
          🧑‍💻
        </div>
      </main>

      {/* Features */}
      <section id="features" className="features">

        <p className="pixel-label">
          &gt; MISSION SELECT_
        </p>

        <h2>CHOOSE YOUR NEXT MOVE</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>PLAN</h3>
            <p>
              Build a clear roadmap for your career.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>LEARN</h3>
            <p>
              Discover the skills you actually need.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>BUILD</h3>
            <p>
              Create projects and strengthen your portfolio.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>GROW</h3>
            <p>
              Find internships and opportunities.
            </p>
          </div>

        </div>
      </section>

      {/* Signup Popup */}
      {showPopup && (
        <div className="popup-overlay">

          <div className="signup-popup">

            <button
              className="popup-close"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>

            <div className="popup-icon">
              🚀
            </div>

            <p className="pixel-label">
              &gt; NEW PLAYER_
            </p>

            <h2>
              READY TO LEVEL UP?
            </h2>

            <p>
              Create a free account to save your
              career progress, projects and goals.
            </p>

            <div className="popup-buttons">

              <Link
                to="/signup"
                className="popup-signup"
              >
                CREATE ACCOUNT ➜
              </Link>

              <button
                className="popup-later"
                onClick={() => setShowPopup(false)}
              >
                MAYBE LATER
              </button>

            </div>

            <small>
              No pressure. You can explore first.
            </small>

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;