import { Link, useParams } from "react-router-dom";
import { getCareer } from "../data/careers";
import Shell, { ArrowIcon } from "../components/Shell";

const DOMAIN_COLORS = {
  Technology: "#5B6BF8", Design: "#8B5CF6", Business: "#06B6D4",
  Science: "#10B981", Healthcare: "#F59E0B", Law: "#EF4444",
  Commerce: "#F97316", Media: "#EC4899",
};

export default function CareerDetail() {
  const { careerId } = useParams();
  const career = getCareer(careerId);

  if (!career) return (
    <Shell>
      <div className="cc-notfound">
        <h1>Career not found</h1>
        <Link to="/careers">Explore careers →</Link>
      </div>
    </Shell>
  );

  const acColor = DOMAIN_COLORS[career.domain] || "#5B6BF8";

  return (
    <Shell>
      {/* Page header */}
      <div className="cc-page-head">
        <Link to="/careers" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 16, transition: "color 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--txt)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
        >
          ← Back to careers
        </Link>
        <span
          className="cc-card-badge"
          style={{ color: acColor, borderColor: `${acColor}33`, background: `${acColor}14`, display: "inline-block", marginBottom: 14 }}
        >
          {career.domain.toUpperCase()} CAREER
        </span>
        <h1>{career.name}</h1>
        <p className="cc-lede">{career.description}</p>
        <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
          <Link
            to={`/compare?careers=${career.id},software-engineer`}
            className="cc-btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, background: "var(--accent)", color: "#fff", boxShadow: "0 0 20px var(--acglow)" }}
          >
            Compare this career <ArrowIcon />
          </Link>
          <Link
            to="/careers"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500, background: "rgba(255,255,255,0.05)", color: "var(--txt)", border: "1px solid var(--bdr2)", textDecoration: "none" }}
          >
            Browse all careers
          </Link>
        </div>
      </div>

      {/* Detail grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, padding: "32px 40px 60px" }}>

        {/* What it involves */}
        <div className="cc-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginBottom: 10 }}>What this career involves</h2>
          <p>{career.description} The specific work can differ by organisation, role, and the problems being solved.</p>
          <h3 style={{ marginTop: 20, marginBottom: 8, fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Who it may suit</h3>
          <p>It can be a good option if you enjoy {career.fit.join(", ")}. This is information to help you explore, not a prediction about what you should choose.</p>
        </div>

        {/* Skills */}
        <div className="cc-card">
          <h2 style={{ marginBottom: 14 }}>Core skills</h2>
          <div className="cc-tags">
            {career.skills.map(s => <span key={s} className="cc-tag" style={{ background: `${acColor}14`, borderColor: `${acColor}30`, color: "var(--txt)" }}>{s}</span>)}
          </div>
        </div>

        {/* Education */}
        <div className="cc-card">
          <h2 style={{ marginBottom: 12 }}>Education paths</h2>
          <ul style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {career.education.map(e => <li key={e} style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>{e}</li>)}
          </ul>
          <h3 style={{ marginTop: 18, marginBottom: 8, fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Relevant branches</h3>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>{career.degrees.join(" · ")}</p>
        </div>

        {/* Roles */}
        <div className="cc-card">
          <h2 style={{ marginBottom: 12 }}>Typical entry roles</h2>
          <ul style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {career.roles.map(r => <li key={r} style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>{r}</li>)}
          </ul>
        </div>

        {/* Roadmap */}
        <div className="cc-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginBottom: 20 }}>A possible roadmap</h2>
          <ol style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: 0, position: "relative" }}>
            {career.roadmap.map((step, i) => (
              <li key={step} style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 180, flex: 1 }}>
                <span style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: `${acColor}20`, border: `1px solid ${acColor}50`,
                  color: acColor, fontWeight: 800, fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>{i + 1}</span>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--txt)" }}>{step}</p>
                </div>
                {i < career.roadmap.length - 1 && (
                  <span style={{ fontSize: 16, color: "var(--muted2)", margin: "0 4px" }}>→</span>
                )}
              </li>
            ))}
          </ol>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 20 }}>
            Your path can be different. Use this as a starting map and adapt it to your situation.
          </p>
        </div>
      </div>
    </Shell>
  );
}
