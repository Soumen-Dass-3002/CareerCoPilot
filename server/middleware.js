import { database } from "./db.js";
import { verify } from "./auth.js";

export const auth = async (request, response, next) => {
  const token = request.headers.authorization?.replace("Bearer ", "");
  const payload = token && verify(token);

  if (!payload) {
    return response.status(401).json({ error: "Please sign in to continue." });
  }

  const db = await database();
  const user = db.users.find((item) => item.id === payload.id);

  if (!user) {
    return response.status(401).json({ error: "Account not found." });
  }

  request.user = user;
  request.db = db;
  next();
};
