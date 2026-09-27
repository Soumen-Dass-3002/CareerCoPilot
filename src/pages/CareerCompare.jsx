import { Link, useSearchParams } from "react-router-dom";
import { careers, getCareer } from "../data/careers";
import Shell from "../components/Shell";

const ROWS = [
  { label: "Career field",     val: c => c.domain },
  { label: "Core skills",      val: c => c.skills.join(", ") },
  { label: "Education paths",  val: c => c.education.join(" · ") },
  { label: "Relevant branches",val: c => c.degrees.join(", ") },
  { label: "Entry-level roles",val: c => c.roles.join(" · ") },
  { label: "Roadmap",          val: c => c.roadmap.join(" → ") },
];

export default function CareerCompare() {
  const [params] = useSearchParams();
  const chosen = params.get("careers")?.split(",").map(getCareer).filter(Boolean) || [];
  const display = chosen.length >= 2 ? chosen : careers.slice(0, 2);

  return (
    <Shell>
      <div className="cc-page-head">
        <Link to="/careers" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 16 }}>
          ← Back to careers
        </Link>
        <span className="cc-eyebrow">Career Comparison</span>
        <h1>See the differences <em>clearly.</em></h1>
        <p className="cc-lede">These paths are not ranked. Compare the information against what matters to you.</p>
      </div>

      {/* Comparison table */}
      <div style={{ padding: "32px 40px 60px", overflowX: "auto" }}>
        <div style={{ minWidth: 480 }}>

          {/* Header row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `160px repeat(${display.length}, 1fr)`,
            gap: 1, marginBottom: 2
          }}>
            <div style={{ padding: "16px 20px" }} />
            {display.map(c => (
              <div key={c.id} style={{
                background: "rgba(91,107,248,0.06)", border: "1px solid rgba(91,107,248,0.18)",
                borderRadius: "14px 14px 0 0", padding: "20px 24px"
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "var(--accent)", marginBottom: 6, textTransform: "uppercase" }}>{c.domain}</p>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 10 }}>{c.name}</h2>
                <Link to={`/careers/${c.id}`} style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none", borderBottom: "1px solid var(--bdr2)", paddingBottom: 2 }}>
                  View full details →
                </Link>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {ROWS.map((row, ri) => (
            <div key={row.label} style={{
              display: "grid",
              gridTemplateColumns: `160px repeat(${display.length}, 1fr)`,
              gap: 1
            }}>
              <div style={{
                padding: "16px 20px",
                background: ri % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                display: "flex", alignItems: "center",
                borderBottom: "1px solid var(--bdr)",
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.label}</span>
              </div>
              {display.map(c => (
                <div key={c.id} style={{
                  padding: "16px 24px",
                  background: ri % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                  borderBottom: "1px solid var(--bdr)",
                  borderLeft: "1px solid var(--bdr)",
                }}>
                  <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6 }}>{row.val(c)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <Link to="/careers" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--acsft)", border: "1px solid rgba(91,107,248,0.3)",
            color: "var(--txt)", textDecoration: "none",
            fontSize: 14, fontWeight: 500, padding: "10px 22px", borderRadius: 10
          }}>
            Add or change careers →
          </Link>
        </div>
      </div>
    </Shell>
  );
}
