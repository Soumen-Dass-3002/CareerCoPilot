import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { profileService } from "../services/storage";

/* Hardcoded replies — functionality unchanged */
const getReply = (prompt, name) => {
  const v = prompt.toLowerCase();
  if (v.includes("resume")) return "Start with a focused headline, education, real skills, and 2–3 projects you have actually completed. Open Resume Studio when you are ready and I can help you shape each section.";
  if (v.includes("compare")) return "I can help you compare paths side by side. Tell me the two careers you are considering, and I will outline their education paths, core skills, entry roles, and trade-offs without declaring a universal winner.";
  if (v.includes("career") || v.includes("interest")) return `A good first step, ${name}. Tell me which subjects, activities, or problems you enjoy. I will suggest careers to explore and explain why they may be relevant.`;
  return "That is a useful question. I will keep the guidance practical: first clarify your goal, then identify the skills or education path involved, and finally choose one small next action.";
};

const SUGGESTIONS = [
  "Which careers suit my interests?",
  "Compare two career paths",
  "Build a 30-day learning plan",
  "How do I improve my resume?",
];

const NAV = [
  ["Careers",       "/careers"],
  ["Colleges",      "/colleges"],
  ["Resume Studio", "/resumes"],
  ["Opportunities", "/jobs"],
  ["Ask Nova",      "/nova"],
];

function LogoMark() {
  return (
    <svg style={{ width: 18, height: 11, stroke: "var(--accent)", fill: "none", strokeWidth: 2.4, strokeLinecap: "round", display: "block" }} viewBox="0 0 64 38">
      <path d="M3 19C8 7 18 7 26 19s18 12 23 0c5-12 14-12 18 0"/>
      <path d="M3 19c5 12 15 12 23 0S44 7 49 19c5 12 14 12 18 0"/>
    </svg>
  );
}

