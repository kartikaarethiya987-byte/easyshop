/* ================================================================
   SHOP EASY  –  script.js
   Pure localStorage, zero backend, zero OTP.

   ┌─────────────────────────────────────────────────────────────┐
   │  SECTION MAP                                                │
   │   1. Storage Keys                                           │
   │   2. Seed Data        (admin + 8 sample products)           │
   │   3. User Helpers     (register / login / logout / session) │
   │   4. Product Helpers  (CRUD)                                │
   │   5. Cart Helpers     (per-user, stock-checked)             │
   │   6. Order Helpers                                          │
   │   7. UI Helpers       (toast / stars / price / loader)      │
   │   8. Navbar           (dynamic login state)                 │
   │   9. Product Card     (shared HTML builder)                 │
   │  10. Index Page       (renderProducts / filter / search)    │
   │  11. Product Page     (renderProductPage)                   │
   │  12. Cart Page        (renderCartPage / renderCartSummary)  │
   │  13. Orders Page      (renderOrdersPage)                    │
   │  14. Admin Page       (CRUD, stats, user list)              │
   │  15. Page Protection  (protectPage / protectAdminPage)      │
   │  16. Payment Modal    (4-step UPI | Card | COD)             │
   │  17. Form Validation  (helpers)                             │
   └─────────────────────────────────────────────────────────────┘
   ================================================================ */


/* ================================================================
   SECTION 1 – STORAGE KEYS
   Centralise every key name so a typo in one place is
   caught immediately and never silently breaks storage.
   ================================================================ */
const KEYS = {
  USERS:    "se_users",     // JSON array of user objects
  SESSION:  "se_session",   // email string of logged-in user
  PRODUCTS: "se_products",  // JSON array of product objects
};


/* ================================================================
   SECTION 2 – SEED DEFAULT DATA
   Called on every page load.  Only creates data that is absent,
   so it is completely safe to call multiple times.
   ================================================================ */
function seedDefaultData() {

  /* ── Default admin account ─────────────────────────────────── */
  const users       = getAllUsers();
  const adminExists = users.some(u => u.email === "admin@example.com");
  if (!adminExists) {
    users.push({
      id:        "admin-001",
      name:      "Admin",
      email:     "admin@example.com",
      password:  "123456",        // demo only – never do this in production
      isAdmin:   true,
      addresses: [],              // saved delivery addresses
      cart:      [],
      orders:    []
    });
    saveAllUsers(users);
  }

  /* ── 8 sample products (only on very first visit) ───────────── */
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    const defaults = [
      {
        id: "p1", name: "Wireless Noise-Cancelling Headphones",
        category: "Electronics", price: 2999, originalPrice: 4999,
        discount: 40, rating: 4.5, reviews: 1243, badge: "sale", stock: 25,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        description: "Crystal-clear audio with 40 dB ANC, 30 hr battery and USB-C fast charge.",
        features: ["30-hr battery", "ANC", "Bluetooth 5.3", "USB-C", "Foldable"]
      },
      {
        id: "p2", name: "Men's Classic White Sneakers",
        category: "Fashion", price: 1499, originalPrice: 2499,
        discount: 40, rating: 4.3, reviews: 876, badge: "hot", stock: 40,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        description: "Premium vegan leather, lightweight EVA sole, available in sizes 6–12.",
        features: ["Vegan Leather", "EVA Sole", "Sizes 6–12", "Unisex Fit"]
      },
      {
        id: "p3", name: "Stainless Steel Water Bottle 1 L",
        category: "Sports", price: 499, originalPrice: 799,
        discount: 38, rating: 4.7, reviews: 3312, badge: "best", stock: 100,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
        description: "Double-wall vacuum insulation – cold 24 h, hot 12 h.  BPA-free.",
        features: ["24 hr Cold", "BPA Free", "1 Litre", "Leak-proof"]
      },
      {
        id: "p4", name: "Organic Face Moisturiser SPF 50",
        category: "Beauty", price: 849, originalPrice: 1299,
        discount: 35, rating: 4.4, reviews: 568, badge: "new", stock: 60,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
        description: "Broad-spectrum SPF 50 with aloe vera, hyaluronic acid and green tea.",
        features: ["SPF 50", "Organic", "Non-Comedogenic", "50 ml"]
      },
      {
        id: "p5", name: "Non-Stick Cookware Set (5-piece)",
        category: "Home & Kitchen", price: 3499, originalPrice: 5499,
        discount: 36, rating: 4.6, reviews: 2041, badge: "sale", stock: 20,
        image: "https://images.unsplash.com/photo-1584786996374-80dfa87e2c3f?w=600&q=80",
        description: "PFOA-free ceramic coating.  Works on induction, gas and electric hobs.",
        features: ["5-piece Set", "PFOA-Free", "Induction Safe", "Oven Safe 220 °C"]
      },
      {
        id: "p6", name: "Portable Bluetooth Speaker",
        category: "Electronics", price: 1799, originalPrice: 2999,
        discount: 40, rating: 4.2, reviews: 730, badge: "hot", stock: 35,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
        description: "360° sound, IPX7 waterproof, 20 hr battery, also works as a power bank.",
        features: ["IPX7 Waterproof", "360° Sound", "20 hr Battery", "Power Bank"]
      },
      {
        id: "p7", name: "Women's Floral Kurti",
        category: "Fashion", price: 699, originalPrice: 1299,
        discount: 46, rating: 4.5, reviews: 1875, badge: "new", stock: 75,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4d2f?w=600&q=80",
        description: "Breathable Rayon fabric, A-line fit, machine washable, sizes S–3XL.",
        features: ["Rayon Fabric", "A-Line Fit", "Machine Washable", "S–3XL"]
      },
      {
        id: "p8", name: "Yoga Mat Anti-Slip 6 mm",
        category: "Sports", price: 599, originalPrice: 999,
        discount: 40, rating: 4.8, reviews: 4105, badge: "best", stock: 55,
        image: "https://images.unsplash.com/photo-1601925228523-e22ac7aaf2a0?w=600&q=80",
        description: "6 mm TPE foam with dual-side grip, carry strap, eco-friendly materials.",
        features: ["6 mm Thick", "Dual-side Grip", "TPE Foam", "Carry Strap"]
      }
    ];
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(defaults));
  }
}


