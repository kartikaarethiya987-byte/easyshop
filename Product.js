/* ============================================================
   SHOP EASY – models/Product.js
   Mongoose schema and model for products.
   ============================================================ */

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Product name is required"],
      trim:     true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Electronics", "Fashion", "Sports", "Beauty", "Home & Kitchen"]
    },
    price: {
      type:     Number,
      required: [true, "Price is required"],
      min:      [0, "Price cannot be negative"]
    },
    originalPrice: {
      type: Number,
      min:  0
    },
    discount: {
      type:    Number,
      default: 0,
      min:     0,
      max:     100
    },
    rating: {
      type:    Number,
      default: 0,
      min:     0,
      max:     5
    },
    reviews: {
      type:    Number,
      default: 0
    },
    badge: {
      type:    String,
      enum:    ["sale", "new", "hot", "best"],
      default: "new"
    },
    image: {
      type:    String,
      default: "https://via.placeholder.com/400"
    },
    description: {
      type:    String,
      default: ""
    },
    features: {
      type:    [String],
      default: []
    },
    stock: {
      type:    Number,
      default: 100,
      min:     0
    },
    isActive: {
      type:    Boolean,
      default: true   // Can hide products without deleting them
    }
  },
  {
    timestamps: true
  }
);

// ── Index for faster searches ─────────────────────────────────
productSchema.index({ name: "text", description: "text" }); // Full-text search
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model("Product", productSchema);
