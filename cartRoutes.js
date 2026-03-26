/* ============================================================
   SHOP EASY – routes/cartRoutes.js
   All cart routes require a valid JWT token (protect middleware).
   ============================================================ */

const express    = require("express");
const router     = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart
} = require("../controllers/cartController");

// All routes below this line require authentication
router.use(protect);

// GET    /api/cart                     → get user's cart
router.get("/", getCart);

// POST   /api/cart/add                 → add item { productId, quantity }
router.post("/add", addToCart);

// PUT    /api/cart/update              → update item quantity { productId, quantity }
router.put("/update", updateCartItem);

// DELETE /api/cart/remove/:productId   → remove one item
router.delete("/remove/:productId", removeFromCart);

// DELETE /api/cart/clear               → empty cart
router.delete("/clear", clearCart);

module.exports = router;
