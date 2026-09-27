import crypto from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import express from "express";

const app = express();
const port = Number(process.env.PORT || 3001);
const databasePath = path.resolve(".data", "users.json");
const secret = process.env.AUTH_SECRET || "development-only-change-this-secret";
app.use(express.json({ limit: "100kb" }));

async function database() { try { return JSON.parse(await readFile(databasePath, "utf8")); } catch { return { users: [] }; } }
async function save(databaseValue) { await mkdir(path.dirname(databasePath), { recursive: true }); await writeFile(databasePath, JSON.stringify(databaseValue, null, 2)); }
const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (error, hash) => error ? reject(error) : resolve(`${salt}:${hash.toString("hex")}`)));
const verifyPassword = async (password, stored) => { const [salt, key] = stored.split(":"); const candidate = await hashPassword(password, salt); return crypto.timingSafeEqual(Buffer.from(candidate.split(":")[1], "hex"), Buffer.from(key, "hex")); };
const sign = (payload) => { const body = Buffer.from(JSON.stringify(payload)).toString("base64url"); return `${body}.${crypto.createHmac("sha256", secret).update(body).digest("base64url")}`; };
const verify = (token) => { try { const [body, signature] = token.split("."); const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url"); if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; const decoded = JSON.parse(Buffer.from(body, "base64url").toString()); return decoded.exp > Date.now() ? decoded : null; } catch { return null; } };
const userView = (user) => ({ id: user.id, name: user.name, email: user.email, profile: user.profile || {} });
const auth = async (request, response, next) => { const token = request.headers.authorization?.replace("Bearer ", ""); const payload = token && verify(token); if (!payload) return response.status(401).json({ error: "Please sign in to continue." }); const db = await database(); const user = db.users.find((item) => item.id === payload.id); if (!user) return response.status(401).json({ error: "Account not found." }); request.user = user; request.db = db; next(); };

app.get("/api/health", (_, response) => response.json({ ok: true }));
app.post("/api/auth/signup", async (request, response) => { const { name, email, password } = request.body || {}; if (!name?.trim() || !email?.trim() || !password) return response.status(400).json({ error: "Name, email, and password are required." }); if (password.length < 8) return response.status(400).json({ error: "Use at least 8 characters for your password." }); const db = await database(); const normalizedEmail = email.trim().toLowerCase(); if (db.users.some((user) => user.email === normalizedEmail)) return response.status(409).json({ error: "An account with this email already exists." }); const user = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, passwordHash: await hashPassword(password), profile: { name: name.trim(), email: normalizedEmail, interests: [], skills: [] }, createdAt: new Date().toISOString() }; db.users.push(user); await save(db); const token = sign({ id: user.id, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }); response.status(201).json({ token, user: userView(user) }); });
app.post("/api/auth/login", async (request, response) => { const { email, password } = request.body || {}; const db = await database(); const user = db.users.find((item) => item.email === email?.trim().toLowerCase()); if (!user || !(await verifyPassword(password || "", user.passwordHash))) return response.status(401).json({ error: "Email or password is incorrect." }); const token = sign({ id: user.id, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }); response.json({ token, user: userView(user) }); });
app.get("/api/me", auth, (request, response) => response.json({ user: userView(request.user) }));
app.put("/api/me/profile", auth, async (request, response) => { const profile = request.body?.profile; if (!profile || typeof profile !== "object") return response.status(400).json({ error: "A profile is required." }); request.user.profile = { ...request.user.profile, ...profile, name: profile.name?.trim() || request.user.name, email: request.user.email }; request.user.name = request.user.profile.name; await save(request.db); response.json({ user: userView(request.user) }); });
app.use((error, _, response, __) => { console.error(error); response.status(500).json({ error: "Something went wrong. Please try again." }); });
app.listen(port, () => console.log(`CareerCoPilot API running on http://localhost:${port}`));
