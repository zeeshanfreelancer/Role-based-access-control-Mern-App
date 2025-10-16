import express from "express";
import { signup, login, logout, me } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup); // caution: in production, restrict who can create admin
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