/* ================================================================
   SECTION 3 – USER HELPERS
   ================================================================ */

/** Read the full users array from localStorage. */
function getAllUsers() {
  const raw = localStorage.getItem(KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

/** Persist the full users array. */
function saveAllUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

/** Find one user by email (case-insensitive).  Returns object or null. */
function findUserByEmail(email) {
  return getAllUsers().find(
    u => u.email.toLowerCase() === email.toLowerCase()
  ) || null;
}

/** Replace one user in the array and persist. */
function saveOneUser(updated) {
  const users = getAllUsers();
  const idx   = users.findIndex(u => u.email === updated.email);
  if (idx !== -1) { users[idx] = updated; saveAllUsers(users); }
}

/* ── REGISTER ───────────────────────────────────────────────── */
/**
 * Saves a new user.
 * Returns { success: true } or { success: false, message }.
 * No email verification step – account is immediately usable.
 */
function registerUser(name, email, password) {
  if (findUserByEmail(email)) {
    return { success: false, message: "This email is already registered. Please log in." };
  }
  const users = getAllUsers();
  users.push({
    id:        "u-" + Date.now(),
    name:      name.trim(),
    email:     email.toLowerCase().trim(),
    password:  password,       // plain-text – demo only
    isAdmin:   false,
    addresses: [],              // saved delivery addresses
    cart:      [],
    orders:    []
  });
  saveAllUsers(users);
  return { success: true };
}

/* ── LOGIN ──────────────────────────────────────────────────── */
/**
 * Validates credentials and creates a session.
 * Returns { success, name, isAdmin } or { success: false, message }.
 */
function loginUser(email, password) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return { success: false, message: "Incorrect email or password." };
  }
  localStorage.setItem(KEYS.SESSION, user.email);
  return { success: true, name: user.name, isAdmin: user.isAdmin };
}

/* ── LOGOUT ─────────────────────────────────────────────────── */
function logoutUser() {
  localStorage.removeItem(KEYS.SESSION);
  window.location.href = "index.html";
}

/* ── SESSION HELPERS ────────────────────────────────────────── */
/** Returns the full user object for whoever is logged in, or null. */
function getCurrentUser() {
  const email = localStorage.getItem(KEYS.SESSION);
  if (!email) return null;
  return findUserByEmail(email);
}

/** True when a user session exists. */
function isLoggedIn() { return !!getCurrentUser(); }

/** True when the current user has isAdmin = true. */
function isAdmin() {
  const u = getCurrentUser();
  return u ? !!u.isAdmin : false;
}

