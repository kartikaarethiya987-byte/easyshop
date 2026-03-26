/* ============================================================
   SHOP EASY – controllers/authController.js
   Handles user registration and login.
   ============================================================ */

const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/* ── Helper: generate JWT token ─────────────────────────────────
   Creates a signed token containing the user's MongoDB _id.
   Expires in 7 days (user stays logged in for a week).
*/
const generateToken = (userId) => {
  return jwt.sign(
    { userId },                  // Payload – what we embed in the token
    process.env.JWT_SECRET,      // Secret key from .env
    { expiresIn: "7d" }          // Token expiry
  );
};

/* ── POST /api/auth/register ─────────────────────────────────────
   Creates a new user account.
   Body: { name, email, password }
*/
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Validate required fields ──────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    // ── Check for duplicate email ─────────────────────────────
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "This email is already registered. Please log in." });
    }

    // ── Create user ───────────────────────────────────────────
    // Password is hashed automatically by the pre-save hook in User.js
    const user = await User.create({ name: name.trim(), email, password });

    // ── Generate token ────────────────────────────────────────
    const token = generateToken(user._id);

    // ── Respond ───────────────────────────────────────────────
    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Register error:", err.message);

    // Mongoose duplicate key error (race condition)
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already registered." });
    }
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: "Server error during registration." });
  }
};

/* ── POST /api/auth/login ────────────────────────────────────────
   Validates credentials and returns a JWT token.
   Body: { email, password }
*/
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validate fields ───────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // ── Find user (include password for comparison) ───────────
    // We normally exclude password, but here we need it to compare
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      // Use vague message for security — don't reveal which field is wrong
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    // ── Compare password ──────────────────────────────────────
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    // ── Generate token ────────────────────────────────────────
    const token = generateToken(user._id);

    // ── Respond ───────────────────────────────────────────────
    res.json({
      message: "Login successful!",
      token,
      user: {
        id:         user._id,
        name:       user.name,
        email:      user.email,
        cartCount:  user.cart.length,
        orderCount: user.orders.length
      }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error during login." });
  }
};

/* ── GET /api/auth/me ────────────────────────────────────────────
   Returns the currently logged-in user's profile.
   Requires: Bearer token in Authorization header.
*/
const getMe = async (req, res) => {
  try {
    // req.user is attached by the protect middleware
    const user = await User.findById(req.user._id)
      .populate("orders")  // Include full order details
      .select("-password");

    res.json({ user });
  } catch (err) {
    console.error("Get me error:", err.message);
    res.status(500).json({ error: "Server error fetching profile." });
  }
};

module.exports = { register, login, getMe };
