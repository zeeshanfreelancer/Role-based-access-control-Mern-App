import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please provide name, email and password");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error("Email already in use");
    }

    // default role: admin if none? For admin signup, we expect admin creation via seeder or manual.
    const user = await User.create({ name, email, password, role: role || "admin" });

    generateTokenAndSetCookie(res, user);

    res.status(201).json({
      message: "User created",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const match = await user.comparePassword(password);
    if (!match) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    generateTokenAndSetCookie(res, user);

    res.json({
      message: "Logged in",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out" });
};

export const me = async (req, res, next) => {
  try {
    // protect middleware may have populated req.currentUser
    if (req.currentUser) {
      return res.json(req.currentUser);
    }

    // fallback: check cookie
    const token = req.cookies?.jwt;
    if (!token) {
      res.status(401);
      throw new Error("Not authenticated");
    }
    // decode token directly
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