/**
 * loginAndRedirect(email, password)
 * Authenticates, then navigates to the saved se_redirect path
 * (set by protectPage) or to the appropriate home page.
 * Returns the login result object so the caller can show errors.
 */
function loginAndRedirect(email, password) {
  const result = loginUser(email, password);
  if (!result.success) return result;

  const saved = localStorage.getItem("se_redirect");
  localStorage.removeItem("se_redirect");
  window.location.href = saved || (result.isAdmin ? "admin.html" : "index.html");
  return result; // unreachable but keeps linters happy
}

/**
 * handleRedirectAfterLogin()
 * Call this on index.html after seedDefaultData().
 * Shows a toast when a non-admin was bounced from admin.html.
 */
function handleRedirectAfterLogin() {
  if (localStorage.getItem("se_access_denied")) {
    localStorage.removeItem("se_access_denied");
    showToast("Admin access required.", "error");
  }
}


/* ================================================================
   SECTION 4 – PRODUCT HELPERS (CRUD)
   ================================================================ */

function getAllProducts() {
  const raw = localStorage.getItem(KEYS.PRODUCTS);
  return raw ? JSON.parse(raw) : [];
}

function saveAllProducts(products) {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
}

function getProductById(id) {
  return getAllProducts().find(p => p.id === id) || null;
}

/* ── Admin: Add ─────────────────────────────────────────────── */
function adminAddProduct(data) {
  const products = getAllProducts();
  products.push({
    id:            "p-" + Date.now(),
    name:          data.name.trim(),
    category:      data.category,
    price:         Number(data.price),
    originalPrice: Number(data.originalPrice) || Number(data.price),
    discount:      Number(data.discount) || 0,
    rating:        Number(data.rating)   || 0,
    reviews:       Number(data.reviews)  || 0,
    badge:         data.badge || "new",
    stock:         Number(data.stock) || 0,
    image:         (data.image || "").trim() || "https://via.placeholder.com/400",
    description:   (data.description || "").trim(),
    features:      data.features
      ? String(data.features).split(",").map(f => f.trim()).filter(Boolean)
      : []
  });
  saveAllProducts(products);
}

/* ── Admin: Edit ────────────────────────────────────────────── */
function adminEditProduct(id, data) {
  const products = getAllProducts();
  const idx      = products.findIndex(p => p.id === id);
  if (idx === -1) return false;
  products[idx] = {
    ...products[idx],
    name:          data.name.trim(),
    category:      data.category,
    price:         Number(data.price),
    originalPrice: Number(data.originalPrice) || Number(data.price),
    discount:      Number(data.discount) || 0,
    rating:        Number(data.rating)   || products[idx].rating,
    reviews:       Number(data.reviews)  || products[idx].reviews,
    badge:         data.badge || products[idx].badge,
    stock:         Number(data.stock),
    image:         (data.image || "").trim() || products[idx].image,
    description:   (data.description || "").trim(),
    features:      data.features
      ? String(data.features).split(",").map(f => f.trim()).filter(Boolean)
      : products[idx].features
  };
  saveAllProducts(products);
  return true;
}

/* ── Admin: Delete ──────────────────────────────────────────── */
function adminDeleteProduct(id) {
  saveAllProducts(getAllProducts().filter(p => p.id !== id));
}

/** Decrease a product's stock by qty after a successful purchase. */
function reduceStock(productId, qty) {
  const products = getAllProducts();
  const p        = products.find(p => p.id === productId);
  if (p) { p.stock = Math.max(0, p.stock - qty); saveAllProducts(products); }
}


/* ================================================================
   SECTION 5 – CART HELPERS (per-user)
   ================================================================ */

function getCart() {
  const user = getCurrentUser();
  return user ? (user.cart || []) : [];
}

function saveCart(cart) {
  const user = getCurrentUser();
  if (!user) return;
  user.cart = cart;
  saveOneUser(user);
}

function addToCart(productId, qty = 1) {
  const product  = getProductById(productId);
  if (!product)  return { success: false, message: "Product not found." };

  const cart     = getCart();
  const existing = cart.find(i => i.productId === productId);
  const inCart   = existing ? existing.quantity : 0;

  if (inCart + qty > product.stock) {
    return { success: false, message: `Only ${product.stock - inCart} left in stock.` };
  }

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      productId,
      name:     product.name,
      price:    product.price,
      image:    product.image,
      category: product.category,
      quantity: qty
    });
  }
  saveCart(cart);
  updateCartBadge();
  return { success: true };
}

