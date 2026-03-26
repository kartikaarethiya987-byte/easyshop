/* ============================================================
   SHOP EASY – server.js
   Main entry point for the Express backend.
   ============================================================ */

const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const dotenv   = require("dotenv");
const path     = require("path");

// Load environment variables from .env file
dotenv.config();

// ── Create Express app ────────────────────────────────────────
const app = express();

// ── Middleware ────────────────────────────────────────────────

// Allow requests from the frontend (running on Live Server port 5500)
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  credentials: true
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart",     require("./routes/cartRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));

// ── Health check route ────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "ShopEasy API is running!" });
});

// ── 404 handler for unknown routes ───────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

// ── Connect to MongoDB, then start server ─────────────────────
const PORT     = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅  MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀  Server running at http://localhost:${PORT}`);
      console.log(`📋  API base URL: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1); // Exit if DB won't connect
  });
