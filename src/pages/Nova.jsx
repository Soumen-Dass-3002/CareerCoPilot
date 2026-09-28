import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { profileService } from "../services/storage";
import "./nova.css";
import { Mark } from "../components/Icons";

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

  const send = async (text = input) => {
    const clean = text.trim();
    if (!clean || loading) return;
    setMessages(m => [...m, { role: "user", text: clean }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/nova/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: clean }),
      });
      const data = await response.json();
      setMessages(m => [...m, { role: "assistant", text: data.text }]);
    } catch (error) {
      setMessages(m => [...m, { role: "assistant", text: "I'm having trouble connecting to my guidance engine. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => setMessages([{ role: "assistant", text: `New conversation started. What would you like to explore, ${profile.name || "there"}?` }]);

  const initials = (profile.name || "U").slice(0, 1).toUpperCase();

  return (
    <div className="nova-container">

      {/* ── Sidebar ── */}
      <aside className="nova-sidebar">
        {/* Logo */}
        <div className="nova-logo-area">
          <Mark small />
          <Link to="/" className="nova-logo-link">
            career<span className="nova-logo-accent">copilot</span>
          </Link>
        </div>

        {/* New chat */}
        <div className="nova-sidebar-section">
          <button onClick={clear} className="nova-btn-new-chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 14, height: 14 }}><path d="M12 5v14M5 12h14"/></svg>
            New conversation
          </button>
        </div>

        {/* Nav links */}
        <div className="nova-nav-area">
          <p className="nova-nav-label">Workspace</p>
          {NAV.map(([name, path]) => (
            <Link key={name} to={path} className={`nova-nav-link ${pathname === path ? "nova-nav-link-active" : "nova-nav-link-inactive"}`}>
              {name}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="nova-sidebar-footer">
          <Link to="/profile" className="nova-profile-link">
            <span className="nova-profile-avatar">{initials}</span>
            <div>
              <p className="nova-profile-name">{profile.name || "Your profile"}</p>
              <p className="nova-profile-role">Career Explorer</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <div className="nova-main-area">

        {/* Header */}
        <header className="nova-header">
          <div>
            <p className="nova-header-label">AI Career Guide</p>
            <h1 className="nova-header-title">Ask Nova</h1>
          </div>
          <button onClick={clear} className="nova-btn-clear">
            Clear chat
          </button>
        </header>

        {/* Messages */}
        <div className="nova-messages-area">
          {messages.map((msg, i) => (
            <div key={i} className={`nova-message-row ${msg.role === "user" ? "nova-message-row-user" : "nova-message-row-assistant"}`}>
              <span className={`nova-message-avatar ${msg.role === "assistant" ? "nova-avatar-assistant" : "nova-avatar-user"}`}>
                {msg.role === "assistant" ? <Mark small /> : initials}
              </span>
              <div className="nova-message-content">
                <p className="nova-message-author">
                  {msg.role === "assistant" ? "Nova" : profile.name || "You"}
                </p>
                <div className={`nova-message-bubble ${msg.role === "assistant" ? "nova-bubble-assistant" : "nova-bubble-user"}`}>
                  <p className="nova-message-text">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div className="nova-loading-row">
              <span className="nova-message-avatar nova-avatar-assistant">
                <Mark small />
              </span>
              <div className="nova-loading-bubble">
                <div className="nova-loading-dots">
                  <span className="nova-dot nova-dot-1" />
                  <span className="nova-dot nova-dot-2" />
                  <span className="nova-dot nova-dot-3" />
                </div>
              </div>
            </div>
          )}

          {/* Suggestion chips */}
          {messages.length <= 1 && (
            <div className="nova-suggestions-area">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} className="nova-suggestion-btn">
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottom} />
        </div>

        {/* Input area */}
        <div className="nova-input-area">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="nova-input-form">
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px"; }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Message Nova about a career, degree, skill, or opportunity…"
              rows={1}
              className="nova-textarea"
              onFocus={e => e.target.style.borderColor = "rgba(91,107,248,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="nova-btn-send"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 16, height: 16 }}>
                <path d="m3 3 18 9-18 9 4-9zM7 12h14"/>
              </svg>
            </button>
          </form>
          <p className="nova-footer-text">
            Nova provides career guidance based on this demo workspace. Verify time-sensitive information from official sources.
          </p>
        </div>
      </div>
    </div>
  );
}
