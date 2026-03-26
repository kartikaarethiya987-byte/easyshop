/* ============================================================
   SHOP EASY – routes/productRoutes.js
   ============================================================ */

const express    = require("express");
const router     = express.Router();
const { getAllProducts, getProductById } = require("../controllers/productController");

// GET /api/products        → all products (supports ?category= and ?search=)
router.get("/", getAllProducts);

// GET /api/products/:id    → single product by MongoDB _id
router.get("/:id", getProductById);

module.exports = router;
