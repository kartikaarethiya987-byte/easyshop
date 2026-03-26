/* ============================================================
   SHOP EASY – config/seed.js
   Populates the database with sample products.

   Run with:  npm run seed
   ============================================================ */

const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const Product  = require("../models/Product");

dotenv.config();

// ── Sample product data ───────────────────────────────────────
const sampleProducts = [
  {
    name:          "Wireless Noise-Cancelling Headphones",
    category:      "Electronics",
    price:         2999,
    originalPrice: 4999,
    discount:      40,
    rating:        4.5,
    reviews:       1243,
    badge:         "sale",
    image:         "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    description:   "Immerse yourself in crystal-clear audio with 40dB active noise cancellation. Up to 30 hours of playtime with fast charging. Foldable with premium memory foam ear cushions.",
    features:      ["30-hr battery", "ANC Technology", "Bluetooth 5.3", "USB-C Charging", "Foldable Design"],
    stock:         50
  },
  {
    name:          "Men's Classic White Sneakers",
    category:      "Fashion",
    price:         1499,
    originalPrice: 2499,
    discount:      40,
    rating:        4.3,
    reviews:       876,
    badge:         "hot",
    image:         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    description:   "Timeless white sneakers crafted from premium vegan leather. Lightweight EVA sole for all-day comfort.",
    features:      ["Vegan Leather", "EVA Sole", "Sizes 6–12", "Hand-washable", "Unisex Fit"],
    stock:         80
  },
  {
    name:          "Stainless Steel Water Bottle 1L",
    category:      "Sports",
    price:         499,
    originalPrice: 799,
    discount:      38,
    rating:        4.7,
    reviews:       3312,
    badge:         "best",
    image:         "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    description:   "Double-walled vacuum insulation. Cold for 24 hours, hot for 12 hours. BPA-free, 1 litre capacity.",
    features:      ["24hr Cold / 12hr Hot", "BPA Free", "1 Litre", "Leak-proof Lid", "Food-grade Steel"],
    stock:         200
  },
  {
    name:          "Organic Face Moisturiser SPF50",
    category:      "Beauty",
    price:         849,
    originalPrice: 1299,
    discount:      35,
    rating:        4.4,
    reviews:       568,
    badge:         "new",
    image:         "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
    description:   "Lightweight daily moisturiser with broad-spectrum SPF 50. Organic aloe vera, hyaluronic acid, green tea. All skin types.",
    features:      ["SPF 50", "Organic Ingredients", "All Skin Types", "Non-Comedogenic", "50ml"],
    stock:         120
  },
  {
    name:          "Non-Stick Cookware Set (5-piece)",
    category:      "Home & Kitchen",
    price:         3499,
    originalPrice: 5499,
    discount:      36,
    rating:        4.6,
    reviews:       2041,
    badge:         "sale",
    image:         "https://images.unsplash.com/photo-1584786996374-80dfa87e2c3f?w=600&q=80",
    description:   "Professional-grade PFOA-free non-stick set. Induction, gas, and electric compatible. Oven safe to 220°C.",
    features:      ["5-piece Set", "PFOA-Free", "Induction Safe", "Oven Safe 220°C", "Dishwasher Safe"],
    stock:         40
  },
  {
    name:          "Portable Bluetooth Speaker",
    category:      "Electronics",
    price:         1799,
    originalPrice: 2999,
    discount:      40,
    rating:        4.2,
    reviews:       730,
    badge:         "hot",
    image:         "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    description:   "360° immersive sound in an IPX7 waterproof body. 20-hour battery, built-in power bank.",
    features:      ["IPX7 Waterproof", "360° Sound", "20hr Battery", "Power Bank Mode", "TWS Pairing"],
    stock:         70
  },
  {
    name:          "Women's Floral Kurti",
    category:      "Fashion",
    price:         699,
    originalPrice: 1299,
    discount:      46,
    rating:        4.5,
    reviews:       1875,
    badge:         "new",
    image:         "https://images.unsplash.com/photo-1594938298603-c8148c4b4d2f?w=600&q=80",
    description:   "Elegant floral print kurti in breathable Rayon. A-line fit, 3/4 sleeves, mandarin collar. Machine washable.",
    features:      ["Rayon Fabric", "A-Line Fit", "3/4 Sleeves", "Machine Washable", "S to 3XL"],
    stock:         150
  },
  {
    name:          "Yoga Mat Anti-Slip 6mm",
    category:      "Sports",
    price:         599,
    originalPrice: 999,
    discount:      40,
    rating:        4.8,
    reviews:       4105,
    badge:         "best",
    image:         "https://images.unsplash.com/photo-1601925228523-e22ac7aaf2a0?w=600&q=80",
    description:   "Premium 6mm TPE foam with double-sided non-slip. Includes carry strap and alignment guide. Eco-friendly.",
    features:      ["6mm Thickness", "Double-side Non-slip", "TPE Foam", "Carry Strap Included", "Eco-Friendly"],
    stock:         100
  }
];

// ── Seed function ─────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  MongoDB connected");

    // Clear existing products first
    await Product.deleteMany({});
    console.log("🗑️   Cleared existing products");

    // Insert all sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`🌱  Seeded ${inserted.length} products successfully`);

    // Print product IDs so frontend can reference them
    inserted.forEach(p => {
      console.log(`   • ${p.name} → _id: ${p._id}`);
    });

  } catch (err) {
    console.error("❌  Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("📡  MongoDB disconnected");
    process.exit(0);
  }
};

seedDatabase();
