import { useState } from "react";
import { Link } from "react-router-dom";
import PlatformShell from "./PlatformShell";
import { resumeService, atsService } from "../../services/storage";

export default function ATS() {
  const [resumes] = useState(resumeService.getAll());
  const [id, setId] = useState(resumes[0]?.id || "");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);

  const run = () => setResult(atsService.analyse(resumes.find((x) => x.id === id), jd));

  return (
    <PlatformShell
      eyebrow="ATS Analysis"
      title={<>Understand your <em>resume match.</em></>}
      lede="This score is calculated from the information you provide. It never invents experience, skills, or metrics."
    >
      <div style={{ padding: "32px 40px 60px", maxWidth: 800 }}>
        {resumes.length ? (
          <>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              <select
                className="cc-select"
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={{ flex: 1, minWidth: 200 }}
              >
                {resumes.map((r) => (
                  <option value={r.id} key={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <button
                onClick={run}
                className="cc-btn-primary"
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                  fontSize: 14,
                  fontWeight: 600,
                  background: "var(--accent)",
                  color: "#fff",
                  boxShadow: "0 0 20px var(--acglow)",
                }}
              >
                Run analysis
              </button>
            </div>
            <textarea
              className="cc-form"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Optional: paste a job description for job-specific keyword matching…"
              rows={5}
              style={{
                width: "100%",
                marginBottom: 24,
                background: "var(--surf)",
                border: "1px solid var(--bdr2)",
                color: "var(--txt)",
                fontFamily: "var(--font)",
                fontSize: 14,
                padding: 14,
                borderRadius: 12,
                outline: "none",
                resize: "vertical",
              }}
            />

            {result && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Score */}
                <div className="cc-card" style={{ display: "flex", alignItems: "center", gap: 28, padding: 28 }}>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <p
                      style={{
                        fontSize: "3rem",
                        fontWeight: 900,
                        letterSpacing: "-0.05em",
                        background: "linear-gradient(100deg,#7B8FFA,#B794F4)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {result.score}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>/100 ATS score</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    {result.categories.map(([n, s]) => (
                      <div key={n} style={{ marginBottom: 10 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12.5,
                            marginBottom: 5,
                          }}
                        >
                          <span style={{ color: "var(--muted)" }}>{n}</span>
                          <span style={{ fontWeight: 600 }}>{s}%</span>
                        </div>
                        <div
                          style={{
                            height: 4,
                            background: "rgba(255,255,255,0.07)",
                            borderRadius: 999,
                          }}
                        >
                          <div
                            style={{
                              width: `${s}%`,
                              height: "100%",
                              borderRadius: 999,
                              background: "linear-gradient(90deg,#5B6BF8,#8B5CF6)",
                              transition: "width 0.6s ease",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div className="cc-card" style={{ padding: 24 }}>
                    <p className="cc-section-title" style={{ marginBottom: 14 }}>
                      Suggestions
                    </p>
                    <ul
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {result.suggestions.map((s) => (
                        <li
                          key={s}
                          style={{
                            fontSize: 13.5,
                            color: "var(--muted)",
                            paddingLeft: 16,
                            position: "relative",
                            lineHeight: 1.6,
                          }}
                        >
                          <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>
                            →
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keyword alignment */}
                {jd && (
                  <div className="cc-card" style={{ padding: 24 }}>
                    <p className="cc-section-title" style={{ marginBottom: 14 }}>
                      Job Description Alignment
                    </p>
                    <p
                      style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 8 }}
                    >
                      <span style={{ color: "var(--txt)", fontWeight: 600 }}>Matched:</span> {result.matched.join(", ") || "None found"}
                    </p>
                    <p style={{ fontSize: 13.5, color: "var(--muted)" }}>
                      <span style={{ color: "var(--txt)", fontWeight: 600 }}>Review:</span> {result.missing.join(", ") || "No notable gaps"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="cc-card" style={{ padding: 48, textAlign: "center" }}>
            <h2 style={{ marginBottom: 12 }}>Create a resume first</h2>
            <Link to="/resumes" style={{ color: "var(--accent)", fontSize: 14, textDecoration: "none" }}>
              Open resume studio →
            </Link>
          </div>
        )}
      </div>
    </PlatformShell>
  );
}
