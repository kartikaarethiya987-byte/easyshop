/* ============================================================
   SHOP EASY – controllers/cartController.js
   Handles cart operations — all routes are protected (JWT required).
   The cart is stored directly on the User document.
   ============================================================ */

const User    = require("../models/User");
const Product = require("../models/Product");

/* ── GET /api/cart ───────────────────────────────────────────────
   Returns the current user's cart.
*/
const getCart = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id).select("cart");

    // Calculate cart totals on the server too
    const itemCount = user.cart.reduce((sum, item) => sum + item.quantity, 0);
    const total     = user.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      cart:      user.cart,
      itemCount,
      total
    });

  } catch (err) {
    console.error("Get cart error:", err.message);
    res.status(500).json({ error: "Server error fetching cart." });
  }
};

/* ── POST /api/cart/add ──────────────────────────────────────────
   Adds a product to the cart, or increases quantity if already there.
   Body: { productId, quantity }
*/
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required." });
    }

    // ── Verify the product exists ─────────────────────────────
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: "Product not found." });
    }

    // ── Find the user ─────────────────────────────────────────
    const user = await User.findById(req.user._id);

    // ── Check if this product is already in cart ──────────────
    const existingIdx = user.cart.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingIdx !== -1) {
      // Product exists — increase quantity
      user.cart[existingIdx].quantity += quantity;
    } else {
      // New cart item — add product snapshot
      user.cart.push({
        productId: product._id,
        name:      product.name,
        price:     product.price,
        image:     product.image,
        category:  product.category,
        quantity:  quantity
      });
    }

    await user.save();

    // Return updated cart count
    const itemCount = user.cart.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      message:   `"${product.name}" added to cart!`,
      cart:      user.cart,
      itemCount
    });

  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID." });
    }
    console.error("Add to cart error:", err.message);
    res.status(500).json({ error: "Server error adding to cart." });
  }
};

/* ── PUT /api/cart/update ────────────────────────────────────────
   Updates the quantity of a specific cart item.
   Body: { productId, quantity }  — set quantity to 0 to remove
*/
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ error: "productId and quantity are required." });
    }

    const user = await User.findById(req.user._id);

    const itemIdx = user.cart.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIdx === -1) {
      return res.status(404).json({ error: "Item not found in cart." });
    }

    if (quantity <= 0) {
      // Remove item if quantity set to 0
      user.cart.splice(itemIdx, 1);
    } else {
      user.cart[itemIdx].quantity = quantity;
    }

    await user.save();

    const itemCount = user.cart.reduce((sum, item) => sum + item.quantity, 0);
    const total     = user.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ message: "Cart updated.", cart: user.cart, itemCount, total });

  } catch (err) {
    console.error("Update cart error:", err.message);
    res.status(500).json({ error: "Server error updating cart." });
  }
};

/* ── DELETE /api/cart/remove/:productId ─────────────────────────
   Removes one item from the cart entirely.
*/
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    const before = user.cart.length;
    user.cart = user.cart.filter(
      item => item.productId.toString() !== productId
    );

    if (user.cart.length === before) {
      return res.status(404).json({ error: "Item not found in cart." });
    }

    await user.save();

    const itemCount = user.cart.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ message: "Item removed from cart.", cart: user.cart, itemCount });

  } catch (err) {
    console.error("Remove from cart error:", err.message);
    res.status(500).json({ error: "Server error removing from cart." });
  }
};

/* ── DELETE /api/cart/clear ──────────────────────────────────────
   Empties the entire cart (called after checkout).
*/
const clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json({ message: "Cart cleared.", cart: [], itemCount: 0 });
  } catch (err) {
    console.error("Clear cart error:", err.message);
    res.status(500).json({ error: "Server error clearing cart." });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
