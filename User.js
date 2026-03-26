/* ============================================================
   SHOP EASY – models/User.js
   Mongoose schema and model for user accounts.
   ============================================================ */

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

// ── Cart item sub-schema ──────────────────────────────────────
// Each item stored inside a user's cart array
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "Product",
      required: true
    },
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    image:    { type: String },
    category: { type: String },
    quantity: { type: Number, required: true, min: 1, default: 1 }
  },
  { _id: false } // Don't create a separate _id for each cart item
);

// ── Main User schema ──────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,          // One account per email
      lowercase: true,          // Always store as lowercase
      trim:      true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    password: {
      type:     String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    cart:   { type: [cartItemSchema], default: [] },  // User's shopping cart
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]  // Order refs
  },
  {
    timestamps: true  // Adds createdAt and updatedAt automatically
  }
);

// ── Pre-save hook: hash password before saving ────────────────
// This runs automatically every time a user is saved/updated
userSchema.pre("save", async function (next) {
  // Only hash if password field was actually modified
  if (!this.isModified("password")) return next();

  try {
    const salt    = await bcrypt.genSalt(12); // 12 rounds = good balance of speed vs security
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ── Instance method: compare password ────────────────────────
// Usage: const isMatch = await user.comparePassword(plainTextPassword)
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// ── Remove password from JSON responses ──────────────────────
// When we call res.json(user), password won't be included
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