export default function Nova() {
  const profile = profileService.get();
  const { pathname } = useLocation();
  const storageKey = "cc-nova-chat";
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || [{ role: "assistant", text: `Hi ${profile.name || "there"}. I'm Nova, your CareerCoPilot guide. What would you like to explore today?` }]; }
    catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottom = useRef(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text = input) => {
    const clean = text.trim();
    if (!clean || loading) return;
    setMessages(m => [...m, { role: "user", text: clean }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: "assistant", text: getReply(clean, profile.name) }]);
      setLoading(false);
    }, 520);
  };

  const clear = () => setMessages([{ role: "assistant", text: `New conversation started. What would you like to explore, ${profile.name || "there"}?` }]);

  const initials = (profile.name || "U").slice(0, 1).toUpperCase();

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg, #06060f)", color: "var(--txt, #eeeef8)", fontFamily: "var(--font,'Inter',system-ui,sans-serif)" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240, flexShrink: 0, display: "flex", flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(13,13,28,0.7)", backdropFilter: "blur(16px)"
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 8 }}>
          <LogoMark />
          <Link to="/" style={{ color: "var(--txt,#eeeef8)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            career<span style={{ color: "var(--accent,#5B6BF8)" }}>copilot</span>
          </Link>
        </div>

        {/* New chat */}
        <div style={{ padding: "16px 14px 0" }}>
          <button onClick={clear} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            background: "rgba(91,107,248,0.12)", border: "1px solid rgba(91,107,248,0.25)",
            color: "var(--txt,#eeeef8)", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
            padding: "9px 14px", borderRadius: 10, cursor: "pointer", transition: "background 0.18s"
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 14, height: 14 }}><path d="M12 5v14M5 12h14"/></svg>
            New conversation
          </button>
        </div>

        {/* Nav links */}
        <div style={{ padding: "24px 14px 0" }}>
          <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(238,238,248,0.28)", marginBottom: 8, paddingLeft: 6, textTransform: "uppercase" }}>Workspace</p>
          {NAV.map(([name, path]) => (
            <Link key={name} to={path} style={{
              display: "block", padding: "8px 10px", borderRadius: 8, marginBottom: 2,
              fontSize: 13.5, fontWeight: pathname === path ? 600 : 400,
              color: pathname === path ? "var(--txt,#eeeef8)" : "rgba(238,238,248,0.42)",
              background: pathname === path ? "rgba(91,107,248,0.12)" : "transparent",
              textDecoration: "none", transition: "all 0.18s"
            }}>
              {name}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", padding: "16px 14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent,#5B6BF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{initials}</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--txt,#eeeef8)" }}>{profile.name || "Your profile"}</p>
              <p style={{ fontSize: 11.5, color: "rgba(238,238,248,0.4)" }}>Career Explorer</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px", height: 64, borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(6,6,15,0.6)", backdropFilter: "blur(16px)", flexShrink: 0
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "var(--accent,#5B6BF8)", textTransform: "uppercase" }}>AI Career Guide</p>
            <h1 style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Ask Nova</h1>
          </div>
          <button onClick={clear} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(238,238,248,0.5)", fontFamily: "inherit", fontSize: 13, padding: "7px 14px", borderRadius: 8, cursor: "pointer", transition: "color 0.18s" }}>
            Clear chat
          </button>
        </header>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 24, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
              <span style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: msg.role === "assistant" ? "rgba(91,107,248,0.15)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${msg.role === "assistant" ? "rgba(91,107,248,0.3)" : "rgba(255,255,255,0.1)"}`,
                fontSize: msg.role === "assistant" ? "inherit" : 12, fontWeight: 800,
                color: msg.role === "assistant" ? "var(--accent,#5B6BF8)" : "var(--txt,#eeeef8)"
              }}>
                {msg.role === "assistant" ? <LogoMark /> : initials}
              </span>
              <div style={{ maxWidth: "68%" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(238,238,248,0.4)", marginBottom: 5 }}>
                  {msg.role === "assistant" ? "Nova" : profile.name || "You"}
                </p>
                <div style={{
                  background: msg.role === "assistant" ? "rgba(255,255,255,0.04)" : "rgba(91,107,248,0.12)",
                  border: `1px solid ${msg.role === "assistant" ? "rgba(255,255,255,0.07)" : "rgba(91,107,248,0.25)"}`,
                  borderRadius: msg.role === "assistant" ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
                  padding: "12px 16px"
                }}>
                  <p style={{ fontSize: 14, color: "var(--txt,#eeeef8)", lineHeight: 1.65 }}>{msg.text}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div style={{ display: "flex", gap: 14, marginBottom: 24, alignItems: "flex-start" }}>
              <span style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(91,107,248,0.15)", border: "1px solid rgba(91,107,248,0.3)" }}>
                <LogoMark />
              </span>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px 14px 14px 14px", padding: "14px 18px" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {[0, 0.15, 0.3].map((d, i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent,#5B6BF8)", opacity: 0.6, animation: `nova-dot 1.2s ${d}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Suggestion chips */}
          {messages.length <= 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(238,238,248,0.6)", fontFamily: "inherit", fontSize: 13,
                  padding: "9px 16px", borderRadius: 10, cursor: "pointer",
                  transition: "all 0.18s"
                }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottom} />
        </div>

        {/* Input area */}
        <div style={{ padding: "16px 40px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,6,15,0.7)", backdropFilter: "blur(16px)", flexShrink: 0 }}>
          <form onSubmit={e => { e.preventDefault(); send(); }} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px"; }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Message Nova about a career, degree, skill, or opportunity…"
              rows={1}
              style={{
                flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)",
                color: "var(--txt,#eeeef8)", fontFamily: "inherit", fontSize: 14, resize: "none",
                padding: "12px 16px", borderRadius: 12, outline: "none", lineHeight: 1.6,
                maxHeight: 140, overflow: "auto", transition: "border-color 0.18s"
              }}
              onFocus={e => e.target.style.borderColor = "rgba(91,107,248,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              style={{
                background: "var(--accent,#5B6BF8)", border: "none", color: "#fff",
                width: 44, height: 44, borderRadius: 12, cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "opacity 0.18s", opacity: (!input.trim() || loading) ? 0.4 : 1,
                boxShadow: "0 0 20px rgba(91,107,248,0.4)"
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 16, height: 16 }}>
                <path d="m3 3 18 9-18 9 4-9zM7 12h14"/>
              </svg>
            </button>
          </form>
          <p style={{ fontSize: 11.5, color: "rgba(238,238,248,0.3)", marginTop: 10, textAlign: "center" }}>
            Nova provides career guidance based on this demo workspace. Verify time-sensitive information from official sources.
          </p>
        </div>
      </div>

      {/* CSS for loading dots */}
      <style>{`
        @keyframes nova-dot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
