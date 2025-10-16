import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, user) => {
  const payload = { userId: user._id, role: user.role, name: user.name, email: user.email };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const token = jwt.sign(payload, secret, { expiresIn });

  const secureFlag = (process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production");

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: "lax",
    maxAge: parseCookieMaxAge(expiresIn)
  });

  return token;
};

function parseCookieMaxAge(expiresIn) {
  // convert simple durations like "7d" to milliseconds
  if (!expiresIn) return 7 * 24 * 60 * 60 * 1000;
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    case "d": return value * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
}
