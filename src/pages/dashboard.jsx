import { useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

const starters = ["I don't know what career suits me", "Help me explore tech careers", "What can I do after class 12?"];

function Dashboard() {
  const [message, setMessage] = useState("");
  const [showAuth, setShowAuth] = useState(true);
  const [authMode, setAuthMode] = useState("signup");
  const [messages, setMessages] = useState([{ from: "ai", text: "Hi, Aanya! I’m Nova, your Career Co-pilot. Tell me what you enjoy, what you’re good at, or simply what feels confusing right now. We’ll figure it out together." }]);
  const [gameStarted, setGameStarted] = useState(false);
  const sendMessage = (text = message) => {
    const cleanText = text.trim();
    if (!cleanText) return;
    setShowAuth(true);
    setAuthMode("signup");
  };
  return <div className="app-shell">
    <aside className="sidebar">
      <Link className="brand" to="/"><span className="brand-mark">✦</span>Career<span>CoPilot</span></Link>
      <button className="new-chat" onClick={() => setMessages(messages.slice(0, 1))}><span>＋</span> New conversation</button>
      <nav className="side-nav" aria-label="Main navigation"><a className="active" href="#chat"><span>◈</span> My co-pilot</a><a href="#path"><span>⌁</span> My career path</a><a href="#discover"><span>◌</span> Discover careers</a><a href="#resources"><span>▤</span> Learn & resources</a></nav>
      <div className="journey-card"><div className="tiny-label">YOUR JOURNEY</div><div className="journey-row"><span>Explorer</span><strong>Level 1</strong></div><div className="progress"><span /></div><p>80 XP to level 2</p></div>
      <div className="profile-row"><div className="avatar">A</div><div><strong>Aanya Sharma</strong><small>Student</small></div><button aria-label="Profile menu">···</button></div>
    </aside>
    <main className="workspace">
      <header className="topbar"><div className="mobile-brand">✦ Career<span>CoPilot</span></div><div className="streak">🔥 <strong>3 day streak</strong></div><button className="login-link" onClick={() => { setAuthMode("login"); setShowAuth(true); }}>Log in</button><button className="signup-link" onClick={() => { setAuthMode("signup"); setShowAuth(true); }}>Get started</button><button className="help-button">? <span>How it works</span></button></header>
      <section className="welcome" id="chat"><div><p className="eyebrow">YOUR SAFE SPACE TO EXPLORE</p><h1>Where would you like<br />to go next?</h1><p className="welcome-copy">There’s no “right” answer here. Start with a thought, a dream, or a question — we’ll take it one step at a time.</p></div><div className="orbit-illustration" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="spark spark-one">✦</div><div className="spark spark-two">✦</div><div className="astronaut">🧑🏽‍🚀</div></div></section>
      <div className="content-grid">
        <section className="chat-panel"><div className="panel-heading"><div className="nova-icon">✦</div><div><h2>Talk to Nova</h2><p>Your personal career guide</p></div><span className="online">● Online</span></div><div className="messages">{messages.map((item, index) => <div key={index} className={`message ${item.from}`}>{item.from === "ai" && <div className="message-icon">✦</div>}<p>{item.text}</p></div>)}</div><div className="starter-row">{starters.map((starter) => <button key={starter} onClick={() => sendMessage(starter)}>{starter}</button>)}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell Nova what’s on your mind..." /><button type="submit" aria-label="Send message">↑</button></form><small className="privacy-note">✦ Your conversations are private and judgment-free.</small></section>
        <aside className="right-rail"><section className={`quest-card ${gameStarted ? "started" : ""}`} id="path"><span className="game-kicker">LEARN BY PLAYING</span><div className="quest-art">🕹️ <span>✨</span></div><h2>{gameStarted ? "Your first quest awaits!" : "Not sure what to ask?"}</h2><p>{gameStarted ? "Answer quick choices, earn XP, and uncover career paths made for you." : "Play a short adventure to discover what makes you, you."}</p><button onClick={() => setGameStarted(true)}>{gameStarted ? "CONTINUE QUEST →" : "PLAY CAREER QUEST →"}</button><small>5 min · No wrong answers</small></section><section className="snapshot-card" id="discover"><div className="snapshot-title"><h3>Your snapshot</h3><button>View all →</button></div><div className="snapshot-item"><span className="snapshot-icon purple">✧</span><div><strong>Interests</strong><p>Let’s discover them</p></div><span className="chevron">›</span></div><div className="snapshot-item"><span className="snapshot-icon orange">⌁</span><div><strong>Strengths</strong><p>Take a quick check-in</p></div><span className="chevron">›</span></div></section></aside>
      </div>
    </main>
    {showAuth && <div className="auth-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="welcome-modal">
        <button className="modal-close" onClick={() => setShowAuth(false)} aria-label="Continue exploring without an account">×</button>
        <div className="modal-art">✦</div>
        <p className="auth-modal-kicker">WELCOME TO CAREERCOPILOT</p>
        <h2 id="auth-title">{authMode === "login" ? "Welcome back!" : "Your next step starts here."}</h2>
        <p className="modal-copy">{authMode === "login" ? "Log in to continue exploring your career journey." : "Create a free account to save your chats, career discoveries, and quest progress."}</p>
        <div className="modal-tabs"><button className={authMode === "signup" ? "selected" : ""} onClick={() => setAuthMode("signup")}>Sign up</button><button className={authMode === "login" ? "selected" : ""} onClick={() => setAuthMode("login")}>Log in</button></div>
        <Link className="modal-primary" to={authMode === "login" ? "/login" : "/signup"}>{authMode === "login" ? "LOG IN TO CONTINUE" : "CREATE FREE ACCOUNT"} <span>→</span></Link>
        <p className="modal-switch">{authMode === "login" ? <>New here? <button onClick={() => setAuthMode("signup")}>Create an account</button></> : <>Already have an account? <button onClick={() => setAuthMode("login")}>Log in</button></>}</p>
        <button className="explore-button" onClick={() => setShowAuth(false)}>I’LL EXPLORE FIRST</button>
      </div>
    </div>}
  </div>;
}
export default Dashboard;
