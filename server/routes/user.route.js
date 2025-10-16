import express from "express";
import {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.post("/", createUser);
router.get("/", listUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
