/* ============================================================
   SHOP EASY – routes/authRoutes.js
   ============================================================ */

const express    = require("express");
const router     = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register  → create new account
router.post("/register", register);

// POST /api/auth/login     → get JWT token
router.post("/login", login);

// GET  /api/auth/me        → get current user profile (protected)
router.get("/me", protect, getMe);

module.exports = router;
