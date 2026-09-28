import express from "express";
import { auth } from "./server/middleware.js";
import { handleSignup, handleLogin, handleGetMe, handleUpdateProfile, handleNovaChat } from "./server/routes.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_, response) => response.json({ ok: true }));

app.post("/api/auth/signup", handleSignup);
app.post("/api/auth/login", handleLogin);
app.get("/api/me", auth, handleGetMe);
app.put("/api/me/profile", auth, handleUpdateProfile);
app.post("/api/nova/chat", auth, handleNovaChat);

app.use((error, _, response, __) => {
  console.error(error);
  response.status(500).json({ error: "Something went wrong. Please try again." });
});

app.listen(port, () => console.log(`CareerCoPilot API running on http://localhost:${port}`));
