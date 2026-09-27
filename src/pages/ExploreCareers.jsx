import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { careers, domains } from "../data/careers";
import Shell, { SearchIcon, ArrowIcon } from "../components/Shell";

const DOMAIN_COLORS = {
  Technology: "#5B6BF8", Design: "#8B5CF6", Business: "#06B6D4",
  Science: "#10B981", Healthcare: "#F59E0B", Law: "#EF4444",
  Commerce: "#F97316", Media: "#EC4899", All: "#5B6BF8",
};

export default function ExploreCareers() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");
  const [selected, setSelected] = useState([]);

  const results = useMemo(() =>
    careers.filter(c =>
      (domain === "All" || c.domain === domain) &&
      `${c.name} ${c.description} ${c.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())
    ), [domain, query]);

  const toggle = (id) =>
    setSelected(cur =>
      cur.includes(id) ? cur.filter(x => x !== id) : cur.length < 4 ? [...cur, id] : cur
    );

  return (
    <Shell>
      {/* Page header */}
      <div className="cc-page-head">
        <span className="cc-eyebrow">Career Discovery</span>
        <h1>Explore careers, <em>without pressure.</em></h1>
        <p className="cc-lede">
          Learn what different paths involve. There is no single "best" career — only options that may fit your interests and goals.
        </p>
      </div>

      {/* Search */}
      <div className="cc-search-row" style={{ margin: "28px 40px 0" }}>
        <div className="cc-search">
          <SearchIcon />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search careers, skills, or fields…"
          />
        </div>
      </div>

      {/* Domain chips */}
      <div className="cc-chips" style={{ margin: "14px 40px 0" }}>
        {domains.map(d => (
          <button key={d} className={`cc-chip${domain === d ? " active" : ""}`} onClick={() => setDomain(d)}>
            {d}
          </button>
        ))}
      </div>

      {/* Results meta */}
      <div className="cc-results-meta" style={{ marginTop: 24 }}>
        <strong>{results.length} careers to explore</strong>
        <span>Select 2–4 to compare</span>
      </div>

      {/* Grid */}
      <div className="cc-grid">
        {results.length ? results.map(career => (
          <article className="cc-card" key={career.id}>
            <span
              className="cc-card-badge"
              style={{ color: DOMAIN_COLORS[career.domain] || "#5B6BF8", borderColor: `${DOMAIN_COLORS[career.domain]}33`, background: `${DOMAIN_COLORS[career.domain]}14` }}
            >
              {career.domain}
            </span>
            <h2>{career.name}</h2>
            <p>{career.description}</p>
            <div className="cc-tags">
              {career.skills.slice(0, 3).map(s => <span key={s} className="cc-tag">{s}</span>)}
            </div>
            <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8 }}>
              <span style={{ fontWeight: 600, color: "var(--muted2)" }}>Education: </span>
              {career.education[0]}
            </p>
            <div className="cc-card-foot">
              <Link to={`/careers/${career.id}`} className="cc-btn-primary" style={{ textDecoration: "none", fontSize: 13, padding: "7px 14px", borderRadius: 8 }}>
                Explore <ArrowIcon />
              </Link>
              <button
                className={`cc-btn-ghost${selected.includes(career.id) ? " picked" : ""}`}
                onClick={() => toggle(career.id)}
              >
                {selected.includes(career.id) ? "✓ Selected" : "+ Compare"}
              </button>
            </div>
          </article>
        )) : (
          <div className="cc-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <h2>No careers found</h2>
            <p>Try a different search term or remove a filter.</p>
            <button onClick={() => { setQuery(""); setDomain("All"); }}>Clear filters</button>
          </div>
        )}
      </div>

      {/* Compare bar */}
      {selected.length >= 2 && (
        <div className="cc-compare-bar">
          <span>{selected.length} careers selected</span>
          <Link to={`/compare?careers=${selected.join(",")}`}>Compare careers →</Link>
        </div>
      )}
    </Shell>
  );
}
