import { useState } from "react";
import PlatformShell from "./PlatformShell";
import { resumeService } from "../../services/storage";

export default function Resumes() {
  const [items, setItems] = useState(resumeService.getAll());
  const [form, setForm] = useState({
    name: "My first resume",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    education: "",
    projects: "",
  });

  const save = (e) => {
    e.preventDefault();
    resumeService.create(form);
    setItems(resumeService.getAll());
  };

  const refresh = () => setItems(resumeService.getAll());

  const FIELDS = [
    ["name", "Resume name", 1],
    ["email", "Email", 1],
    ["phone", "Phone", 1],
    ["education", "Education", 1],
    ["skills", "Skills (comma-separated)", 1],
    ["summary", "Professional summary", 3],
    ["projects", "Projects", 3],
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
                <textarea
                  rows={rows}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={key === "name"}
                />
              </label>
            ))}
            <label>
              Template
              <select
                value=""
                onChange={() => {}}
                className="cc-select"
                style={{ width: "100%", padding: "10px 14px" }}
              >
                {[
                  "ATS Classic",
                  "Modern Professional",
                  "Software Engineer",
                  "AI / ML",
                  "Data & Analytics",
                  "Student / Fresher",
                  "Corporate",
                  "Minimal",
                  "Executive",
                  "Creative",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <button type="submit">Save resume</button>
          </form>
        </section>

        {/* Saved resumes */}
        <section>
          <p className="cc-section-title">
            Saved resumes ({items.length})
          </p>
          {items.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div className="cc-card" key={item.id} style={{ padding: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</p>
                      {item.isDefault && (
                        <span
                          className="cc-card-badge"
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            marginTop: 4,
                            display: "inline-block",
                          }}
                        >
                          DEFAULT
                        </span>
                      )}
                    </div>
                  </div>
                  <p
                    style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}
                  >
                    {item.education || "No education"} · {item.skills || "No skills"}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[
                      ["Set default", () => { resumeService.setDefault(item.id); refresh(); }],
                      ["Duplicate", () => { resumeService.duplicate(item.id); refresh(); }],
                      ["Save as PDF", () => window.print()],
                    ].map(([label, fn]) => (
                      <button
                        key={label}
                        onClick={fn}
                        className="cc-btn-ghost"
                        style={{ fontSize: 12, padding: "5px 12px" }}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        resumeService.remove(item.id);
                        refresh();
                      }}
                      style={{
                        fontSize: 12,
                        padding: "5px 12px",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#EF4444",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontFamily: "var(--font)",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cc-card" style={{ padding: 40, textAlign: "center" }}>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>
                No resumes yet. Create your first one.
              </p>
            </div>
          )}
        </section>
      </div>
    </PlatformShell>
  );
}
