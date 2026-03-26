/* ============================================================
   SHOP EASY – controllers/productController.js
   Handles fetching products from MongoDB.
   ============================================================ */

const Product = require("../models/Product");

/* ── GET /api/products ───────────────────────────────────────────
   Returns all active products.
   Supports optional query params:
     ?category=Electronics
     ?search=headphones
*/
const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Build a filter object dynamically
    const filter = { isActive: true };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      // Case-insensitive partial match on name or description
      filter.$or = [
        { name:        { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }); // Newest first

    res.json({
      count:    products.length,
      products
    });

  } catch (err) {
    console.error("Get products error:", err.message);
    res.status(500).json({ error: "Server error fetching products." });
  }
};

/* ── GET /api/products/:id ───────────────────────────────────────
   Returns a single product by its MongoDB _id.
*/
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ product });

  } catch (err) {
    // Invalid MongoDB ObjectId format
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID." });
    }
    console.error("Get product error:", err.message);
    res.status(500).json({ error: "Server error fetching product." });
  }
};

module.exports = { getAllProducts, getProductById };
