import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import { initCronJobs } from "./lib/cron.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import { notFound, errorHandler } from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS - allow your frontend origin and allow credentials (cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start services & server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    initCronJobs();

    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
};

start();
