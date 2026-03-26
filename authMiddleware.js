/* ============================================================
   SHOP EASY – middleware/authMiddleware.js
   Verifies JWT token on protected routes.
   ============================================================ */

const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/*
 * protect(req, res, next)
 *
 * How it works:
 * 1. Reads the Authorization header: "Bearer <token>"
 * 2. Verifies the token with our JWT_SECRET
 * 3. Looks up the user in MongoDB
 * 4. Attaches the user object to req.user for downstream controllers
 * 5. Calls next() to proceed to the actual route handler
 *
 * Usage — add to any route that requires login:
 *   router.get("/cart", protect, cartController.getCart);
 */
const protect = async (req, res, next) => {
  try {
    // ── Step 1: Extract token from header ────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorised. Please log in to access this resource."
      });
    }

    const token = authHeader.split(" ")[1]; // "Bearer TOKEN" → "TOKEN"

    // ── Step 2: Verify the token ──────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Token is expired or tampered with
      return res.status(401).json({
        error: "Invalid or expired token. Please log in again."
      });
    }

    // ── Step 3: Fetch user from DB ────────────────────────────
    // We do NOT select the password field (-password)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found. Please register again." });
    }

    // ── Step 4: Attach user to request ───────────────────────
    req.user = user;

    // ── Step 5: Proceed to the route handler ─────────────────
    next();

  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(500).json({ error: "Server error during authentication" });
  }
};

module.exports = { protect };
