import { Link, useLocation } from "react-router-dom";
import "../design.css";

const NAV = [
  ["Careers",       "/careers"],
  ["Resume Studio", "/resumes"],
  ["Opportunities", "/jobs"],
  ["Ask Nova",      "/nova"],
];

function LogoMark() {
  return (
    <svg className="cc-logo-mark" viewBox="0 0 64 38" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M3 19C8 7 18 7 26 19s18 12 23 0c5-12 14-12 18 0"/>
      <path d="M3 19c5 12 15 12 23 0S44 7 49 19c5 12 14 12 18 0"/>
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14,display:'block'}}>
      <path d="M5 12h14m-5-5 5 5-5 5"/>
    </svg>
  );
}

/** Shared shell — wraps every inner page with consistent nav */
export default function Shell({ children }) {
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (path === "/careers") return pathname.startsWith("/careers") || pathname.startsWith("/compare");
    return pathname.startsWith(path);
  };

  return (
    <div className="cc-shell">
      <nav className="cc-nav">
        <Link to="/" className="cc-logo">
          <LogoMark />
          career<span>copilot</span>
        </Link>

        <div className="cc-nav-links">
          {NAV.map(([name, path]) => (
            <Link key={name} to={path} className={`cc-nav-link${isActive(path) ? " active" : ""}`}>
              {name}
            </Link>
          ))}
        </div>

        <div className="cc-nav-right">
          <Link to="/login"  className="cc-ghost">Sign in</Link>
          <Link to="/signup" className="cc-cta">Get Started</Link>
        </div>
      </nav>

      <div className="cc-body">{children}</div>
    </div>
  );
}
