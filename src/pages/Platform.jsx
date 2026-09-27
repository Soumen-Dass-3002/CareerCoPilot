import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { jobs } from "../data/jobs";
import { careers } from "../data/careers";
import { applicationService, atsService, profileService, resumeService } from "../services/storage";
import Shell, { SearchIcon, ArrowIcon } from "../components/Shell";

/* ─── Shared inner shell for platform pages ─── */
function PlatformShell({ eyebrow, title, lede, children }) {
  return (
    <Shell>
      <div className="cc-page-head">
        {eyebrow && <span className="cc-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {lede && <p className="cc-lede">{lede}</p>}
      </div>
      {children}
    </Shell>
  );
}

/* ─── Empty state ─── */
function Empty({ label = "No results found", hint = "Try adjusting your search or filters.", onClear }) {
  return (
    <div className="cc-empty" style={{ gridColumn: "1 / -1" }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <h2>{label}</h2>
      <p>{hint}</p>
      {onClear && <button onClick={onClear}>Clear filters</button>}
    </div>
  );
}



/* ══════════════════════════════════════════════
   RESUMES
══════════════════════════════════════════════ */
export function Resumes() {
  const [items, setItems] = useState(resumeService.getAll());
  const [form, setForm] = useState({ name: "My first resume", email: "", phone: "", summary: "", skills: "", education: "", projects: "" });

  const save = e => {
    e.preventDefault();
    resumeService.create(form);
    setItems(resumeService.getAll());
  };
  const refresh = () => setItems(resumeService.getAll());

  const FIELDS = [
    ["name", "Resume name", 1], ["email", "Email", 1], ["phone", "Phone", 1],
    ["education", "Education", 1], ["skills", "Skills (comma-separated)", 1],
    ["summary", "Professional summary", 3], ["projects", "Projects", 3],
  ];

  return (
    <PlatformShell
      eyebrow="Resume Studio"
      title={<>Build a resume <em>you own.</em></>}
      lede="Your resumes are stored independently. Creating another resume never removes an existing one."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "32px 40px 60px" }}>

        {/* Create form */}
        <section className="cc-card" style={{ padding: 28 }}>
          <p className="cc-section-title">Create a resume</p>
          <form className="cc-form" onSubmit={save}>
            {FIELDS.map(([key, label, rows]) => (
              <label key={key}>
                {label}
                <textarea rows={rows} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key === "name"} />
              </label>
            ))}
            <label>
              Template
              <select value="" onChange={() => {}} className="cc-select" style={{ width: "100%", padding: "10px 14px" }}>
                {["ATS Classic", "Modern Professional", "Software Engineer", "AI / ML", "Data & Analytics", "Student / Fresher", "Corporate", "Minimal", "Executive", "Creative"].map(t => <option key={t}>{t}</option>)}
              </select>
            </label>
            <button type="submit">Save resume</button>
          </form>
        </section>

        {/* Saved resumes */}
        <section>
          <p className="cc-section-title">Saved resumes ({items.length})</p>
          {items.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map(item => (
                <div className="cc-card" key={item.id} style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</p>
                      {item.isDefault && <span className="cc-card-badge" style={{ fontSize: 10, padding: "2px 8px", marginTop: 4, display: "inline-block" }}>DEFAULT</span>}
                    </div>
                  </div>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
                    {item.education || "No education"} · {item.skills || "No skills"}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[
                      ["Set default", () => { resumeService.setDefault(item.id); refresh(); }],
                      ["Duplicate",   () => { resumeService.duplicate(item.id); refresh(); }],
                      ["Save as PDF", () => window.print()],
                    ].map(([label, fn]) => (
                      <button key={label} onClick={fn} className="cc-btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }}>{label}</button>
                    ))}
                    <button onClick={() => { resumeService.remove(item.id); refresh(); }} style={{ fontSize: 12, padding: "5px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font)" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cc-card" style={{ padding: 40, textAlign: "center" }}>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>No resumes yet. Create your first one.</p>
            </div>
          )}
        </section>
      </div>
    </PlatformShell>
  );
}

/* ══════════════════════════════════════════════
   ATS ANALYSER
══════════════════════════════════════════════ */
export function ATS() {
  const [resumes] = useState(resumeService.getAll());
  const [id, setId] = useState(resumes[0]?.id || "");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);

  const run = () => setResult(atsService.analyse(resumes.find(x => x.id === id), jd));

  return (
    <PlatformShell
      eyebrow="ATS Analysis"
      title={<>Understand your <em>resume match.</em></>}
      lede="This score is calculated from the information you provide. It never invents experience, skills, or metrics."
    >
      <div style={{ padding: "32px 40px 60px", maxWidth: 800 }}>
        {resumes.length ? (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <select className="cc-select" value={id} onChange={e => setId(e.target.value)} style={{ flex: 1, minWidth: 200 }}>
                {resumes.map(r => <option value={r.id} key={r.id}>{r.name}</option>)}
              </select>
              <button onClick={run} className="cc-btn-primary" style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "var(--font)", fontSize: 14, fontWeight: 600, background: "var(--accent)", color: "#fff", boxShadow: "0 0 20px var(--acglow)" }}>
                Run analysis
              </button>
            </div>
            <textarea
              className="cc-form"
              value={jd} onChange={e => setJd(e.target.value)}
              placeholder="Optional: paste a job description for job-specific keyword matching…"
              rows={5}
              style={{ width: "100%", marginBottom: 24, background: "var(--surf)", border: "1px solid var(--bdr2)", color: "var(--txt)", fontFamily: "var(--font)", fontSize: 14, padding: 14, borderRadius: 12, outline: "none", resize: "vertical" }}
            />

            {result && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Score */}
                <div className="cc-card" style={{ display: "flex", alignItems: "center", gap: 28, padding: 28 }}>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <p style={{ fontSize: "3rem", fontWeight: 900, letterSpacing: "-0.05em", background: "linear-gradient(100deg,#7B8FFA,#B794F4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{result.score}</p>
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>/100 ATS score</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    {result.categories.map(([n, s]) => (
                      <div key={n} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                          <span style={{ color: "var(--muted)" }}>{n}</span>
                          <span style={{ fontWeight: 600 }}>{s}%</span>
                        </div>
                        <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 999 }}>
                          <div style={{ width: `${s}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#5B6BF8,#8B5CF6)", transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div className="cc-card" style={{ padding: 24 }}>
                    <p className="cc-section-title" style={{ marginBottom: 14 }}>Suggestions</p>
                    <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {result.suggestions.map(s => (
                        <li key={s} style={{ fontSize: 13.5, color: "var(--muted)", paddingLeft: 16, position: "relative", lineHeight: 1.6 }}>
                          <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>→</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keyword alignment */}
                {jd && (
                  <div className="cc-card" style={{ padding: 24 }}>
                    <p className="cc-section-title" style={{ marginBottom: 14 }}>Job Description Alignment</p>
                    <p style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 8 }}><span style={{ color: "var(--txt)", fontWeight: 600 }}>Matched:</span> {result.matched.join(", ") || "None found"}</p>
                    <p style={{ fontSize: 13.5, color: "var(--muted)" }}><span style={{ color: "var(--txt)", fontWeight: 600 }}>Review:</span> {result.missing.join(", ") || "No notable gaps"}</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="cc-card" style={{ padding: 48, textAlign: "center" }}>
            <h2 style={{ marginBottom: 12 }}>Create a resume first</h2>
            <Link to="/resumes" style={{ color: "var(--accent)", fontSize: 14, textDecoration: "none" }}>Open resume studio →</Link>
          </div>
        )}
      </div>
    </PlatformShell>
  );
}

/* ══════════════════════════════════════════════
   JOBS
══════════════════════════════════════════════ */
export function Jobs() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("All");
  const [apps, setApps] = useState(applicationService.getAll());

  const results = jobs.filter(j =>
    (mode === "All" || j.mode === mode) &&
    `${j.title} ${j.role} ${j.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())
  );

  const saveJob = j => { applicationService.upsert(j); setApps(applicationService.getAll()); };

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
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search role or skill…" />
        </div>
        <select className="cc-select" value={mode} onChange={e => setMode(e.target.value)}>
          {["All", "Remote", "Hybrid", "On-site"].map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      <div className="cc-grid" style={{ paddingTop: 24 }}>
        {results.length ? results.map(j => {
          const saved = apps.some(a => a.jobId === j.id);
          const modeColor = MODE_COLORS[j.mode] || "#5B6BF8";
          return (
            <article className="cc-card" key={j.id}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span className="cc-card-badge" style={{ marginBottom: 0 }}>MOCK JOB PROVIDER</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: modeColor, background: `${modeColor}15`, border: `1px solid ${modeColor}30`, padding: "2px 10px", borderRadius: 999 }}>{j.mode}</span>
              </div>
              <h2 style={{ marginBottom: 4 }}>{j.title}</h2>
              <p style={{ fontSize: 13.5, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>{j.company}</p>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>{j.location} · {j.type} · {j.stipend}</p>
              <div className="cc-tags">
                {j.skills.map(s => <span key={s} className="cc-tag">{s}</span>)}
              </div>
              <div className="cc-card-foot">
                <a href={j.link} target="_blank" rel="noreferrer" className="cc-btn-primary" style={{ textDecoration: "none", fontSize: 13, padding: "7px 14px", borderRadius: 8 }}>
                  View role <ArrowIcon />
                </a>
                <button className={`cc-btn-ghost${saved ? " picked" : ""}`} onClick={() => saveJob(j)}>
                  {saved ? "✓ Saved" : "Save job"}
                </button>
              </div>
            </article>
          );
        }) : <Empty onClear={() => { setQuery(""); setMode("All"); }} />}
      </div>
    </PlatformShell>
  );
}

/* ══════════════════════════════════════════════
   CAREER SIMULATOR
══════════════════════════════════════════════ */
export function Simulator() {
  const [id, setId] = useState(careers[0].id);
  const career = careers.find(c => c.id === id);

  return (
    <PlatformShell
      eyebrow="Career Simulator"
      title={<>Explore a <em>possible path.</em></>}
      lede="This is an exploration map, not a prediction or guarantee. You can change direction at every stage."
    >
      <div style={{ padding: "32px 40px 60px" }}>
        <select className="cc-select" value={id} onChange={e => setId(e.target.value)} style={{ marginBottom: 32, maxWidth: 360 }}>
          {careers.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
        </select>

        <div className="cc-card" style={{ maxWidth: 700, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>{career.name} — career path</h2>
          <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 0 }}>
            {career.roadmap.map((step, i) => (
              <li key={step} style={{ display: "flex", gap: 16, position: "relative" }}>
                {i < career.roadmap.length - 1 && (
                  <div style={{ position: "absolute", left: 15, top: 32, width: 1, height: "calc(100% - 8px)", background: "rgba(91,107,248,0.2)" }} />
                )}
                <span style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "rgba(91,107,248,0.15)", border: "1px solid rgba(91,107,248,0.4)", color: "var(--accent)", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                  {i + 1}
                </span>
                <div style={{ paddingBottom: 28 }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{step}</p>
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>
                    {i === 0 ? "Explore subjects and interests that connect with this path." : i === career.roadmap.length - 1 ? "Typical starting point; opportunities vary by preparation and market." : "Build evidence through learning, practice, and feedback."}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <Link to={`/compare?careers=${career.id},software-engineer`} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--accent)", textDecoration: "none", fontSize: 13.5, fontWeight: 600, marginTop: 8 }}>
            Compare with another path <ArrowIcon />
          </Link>
        </div>
      </div>
    </PlatformShell>
  );
}

/* ══════════════════════════════════════════════
   APPLICATIONS
══════════════════════════════════════════════ */
export function Applications() {
  const [apps, setApps] = useState(applicationService.getAll());
  const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

  const move = (id, status) => {
    applicationService.saveAll(apps.map(x => x.jobId === id ? { ...x, status } : x));
    setApps(applicationService.getAll());
  };

  const STATUS_COLORS = { Saved: "#5B6BF8", Applied: "#06B6D4", Interview: "#F59E0B", Offer: "#10B981", Rejected: "#EF4444" };

  return (
    <PlatformShell
      eyebrow="Application Tracker"
      title={<>Keep your <em>momentum visible.</em></>}
    >
      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, padding: "0 40px 32px", flexWrap: "wrap" }}>
        {STATUSES.slice(0, 4).map(s => (
          <div key={s} className="cc-card" style={{ padding: "16px 24px", textAlign: "center", minWidth: 120, flex: 1 }}>
            <p style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.04em", color: STATUS_COLORS[s] }}>{apps.filter(a => a.status === s).length}</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s}</p>
          </div>
        ))}
      </div>

      {/* Kanban columns */}
      <div style={{ display: "flex", gap: 12, padding: "0 40px 60px", overflowX: "auto" }}>
        {STATUSES.map(status => {
          const col = apps.filter(a => a.status === status);
          const c = STATUS_COLORS[status];
          return (
            <div key={status} style={{ minWidth: 220, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                <p style={{ fontSize: 13, fontWeight: 600 }}>{status}</p>
                <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>{col.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.map(app => (
                  <div className="cc-card" key={app.jobId} style={{ padding: 16 }}>
                    <p style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>{app.title}</p>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>{app.company}</p>
                    <select
                      value={app.status}
                      onChange={e => move(app.jobId, e.target.value)}
                      className="cc-select"
                      style={{ width: "100%", fontSize: 12, padding: "6px 10px" }}
                    >
                      {STATUSES.map(x => <option key={x}>{x}</option>)}
                    </select>
                  </div>
                ))}
                {!col.length && <div style={{ padding: "24px 0", textAlign: "center", fontSize: 12.5, color: "var(--muted2)" }}>No roles here yet.</div>}
              </div>
            </div>
          );
        })}
      </div>
    </PlatformShell>
  );
}

/* ══════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════ */
export function Profile() {
  const [profile, setProfile] = useState(profileService.get());

  const save = e => {
    e.preventDefault();
    profileService.save({
      ...profile,
      skills: profile.skills?.split?.(",").map(x => x.trim()).filter(Boolean) || profile.skills,
      interests: profile.interests?.split?.(",").map(x => x.trim()).filter(Boolean) || profile.interests,
    });
    alert("Profile saved");
  };

  const FIELDS = [
    ["name", "Your name"],
    ["education", "Education level / qualification"],
    ["interests", "Interested fields (comma-separated)"],
    ["skills", "Skills (comma-separated)"],
    ["location", "Preferred location"],
    ["workMode", "Preferred work mode"],
  ];

  return (
    <PlatformShell
      eyebrow="Your Profile"
      title={<>Tell us only <em>what helps.</em></>}
      lede="You can skip anything you are not ready to share. Update your education, interests, skills, and preferences whenever you want."
    >
      <div style={{ padding: "32px 40px 60px", maxWidth: 560 }}>
        <form className="cc-form" onSubmit={save}>
          {FIELDS.map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                value={Array.isArray(profile[key]) ? profile[key].join(", ") : profile[key] || ""}
                onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                placeholder={key === "interests" ? "e.g. Technology, Design" : ""}
              />
            </label>
          ))}
          <button type="submit">Save my profile</button>
        </form>
      </div>
    </PlatformShell>
  );
}
