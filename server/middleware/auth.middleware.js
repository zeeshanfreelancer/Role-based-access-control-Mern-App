import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, token missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach minimal user info to req.user
    req.user = { id: decoded.userId, role: decoded.role, name: decoded.name, email: decoded.email };

    // Optionally fetch full user from DB:
    req.currentUser = await User.findById(decoded.userId).select("-password");
    next();
  } catch (err) {
    res.status(401);
    next(new Error("Not authorized, token failed or expired"));
  }
};
