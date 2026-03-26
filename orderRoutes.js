/* ============================================================
   SHOP EASY – routes/orderRoutes.js
   All order routes require a valid JWT token.
   ============================================================ */

const express    = require("express");
const router     = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createOrder, getUserOrders, getOrderById } = require("../controllers/orderController");

// All routes protected
router.use(protect);

// POST /api/orders          → checkout: create order from cart
router.post("/", createOrder);

// GET  /api/orders          → get all orders for logged-in user
router.get("/", getUserOrders);

// GET  /api/orders/:id      → get single order detail
router.get("/:id", getOrderById);

module.exports = router;
