import { useState } from "react";
import { jobs } from "../../data/jobs";
import { applicationService } from "../../services/storage";
import PlatformShell from "./PlatformShell";
import Shell, { SearchIcon, ArrowIcon } from "../../components/Shell";

export default function Jobs() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("All");
  const [apps, setApps] = useState(applicationService.getAll());

  const results = jobs.filter(
    (j) =>
      (mode === "All" || j.mode === mode) &&
      `${j.title} ${j.role} ${j.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())
  );

  const saveJob = (j) => {
    applicationService.upsert(j);
    setApps(applicationService.getAll());
  };

  const MODE_COLORS = { Remote: "#10B981", Hybrid: "#F59E0B", "On-site": "#6366f1" };

  return (
    <PlatformShell
      eyebrow="Opportunity Hub · Demo Data"
      title={<>Find roles <em>worth preparing for.</em></>}
      lede="Opportunities below come from the built-in MockJobProvider — not live listings. External applications always open with the provider."
    >
      <div className="cc-search-row" style={{ margin: "28px 40px 0" }}>
        <div className="cc-search">
          <SearchIcon />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role or skill…" />
        </div>
        <select className="cc-select" value={mode} onChange={(e) => setMode(e.target.value)}>
          {["All", "Remote", "Hybrid", "On-site"].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="cc-grid" style={{ paddingTop: 24 }}>
        {results.length ? (
          results.map((j) => {
            const saved = apps.some((a) => a.jobId === j.id);
            const modeColor = MODE_COLORS[j.mode] || "#5B6BF8";
            return (
              <article className="cc-card" key={j.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <span className="cc-card-badge" style={{ marginBottom: 0 }}>
                    MOCK JOB PROVIDER
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: modeColor,
                      background: `${modeColor}15`,
                      border: `1px solid ${modeColor}30`,
                      padding: "2px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {j.mode}
                  </span>
                </div>
                <h2 style={{ marginBottom: 4 }}>{j.title}</h2>
                <p style={{ fontSize: 13.5, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>
                  {j.company}
                </p>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                  {j.location} · {j.type} · {j.stipend}
                </p>
                <div className="cc-tags">
                  {j.skills.map((s) => (
                    <span key={s} className="cc-tag">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="cc-card-foot">
                  <a
                    href={j.link}
                    target="_blank"
                    rel="noreferrer"
                    className="cc-btn-primary"
                    style={{ textDecoration: "none", fontSize: 13, padding: "7px 14px", borderRadius: 8 }}
                  >
                    View role <ArrowIcon />
                  </a>
                  <button
                    className={`cc-btn-ghost${saved ? " picked" : ""}`}
                    onClick={() => saveJob(j)}
                  >
                    {saved ? "✓ Saved" : "Save job"}
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="cc-empty" style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>
             <p>No results found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </PlatformShell>
  );
}
