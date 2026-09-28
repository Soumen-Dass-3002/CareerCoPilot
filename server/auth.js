import crypto from "node:crypto";

const secret = process.env.AUTH_SECRET || "development-only-change-this-secret";

export const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, hash) => {
      if (error) reject(error);
      else resolve(`${salt}:${hash.toString("hex")}`);
    });
  });

export const verifyPassword = async (password, stored) => {
  const [salt, key] = stored.split(":");
  const candidate = await hashPassword(password, salt);
  const candidateHash = candidate.split(":")[1];
  return crypto.timingSafeEqual(
    Buffer.from(candidateHash, "hex"),
    Buffer.from(key, "hex")
  );
};

export const sign = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
};

export const verify = (token) => {
  try {
    const [body, signature] = token.split(".");
    const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }
    const decoded = JSON.parse(Buffer.from(body, "base64url").toString());
    return decoded.exp > Date.now() ? decoded : null;
  } catch {
    return null;
  }
};
