import { useState } from "react";
import { Link } from "react-router-dom";
import { careers } from "../../data/careers";
import PlatformShell from "./PlatformShell";
import Shell, { ArrowIcon } from "../../components/Shell";

export default function Simulator() {
  const [id, setId] = useState(careers[0].id);
  const career = careers.find((c) => c.id === id);

  return (
    <PlatformShell
      eyebrow="Career Simulator"
      title={<>Explore a <em>possible path.</em></>}
      lede="This is an exploration map, not a prediction or guarantee. You can change direction at every stage."
    >
      <div style={{ padding: "32px 40px 60px" }}>
        <select
          className="cc-select"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ marginBottom: 32, maxWidth: 360 }}
        >
          {careers.map((c) => (
            <option value={c.id} key={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="cc-card" style={{ maxWidth: 700, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>
            {career.name} — career path
          </h2>
          <ol
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {career.roadmap.map((step, i) => (
              <li
                key={step}
                style={{
                  display: "flex",
                  gap: 16,
                  position: "relative",
                }}
              >
                {i < career.roadmap.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 15,
                      top: 32,
                      width: 1,
                      height: "calc(100% - 8px)",
                      background: "rgba(91,107,248,0.2)",
                    }}
                  />
                )}
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "rgba(91,107,248,0.15)",
                    border: "1px solid rgba(91,107,248,0.4)",
                    color: "var(--accent)",
                    fontWeight: 800,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ paddingBottom: 28 }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{step}</p>
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>
                    {i === 0
                      ? "Explore subjects and interests that connect with this path."
                      : i === career.roadmap.length - 1
                      ? "Typical starting point; opportunities vary by preparation and market."
                      : "Build evidence through learning, practice, and feedback."}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            to={`/compare?careers=${career.id},software-engineer`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "var(--accent)",
              textDecoration: "none",
              fontSize: 13.5,
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            Compare with another path <ArrowIcon />
          </Link>
        </div>
      </div>
    </PlatformShell>
  );
}