function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.productId !== productId));
  updateCartBadge();
}

function changeCartQty(productId, delta) {
  const cart    = getCart();
  const item    = cart.find(i => i.productId === productId);
  if (!item) return;

  const product = getProductById(productId);
  const newQty  = item.quantity + delta;

  if (newQty <= 0) {
    saveCart(cart.filter(i => i.productId !== productId));
  } else {
    if (product && newQty > product.stock) {
      showToast(`Only ${product.stock} in stock.`, "error");
      return;
    }
    item.quantity = newQty;
    saveCart(cart);
  }
  updateCartBadge();
  renderCartPage();
}

function getCartTotal()     { return getCart().reduce((s, i) => s + i.price * i.quantity, 0); }
function getCartItemCount() { return getCart().reduce((s, i) => s + i.quantity, 0); }


/* ================================================================
   SECTION 6 – ORDER HELPERS
   ================================================================ */

/** All orders for the current user, newest-first. */
function getUserOrders() {
  const user = getCurrentUser();
  return user ? (user.orders || []) : [];
}


/* ================================================================
   SECTION 7 – UI HELPERS
   ================================================================ */

function formatPrice(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric"
  });
}

function buildStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  let s = "";
  for (let i = 0; i < full;  i++) s += '<i class="fa-solid fa-star"></i>';
  if (half)                        s += '<i class="fa-solid fa-star-half-stroke"></i>';
  for (let i = 0; i < empty; i++) s += '<i class="fa-regular fa-star"></i>';
  return s;
}

function updateCartBadge() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  el.textContent = getCartItemCount();
  el.classList.remove("bump");
  void el.offsetWidth; // reflow
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 300);
}

let _toastTimer = null;
function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  const span  = document.getElementById("toastMsg");
  if (!toast || !span) return;
  span.textContent = msg;
  toast.className  = `toast toast--${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function stockBadgeHTML(stock) {
  if (stock <= 0) return `<span class="stock-badge stock-badge--out">Out of Stock</span>`;
  if (stock <= 5) return `<span class="stock-badge stock-badge--low">Only ${stock} left</span>`;
  return `<span class="stock-badge stock-badge--ok">In Stock (${stock})</span>`;
}

/** Fade out and remove the #pageLoader overlay. */
function hideLoader() {
  const el = document.getElementById("pageLoader");
  if (el) { el.classList.add("hidden"); setTimeout(() => el.remove(), 450); }
}


/* ================================================================
   SECTION 8 – NAVBAR AUTH RENDERER
   ================================================================ */
function renderNavAuth() {
  const container = document.getElementById("navAuth");
  if (!container) return;

  const user = getCurrentUser();

  if (user) {
    /* ── Logged in: show user chip + dropdown ─────────────────── */
    container.innerHTML = `
      <div class="nav-user-menu" id="navUserMenu">
        <button class="nav-user-chip" id="userMenuToggle" aria-expanded="false">
          <i class="fa-solid fa-circle-user"></i>
          <span>${user.name.split(" ")[0]}</span>
          <i class="fa-solid fa-chevron-down nav-chevron"></i>
        </button>
        <div class="nav-user-dropdown" id="userDropdown">
          <div class="dropdown-header">
            <p class="dropdown-name">${user.name}</p>
            <p class="dropdown-email">${user.email}</p>
            ${user.isAdmin
              ? '<span class="dropdown-admin-badge"><i class="fa-solid fa-shield-halved"></i> Admin</span>'
              : ""}
          </div>
          <div class="dropdown-divider"></div>
          <a href="orders.html" class="dropdown-item">
            <i class="fa-solid fa-box-open"></i> My Orders
            ${user.orders.length > 0
              ? `<span class="dropdown-badge">${user.orders.length}</span>`
              : ""}
          </a>
          ${user.isAdmin
            ? `<a href="admin.html" class="dropdown-item dropdown-item--admin">
                 <i class="fa-solid fa-screwdriver-wrench"></i> Admin Panel
               </a>`
            : ""}
          <div class="dropdown-divider"></div>
          <button class="dropdown-item dropdown-item--danger" onclick="logoutUser()">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>
    `;
    /* Dropdown toggle */
    const toggle   = document.getElementById("userMenuToggle");
    const dropdown = document.get
