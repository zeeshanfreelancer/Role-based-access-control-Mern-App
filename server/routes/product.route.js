import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

// GET - admin & manager
router.get("/", getProducts);

// POST - admin only
router.post("/", restrictTo("admin"), createProduct);

// PUT - admin & manager can update
router.put("/:id", restrictTo("admin", "manager"), updateProduct);

// DELETE - admin only
router.delete("/:id", restrictTo("admin"), deleteProduct);

export default router;
