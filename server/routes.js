import crypto from "node:crypto";
import { database, save } from "./db.js";
import { hashPassword, verifyPassword, sign } from "./auth.js";

export const userView = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  profile: user.profile || {},
});

export async function handleSignup(request, response) {
  const { name, email, password } = request.body || {};

  if (!name?.trim() || !email?.trim() || !password) {
    return response.status(400).json({ error: "Name, email, and password are required." });
  }

  if (password.length < 8) {
    return response.status(400).json({ error: "Use at least 8 characters for your password." });
  }

  const db = await database();
  const normalizedEmail = email.trim().toLowerCase();

  if (db.users.some((user) => user.email === normalizedEmail)) {
    return response.status(409).json({ error: "An account with this email already exists." });
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    profile: {
      name: name.trim(),
      email: normalizedEmail,
      interests: [],
      skills: [],
    },
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  await save(db);

  const token = sign({ id: user.id, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  response.status(201).json({ token, user: userView(user) });
}

export async function handleLogin(request, response) {
  const { email, password } = request.body || {};
  const db = await database();
  const user = db.users.find((item) => item.email === email?.trim().toLowerCase());

  if (!user || !(await verifyPassword(password || "", user.passwordHash))) {
    return response.status(401).json({ error: "Email or password is incorrect." });
  }

  const token = sign({ id: user.id, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  response.json({ token, user: userView(user) });
}

export async function handleGetMe(request, response) {
  response.json({ user: userView(request.user) });
}

export async function handleUpdateProfile(request, response) {
  const profile = request.body?.profile;

  if (!profile || typeof profile !== "object") {
    return response.status(400).json({ error: "A profile is required." });
  }

  request.user.profile = {
    ...request.user.profile,
    ...profile,
    name: profile.name?.trim() || request.user.name,
    email: request.user.email,
  };
  request.user.name = request.user.profile.name;

  await save(request.db);
  response.json({ user: userView(request.user) });
}

export async function handleNovaChat(request, response) {
  const { prompt } = request.body || {};
  const name = request.user?.name || "there";

  if (!prompt) {
    return response.status(400).json({ error: "Prompt is required." });
  }

  const v = prompt.toLowerCase();
  let reply = "That is a useful question. I will keep the guidance practical: first clarify your goal, then identify the skills or education path involved, and finally choose one small next action.";

  if (v.includes("resume")) {
    reply = "Start with a focused headline, education, real skills, and 2–3 projects you have actually completed. Open Resume Studio when you are ready and I can help you shape each section.";
  } else if (v.includes("compare")) {
    reply = "I can help you compare paths side by side. Tell me the two careers you are considering, and I will outline their education paths, core skills, entry roles, and trade-offs without declaring a universal winner.";
  } else if (v.includes("career") || v.includes("interest")) {
    reply = `A good first step, ${name}. Tell me which subjects, activities, or problems you enjoy. I will suggest careers to explore and explain why they may be relevant.`;
  }

  response.json({ text: reply });
}
