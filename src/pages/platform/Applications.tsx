import { useState } from "react";
import { applicationService } from "../../services/storage";
import PlatformShell from "./PlatformShell";

export default function Applications() {
  const [apps, setApps] = useState(applicationService.getAll());
  const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

  const move = (id, status) => {
    applicationService.saveAll(
      apps.map((x) => (x.jobId === id ? { ...x, status } : x))
    );
    setApps(applicationService.getAll());
  };

  const STATUS_COLORS = {
    Saved: "#5B6BF8",
    Applied: "#06B6D4",
    Interview: "#F59E0B",
    Offer: "#10B981",
    Rejected: "#EF4444",
  };

  return (
    <PlatformShell
      eyebrow="Application Tracker"
      title={<>Keep your <em>momentum visible.</em></>}
    >
      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "0 40px 32px",
          flexWrap: "wrap",
        }}
      >
        {STATUSES.slice(0, 4).map((s) => (
          <div
            key={s}
            className="cc-card"
            style={{ padding: "16px 24px", textAlign: "center", minWidth: 120, flex: 1 }}
          >
            <p style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.04em", color: STATUS_COLORS[s] }}>
              {apps.filter((a) => a.status === s).length}
            </p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s}</p>
          </div>
        ))}
      </div>

      {/* Kanban columns */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "0 40px 60px",
          overflowX: "auto",
        }}
      >
        {STATUSES.map((status) => {
          const col = apps.filter((a) => a.status === status);
          const c = STATUS_COLORS[status];
          return (
            <div key={status} style={{ minWidth: 220, flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c,
                    flexShrink: 0,
                  }}
                />
                <p style={{ fontSize: 13, fontWeight: 600 }}>{status}</p>
                <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>
                  {col.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.map((app) => (
                  <div className="cc-card" key={app.jobId} style={{ padding: 16 }}>
                    <p style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>
                      {app.title}
                    </p>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>
                      {app.company}
                    </p>
                    <select
                      value={app.status}
                      onChange={(e) => move(app.jobId, e.target.value)}
                      className="cc-select"
                      style={{ width: "100%", fontSize: 12, padding: "6px 10px" }}
                    >
                      {STATUSES.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </div>
                ))}
                {!col.length && (
                  <div
                    style={{
                      padding: "24px 0",
                      textAlign: "center",
                      fontSize: 12.5,
                      color: "var(--muted2)",
                    }}
                  >
                    No roles here yet.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PlatformShell>
  );
}
