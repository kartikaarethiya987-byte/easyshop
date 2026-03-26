/* ============================================================
   SHOP EASY – models/Order.js
   Mongoose schema and model for orders.
   ============================================================ */

const mongoose = require("mongoose");

// ── Ordered item sub-schema ───────────────────────────────────
// A snapshot of the product at time of purchase
const orderedItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "Product"
    },
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    image:    { type: String },
    category: { type: String },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

// ── Main Order schema ─────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    // Which user placed this order
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true
    },

    // A friendly human-readable order ID (e.g. "ORD-1703001234567")
    orderId: {
      type:   String,
      unique: true
    },

    // Snapshot of items at checkout time
    items: {
      type:     [orderedItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message:   "Order must have at least one item"
      }
    },

    // Pricing breakdown
    subtotal:    { type: Number, required: true },
    delivery:    { type: Number, default: 0 },
    discount:    { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Order lifecycle status
    status: {
      type:    String,
      enum:    ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Delivered"  // Demo: auto-deliver immediately
    },

    // Delivery address (optional – can be added later)
    shippingAddress: {
      street:  String,
      city:    String,
      state:   String,
      pincode: String
    }
  },
  {
    timestamps: true  // createdAt = order date
  }
);

// ── Auto-generate orderId before saving ──────────────────────
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = "ORD-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
