/* ================================================================
   SHOP EASY – script.js  (Final — OTP + Payment + Admin System)
   Pure localStorage, no backend.

   SECTION MAP
   ──────────────────────────────────────────────────────────────
    1.  STORAGE KEYS
    2.  EMAIL JS CONFIG      ← NEW: OTP via real email
    3.  SEED DATA            (admin + 8 products)
    4.  USER HELPERS         (register, login, logout, session)
    5.  OTP SYSTEM           ← NEW: generate, send, verify, timer
    6.  PRODUCT HELPERS      (CRUD in localStorage)
    7.  CART HELPERS         (per-user, stock check)
    8.  ORDER HELPERS        (checkout → order)
    9.  UI HELPERS           (toast, stars, price, date, loader)
   10.  NAVBAR               (dynamic auth state)
   11.  PRODUCT CARD         (shared HTML builder)
   12.  INDEX PAGE           (renderProducts, filter, search)
   13.  PRODUCT PAGE         (renderProductPage)
   14.  CART PAGE            (renderCartPage, renderCartSummary)
   15.  ORDERS PAGE          (renderOrdersPage)
   16.  ADMIN PAGE           (CRUD, stats, user list)
   17.  PAGE PROTECTION      (protectPage, protectAdminPage)
   18.  PAYMENT MODAL        ← FULL: UPI | Card | COD 4-step flow
   19.  FORM VALIDATION      (setFieldError, clearAllErrors, etc.)
   ================================================================ */


/* ================================================================
   SECTION 1 – STORAGE KEYS
   One place for every localStorage key name so typos
   never cause silent bugs.
   ================================================================ */
const KEYS = {
  USERS:      "se_users",        // Array of user objects
  SESSION:    "se_session",      // Email string of logged-in user
  PRODUCTS:   "se_products",     // Array of product objects
  OTP_CODE:   "se_otp_code",     // 6-digit OTP (string)
  OTP_EMAIL:  "se_otp_email",    // Email the OTP was sent to
  OTP_EXPIRY: "se_otp_expiry",   // Unix timestamp OTP expires at
};


/* ================================================================
   SECTION 2 – EMAILJS CONFIGURATION
   ──────────────────────────────────────────────────────────────
   HOW TO SET UP (takes ~5 minutes, free):

   1. Go to https://www.emailjs.com/ → Sign Up (free)
   2. Dashboard → Email Services → Add Service (Gmail / Outlook)
      → Copy your SERVICE ID (e.g. "service_abc123")
   3. Dashboard → Email Templates → Create Template
      Subject:  Your ShopEasy OTP Code
      Body:     Hi, your OTP is: {{otp}}
                It expires in 10 minutes.
      To email: {{to_email}}
      → Save → Copy your TEMPLATE ID (e.g. "template_xyz789")
   4. Dashboard → Account → Public Key
      → Copy your PUBLIC KEY (e.g. "AbCdEfGhIjKlMnOp")
   5. Replace the three placeholder strings below with your values.

   IMPORTANT: The EmailJS CDN <script> tag must be included in
   register.html BEFORE script.js.  It is already there in the
   updated register.html.
   ================================================================ */
const EMAILJS_CONFIG = {
  PUBLIC_KEY:  "hiDiNzekaDSY9SJff",       // ← Replace with your Public Key
  SERVICE_ID:  "YOUR_SERVICE_ID",       // ← Replace with your Service ID
  TEMPLATE_ID: "YOUR_TEMPLATE_ID",      // ← Replace with your Template ID
};

/* How long an OTP stays valid (milliseconds) */
const OTP_EXPIRY_MS = 10 * 60 * 1000;  // 10 minutes


/* ================================================================
   SECTION 3 – SEED DEFAULT DATA
   Called on every page load.  Only creates data that does not
   already exist, so it is safe to call multiple times.
   ================================================================ */
function seedDefaultData() {

  /* ── Default admin (isVerified = true so they can always log in) */
  let users = getAllUsers();
  const adminExists = users.some(u => u.email === "admin@example.com");
  if (!adminExists) {
    users.push({
      id:         "admin-001",
      name:       "Admin",
      email:      "admin@example.com",
      password:   "123456",
      isAdmin:    true,
      isVerified: true,   // Admin is pre-verified
      cart:       [],
      orders:     []
    });
    saveAllUsers(users);
  }

  /* ── Sample products (only if localStorage has none) ────────── */
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    const defaultProducts = [
      {
        id: "p1", name: "Wireless Noise-Cancelling Headphones",
        category: "Electronics", price: 2999, originalPrice: 4999,
        discount: 40, rating: 4.5, reviews: 1243, badge: "sale", stock: 25,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        description: "Crystal-clear audio, 40dB ANC, 30hr battery, USB-C fast charge.",
        features: ["30-hr battery", "ANC", "Bluetooth 5.3", "USB-C", "Foldable"]
      },
      {
        id: "p2", name: "Men's Classic White Sneakers",
        category: "Fashion", price: 1499, originalPrice: 2499,
        discount: 40, rating: 4.3, reviews: 876, badge: "hot", stock: 40,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        description: "Premium vegan leather, lightweight EVA sole, sizes 6–12.",
        features: ["Vegan Leather", "EVA Sole", "Sizes 6–12", "Unisex"]
      },
      {
        id: "p3", name: "Stainless Steel Water Bottle 1L",
        category: "Sports", price: 499, originalPrice: 799,
        discount: 38, rating: 4.7, reviews: 3312, badge: "best", stock: 100,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
        description: "Cold 24h, hot 12h. BPA-free, leak-proof.",
        features: ["24hr Cold", "BPA Free", "1L", "Leak-proof"]
      },
      {
        id: "p4", name: "Organic Face Moisturiser SPF50",
        category: "Beauty", price: 849, originalPrice: 1299,
        discount: 35, rating: 4.4, reviews: 568, badge: "new", stock: 60,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
        description: "SPF50, aloe vera, hyaluronic acid. All skin types.",
        features: ["SPF 50", "Organic", "Non-Comedogenic", "50ml"]
      },
      {
        id: "p5", name: "Non-Stick Cookware Set (5-piece)",
        category: "Home & Kitchen", price: 3499, originalPrice: 5499,
        discount: 36, rating: 4.6, reviews: 2041, badge: "sale", stock: 20,
        image: "https://images.unsplash.com/photo-1584786996374-80dfa87e2c3f?w=600&q=80",
        description: "PFOA-free ceramic coating. Induction, gas & electric.",
        features: ["5-piece", "PFOA-Free", "Induction", "Oven Safe 220°C"]
      },
      {
        id: "p6", name: "Portable Bluetooth Speaker",
        category: "Electronics", price: 1799, originalPrice: 2999,
        discount: 40, rating: 4.2, reviews: 730, badge: "hot", stock: 35,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
        description: "360° sound, IPX7 waterproof, 20hr battery, power bank.",
        features: ["IPX7", "360° Sound", "20hr", "Power Bank"]
      },
      {
        id: "p7", name: "Women's Floral Kurti",
        category: "Fashion", price: 699, originalPrice: 1299,
        discount: 46, rating: 4.5, reviews: 1875, badge: "new", stock: 75,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4d2f?w=600&q=80",
        description: "Breathable Rayon, A-line fit, machine washable.",
        features: ["Rayon", "A-Line", "Machine Washable", "S–3XL"]
      },
      {
        id: "p8", name: "Yoga Mat Anti-Slip 6mm",
        category: "Sports", price: 599, originalPrice: 999,
        discount: 40, rating: 4.8, reviews: 4105, badge: "best", stock: 55,
        image: "https://images.unsplash.com/photo-1601925228523-e22ac7aaf2a0?w=600&q=80",
        description: "6mm TPE foam, carry strap included, eco-friendly.",
        features: ["6mm", "Non-slip", "TPE Foam", "Carry Strap"]
      }
    ];
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }
}


/* ================================================================
   SECTION 4 – USER HELPERS
   ================================================================ */

/** Read entire users array from localStorage */
function getAllUsers() {
  const raw = localStorage.getItem(KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

/** Write entire users array back to localStorage */
function saveAllUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

/** Find one user by email (case-insensitive). Returns user or null. */
function findUserByEmail(email) {
  return getAllUsers().find(
    u => u.email.toLowerCase() === email.toLowerCase()
  ) || null;
}

/** Update one user in the array and persist. */
function saveOneUser(updatedUser) {
  const users = getAllUsers();
  const idx   = users.findIndex(u => u.email === updatedUser.email);
  if (idx !== -1) { users[idx] = updatedUser; saveAllUsers(users); }
}

/* ── REGISTER ──────────────────────────────────────────────────── */
/**
 * Creates a new, UNVERIFIED user in localStorage.
 * Returns { success: true } or { success: false, message }.
 */
function registerUser(name, email, password) {
  if (findUserByEmail(email)) {
    return { success: false, message: "This email is already registered. Please log in." };
  }
  const users = getAllUsers();
  users.push({
    id:         "u-" + Date.now(),
    name:       name.trim(),
    email:      email.toLowerCase().trim(),
    password:   password,
    isAdmin:    false,
    isVerified: false,    // ← Must verify email before logging in
    cart:       [],
    orders:     []
  });
  saveAllUsers(users);
  return { success: true };
}

/* ── LOGIN ─────────────────────────────────────────────────────── */
/**
 * Validates credentials AND checks isVerified flag.
 * Returns { success, name, isAdmin } or { success: false, message }.
 */
function loginUser(email, password) {
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return { success: false, message: "Incorrect email or password." };
  }

  /* Reject login if account has not been OTP-verified */
  if (!user.isVerified) {
    return {
      success: false,
      message: "Email not verified. Please complete OTP verification first.",
      needsVerification: true   // flag so the UI can show the right hint
    };
  }

  localStorage.setItem(KEYS.SESSION, user.email);
  return { success: true, name: user.name, isAdmin: user.isAdmin };
}

/* ── LOGOUT ────────────────────────────────────────────────────── */
function logoutUser() {
  localStorage.removeItem(KEYS.SESSION);
  window.location.href = "index.html";
}

/* ── SESSION HELPERS ───────────────────────────────────────────── */

/** Returns the full user object for whoever is logged in, or null. */
function getCurrentUser() {
  const email = localStorage.getItem(KEYS.SESSION);
  if (!email) return null;
  return findUserByEmail(email);
}

/** True if a user is currently logged in. */
function isLoggedIn() { return !!getCurrentUser(); }

/** True if the current user has isAdmin = true. */
function isAdmin() {
  const u = getCurrentUser();
  return u ? !!u.isAdmin : false;
}


/* ================================================================
   SECTION 5 – OTP SYSTEM
   ──────────────────────────────────────────────────────────────
   generateOTP()     → makes a 6-digit string
   sendOTP(email)    → generates, stores, and emails the OTP
   verifyOTP(code)   → checks input against stored OTP
   clearOTP()        → removes OTP keys from localStorage
   startOTPTimer()   → runs the 10-min countdown on the register page
   ================================================================ */

/** Create a random 6-digit OTP string, zero-padded. */
function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * sendOTP(email)
 * ─────────────
 * 1. Generates a fresh OTP
 * 2. Saves it to localStorage with a 10-minute expiry timestamp
 * 3. Sends it to the provided email via EmailJS
 *
 * Returns a Promise that resolves/rejects.
 * Callers must await and handle the result.
 */
async function sendOTP(email) {
  const otp    = generateOTP();
  const expiry = Date.now() + OTP_EXPIRY_MS;

  /* Store OTP data */
  localStorage.setItem(KEYS.OTP_CODE,   otp);
  localStorage.setItem(KEYS.OTP_EMAIL,  email.toLowerCase().trim());
  localStorage.setItem(KEYS.OTP_EXPIRY, String(expiry));

  /* Send email via EmailJS */
  const templateParams = {
    to_email: email,
    otp:      otp
  };

  try {
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );
    return { success: true };
  } catch (err) {
    console.error("EmailJS error:", err);
    return { success: false, message: "Failed to send OTP. Check your EmailJS config." };
  }
}

/**
 * verifyOTP(enteredCode, email)
 * ─────────────────────────────
 * Checks:
 *   1. OTP not expired
 *   2. OTP matches the stored code
 *   3. Email matches what the OTP was sent to
 *
 * On success: marks the user as isVerified = true in localStorage.
 * Returns { success, message }.
 */
function verifyOTP(enteredCode, email) {
  const storedCode   = localStorage.getItem(KEYS.OTP_CODE);
  const storedEmail  = localStorage.getItem(KEYS.OTP_EMAIL);
  const expiryStr    = localStorage.getItem(KEYS.OTP_EXPIRY);

  /* Missing data */
  if (!storedCode || !storedEmail || !expiryStr) {
    return { success: false, message: "No OTP found. Please request a new one." };
  }

  /* Expiry check */
  if (Date.now() > parseInt(expiryStr, 10)) {
    clearOTP();
    return { success: false, message: "OTP has expired. Please request a new one.", expired: true };
  }

  /* Email mismatch (shouldn't happen in normal flow, but defensive) */
  if (storedEmail !== email.toLowerCase().trim()) {
    return { success: false, message: "OTP was sent to a different email address." };
  }

  /* Wrong code */
  if (enteredCode.trim() !== storedCode) {
    return { success: false, message: "Incorrect OTP. Please try again." };
  }

  /* ── SUCCESS: mark user as verified ────────────────────────── */
  const user = findUserByEmail(email);
  if (user) {
    user.isVerified = true;
    saveOneUser(user);
  }

  clearOTP();
  return { success: true };
}

/** Remove all OTP-related keys from localStorage. */
function clearOTP() {
  localStorage.removeItem(KEYS.OTP_CODE);
  localStorage.removeItem(KEYS.OTP_EMAIL);
  localStorage.removeItem(KEYS.OTP_EXPIRY);
}

/**
 * startOTPTimer(containerId)
 * ───────────────────────────
 * Shows a countdown timer in the element with id=containerId.
 * When the timer hits zero, it:
 *   • Clears the OTP from localStorage
 *   • Updates the display to "OTP expired"
 *   • Enables the "Resend OTP" button (id="resendOtpBtn") if present
 */
function startOTPTimer(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  /* Stop any previous timer */
  if (window._otpTimerInterval) clearInterval(window._otpTimerInterval);

  const expiryStr = localStorage.getItem(KEYS.OTP_EXPIRY);
  if (!expiryStr) return;

  const expiry = parseInt(expiryStr, 10);

  window._otpTimerInterval = setInterval(function () {
    const remaining = Math.max(0, expiry - Date.now());
    const mins      = Math.floor(remaining / 60000);
    const secs      = Math.floor((remaining % 60000) / 1000);

    if (remaining <= 0) {
      clearInterval(window._otpTimerInterval);
      el.textContent = "OTP expired.";
      el.style.color = "var(--clr-red)";
      clearOTP();

      /* Enable resend button if it exists */
      const resendBtn = document.getElementById("resendOtpBtn");
      if (resendBtn) resendBtn.disabled = false;
    } else {
      el.textContent = "OTP expires in " + mins + ":" + (secs < 10 ? "0" : "") + secs;
      el.style.color = remaining < 60000 ? "var(--clr-red)" : "var(--clr-mid)";
    }
  }, 1000);
}


/* ================================================================
   SECTION 6 – PRODUCT HELPERS (CRUD)
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

/* ── Admin CRUD ──────────────────────────────────────────────── */
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
    stock:         Number(data.stock)    || 0,
    image:         (data.image || "").trim() || "https://via.placeholder.com/400",
    description:   (data.description || "").trim(),
    features: data.features
      ? String(data.features).split(",").map(f => f.trim()).filter(Boolean)
      : []
  });
  saveAllProducts(products);
}

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
    features: data.features
      ? String(data.features).split(",").map(f => f.trim()).filter(Boolean)
      : products[idx].features
  };
  saveAllProducts(products);
  return true;
}

function adminDeleteProduct(id) {
  saveAllProducts(getAllProducts().filter(p => p.id !== id));
}

function reduceStock(productId, qty) {
  const products = getAllProducts();
  const p        = products.find(p => p.id === productId);
  if (p) {
    p.stock = Math.max(0, p.stock - qty);
    saveAllProducts(products);
  }
}


/* ================================================================
   SECTION 7 – CART HELPERS (per-user)
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
  const product = getProductById(productId);
  if (!product) return { success: false, message: "Product not found." };

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
      productId, name: product.name, price: product.price,
      image: product.image, category: product.category, quantity: qty
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
   SECTION 8 – ORDER HELPERS
   ================================================================ */

/** Get all orders for the current user, newest first. */
function getUserOrders() {
  const user = getCurrentUser();
  return user ? (user.orders || []) : [];
}


/* ================================================================
   SECTION 9 – UI HELPERS
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
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  badge.textContent = getCartItemCount();
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);
}

let _toastTimer = null;
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const msg   = document.getElementById("toastMsg");
  if (!toast || !msg) return;
  msg.textContent = message;
  toast.className = `toast toast--${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function stockBadgeHTML(stock) {
  if (stock <= 0)  return `<span class="stock-badge stock-badge--out">Out of Stock</span>`;
  if (stock <= 5)  return `<span class="stock-badge stock-badge--low">Only ${stock} left</span>`;
  return `<span class="stock-badge stock-badge--ok">In Stock (${stock})</span>`;
}

/** Hide the #pageLoader overlay (used on every page). */
function hideLoader() {
  const l = document.getElementById("pageLoader");
  if (l) {
    l.classList.add("hidden");
    setTimeout(() => l.remove(), 450);
  }
}


/* ================================================================
   SECTION 10 – NAVBAR AUTH RENDERER
   ================================================================ */
function renderNavAuth() {
  const container = document.getElementById("navAuth");
  if (!container) return;

  const user = getCurrentUser();

  if (user) {
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

    const toggle   = document.getElementById("userMenuToggle");
    const dropdown = document.getElementById("userDropdown");
    toggle.addEventListener("click", e => {
      e.stopPropagation();
      const open = dropdown.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", () => {
      if (dropdown) dropdown.classList.remove("open");
      if (toggle)   toggle.setAttribute("aria-expanded", "false");
    });

  } else {
    container.innerHTML = `
      <a href="login.html"    class="nav-auth-login">
        <i class="fa-solid fa-right-to-bracket"></i> Login
      </a>
      <a href="register.html" class="nav-auth-register">
        <i class="fa-solid fa-user-plus"></i> Register
      </a>
    `;
  }
}


/* ================================================================
   SECTION 11 – PRODUCT CARD BUILDER
   ================================================================ */
function buildProductCardHTML(product) {
  const id         = product.id;
  const outOfStock = product.stock <= 0;
  return `
    <div class="product-card ${outOfStock ? "product-card--oos" : ""}">
      <a href="product.html?id=${id}" class="product-img-link">
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/400'"/>
          <span class="badge badge-${product.badge}">${product.badge}</span>
          ${outOfStock ? '<div class="oos-overlay">Out of Stock</div>' : ""}
        </div>
      </a>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <a href="product.html?id=${id}" class="product-name-link">${product.name}</a>
        <div class="product-rating">
          <span class="stars">${buildStars(product.rating)}</span>
          <span class="rating-count">(${(product.reviews || 0).toLocaleString()})</span>
        </div>
        <div class="product-price-row">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.originalPrice > product.price
            ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ""}
          ${product.discount
            ? `<span class="price-discount">${product.discount}% off</span>` : ""}
        </div>
        ${stockBadgeHTML(product.stock)}
        <button class="add-to-cart-btn" data-id="${id}" ${outOfStock ? "disabled" : ""}>
          <i class="fa-solid fa-cart-plus"></i>
          ${outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
        <a href="product.html?id=${id}" class="view-details-btn">
          View Details <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

function attachAddToCartListeners() {
  document.querySelectorAll(".add-to-cart-btn:not([disabled])").forEach(btn => {
    btn.addEventListener("click", function () {
      if (!isLoggedIn()) {
        showToast("Please log in to add items to cart.", "error");
        setTimeout(() => { window.location.href = "login.html"; }, 1500);
        return;
      }
      const id     = this.dataset.id;
      const result = addToCart(id, 1);
      const name   = this.closest(".product-card")
                       ?.querySelector(".product-name-link")?.textContent || "Item";
      if (result.success) {
        showToast(`"${name}" added to cart!`);
      } else {
        showToast(result.message, "error");
      }
    });
  });
}


/* ================================================================
   SECTION 12 – INDEX PAGE
   ================================================================ */
function renderProducts(category = "All", search = "") {
  const grid    = document.getElementById("productGrid");
  const countEl = document.getElementById("resultCount");
  if (!grid) return;

  let list = getAllProducts();
  if (category && category !== "All") list = list.filter(p => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;

  if (!list.length) {
    grid.innerHTML = `<div class="empty-msg" style="grid-column:1/-1;text-align:center;padding:60px;color:var(--clr-mid)">
      <i class="fa-solid fa-magnifying-glass" style="font-size:2rem;display:block;margin-bottom:12px;opacity:.4"></i>
      No products found.
    </div>`;
    return;
  }

  grid.innerHTML = list.map(buildProductCardHTML).join("");
  attachAddToCartListeners();
}

function renderFilteredProducts(list) {
  const grid    = document.getElementById("productGrid");
  const countEl = document.getElementById("resultCount");
  if (!grid) return;
  if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;
  if (!list.length) {
    grid.innerHTML = `<div class="empty-msg" style="grid-column:1/-1;text-align:center;padding:60px;color:var(--clr-mid)">
      <i class="fa-solid fa-magnifying-glass" style="font-size:2rem;display:block;margin-bottom:12px;opacity:.4"></i>
      No products found.
    </div>`;
    return;
  }
  grid.innerHTML = list.map(buildProductCardHTML).join("");
  attachAddToCartListeners();
}


/* ================================================================
   SECTION 13 – PRODUCT DETAIL PAGE
   ================================================================ */
function renderProductPage() {
  const panel = document.getElementById("productDetail");
  if (!panel) return;

  const id      = new URLSearchParams(window.location.search).get("id");
  const product = id ? getProductById(id) : null;

  if (!product) {
    panel.innerHTML = `<div class="detail-loading" style="grid-column:1/-1;text-align:center;padding:60px">
      <i class="fa-solid fa-triangle-exclamation" style="color:var(--clr-red);font-size:2rem"></i>
      <p style="margin-top:12px">Product not found. <a href="index.html" style="color:var(--clr-primary)">Go back →</a></p>
    </div>`;
    return;
  }

  document.title = `SHOP EASY – ${product.name}`;
  const bCat  = document.getElementById("breadcrumbCat");
  const bName = document.getElementById("breadcrumbName");
  if (bCat)  bCat.textContent  = product.category;
  if (bName) bName.textContent = product.name;

  const outOfStock = product.stock <= 0;
  const featuresHTML = (product.features || []).map(f =>
    `<span class="feature-tag"><i class="fa-solid fa-check"></i>${f}</span>`
  ).join("");

  panel.innerHTML = `
    <div class="detail-image-wrap">
      <img src="${product.image}" alt="${product.name}"
           onerror="this.src='https://via.placeholder.com/400'"/>
      <span class="badge badge-${product.badge}">${product.badge}</span>
    </div>
    <div class="detail-info">
      <p class="detail-category">${product.category}</p>
      <h1 class="detail-name">${product.name}</h1>
      <div class="detail-rating">
        <span class="stars">${buildStars(product.rating)}</span>
        <span class="rating-count">${product.rating} · ${(product.reviews||0).toLocaleString()} reviews</span>
      </div>
      <div class="detail-divider"></div>
      <div class="detail-price-row">
        <span class="detail-price">${formatPrice(product.price)}</span>
        ${product.originalPrice > product.price
          ? `<span class="detail-original">${formatPrice(product.originalPrice)}</span>` : ""}
        ${product.discount
          ? `<span class="detail-discount">${product.discount}% OFF</span>` : ""}
      </div>
      <p class="detail-desc">${product.description}</p>
      <div class="detail-features">${featuresHTML}</div>
      <div class="detail-divider"></div>
      ${stockBadgeHTML(product.stock)}
      <div class="detail-qty" ${outOfStock ? 'style="opacity:.5;pointer-events:none"' : ""}>
        <span class="detail-qty-label">Quantity:</span>
        <div class="detail-qty-controls">
          <button class="detail-qty-btn" id="qtyMinus">−</button>
          <span class="detail-qty-val" id="qtyVal">1</span>
          <button class="detail-qty-btn" id="qtyPlus">+</button>
        </div>
      </div>
      <div class="detail-actions">
        <button class="btn-add-cart" id="detailAddCart" ${outOfStock ? "disabled" : ""}>
          <i class="fa-solid fa-cart-plus"></i>
          ${outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
        <a href="cart.html" class="btn-go-cart">
          <i class="fa-solid fa-cart-shopping"></i> View Cart
        </a>
      </div>
      <div class="detail-delivery">
        <div class="delivery-chip"><i class="fa-solid fa-truck-fast"></i> Free delivery over ₹500</div>
        <div class="delivery-chip"><i class="fa-solid fa-rotate-left"></i> 7-day returns</div>
        <div class="delivery-chip"><i class="fa-solid fa-shield-halved"></i> Secure checkout</div>
      </div>
    </div>
  `;

  let qty = 1;
  const qtyEl = document.getElementById("qtyVal");
  document.getElementById("qtyMinus")?.addEventListener("click", () => {
    if (qty > 1) { qty--; qtyEl.textContent = qty; }
  });
  document.getElementById("qtyPlus")?.addEventListener("click",  () => {
    if (qty < Math.min(10, product.stock)) { qty++; qtyEl.textContent = qty; }
  });
  document.getElementById("detailAddCart")?.addEventListener("click", function () {
    if (!isLoggedIn()) {
      showToast("Please log in to add items to cart.", "error");
      setTimeout(() => { window.location.href = "login.html"; }, 1500);
      return;
    }
    const result = addToCart(product.id, qty);
    if (result.success) showToast(`${qty}× "${product.name}" added to cart!`);
    else                showToast(result.message, "error");
  });

  /* Related products */
  const relGrid = document.getElementById("relatedGrid");
  if (relGrid) {
    const related = getAllProducts().filter(p => p.category === product.category && p.id !== product.id);
    if (related.length) {
      relGrid.innerHTML = related.map(buildProductCardHTML).join("");
      attachAddToCartListeners();
    } else {
      relGrid.innerHTML = `<p style="color:var(--clr-mid)">No related products found.</p>`;
    }
  }
}


/* ================================================================
   SECTION 14 – CART PAGE
   ================================================================ */
function renderCartPage() {
  const layout = document.getElementById("cartLayout");
  if (!layout) return;

  const cart = getCart();

  if (!cart.length) {
    layout.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping empty-cart-icon"></i>
        <h2>Your cart is empty</h2>
        <p>Browse our products and add something you love!</p>
        <a href="index.html" class="btn-primary">
          <i class="fa-solid fa-arrow-left"></i> Start Shopping
        </a>
      </div>`;
    return;
  }

  const itemsHTML = cart.map(item => `
    <div class="cart-item-card">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}"
           onerror="this.src='https://via.placeholder.com/80'"/>
      <div class="cart-item-body">
        <p class="cart-item-cat">${item.category || ""}</p>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-unit">Unit: ${formatPrice(item.price)}</p>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeCartQty('${item.productId}', -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="changeCartQty('${item.productId}', +1)">+</button>
          <button class="remove-btn" onclick="removeFromCart('${item.productId}');renderCartPage()">
            <i class="fa-solid fa-trash-can"></i> Remove
          </button>
        </div>
      </div>
      <div class="cart-item-subtotal">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join("");

  const subtotal   = getCartTotal();
  const delivery   = subtotal > 500 ? 0 : 49;
  const discount   = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + delivery - discount;

  layout.innerHTML = `
    <div class="cart-items-list">${itemsHTML}</div>
    ${renderCartSummary(subtotal, delivery, discount, grandTotal)}
  `;
}

/** Builds the Order Summary sidebar with the "Proceed to Payment" button. */
function renderCartSummary(subtotal, delivery, discount, grandTotal) {
  const payBlock = isLoggedIn()
    ? `<button class="pay-trigger-btn" onclick="openPaymentModal()">
         <i class="fa-solid fa-lock"></i> Proceed to Payment
       </button>`
    : `<a href="login.html" class="checkout-btn checkout-btn--login">
         <i class="fa-solid fa-right-to-bracket"></i> Login to Pay
       </a>`;

  return `
    <div class="order-summary">
      <p class="summary-title">Order Summary</p>
      <div class="summary-row">
        <span>Subtotal (${getCartItemCount()} items)</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Delivery</span>
        <span>${delivery === 0 ? '<span class="free-tag">FREE</span>' : formatPrice(delivery)}</span>
      </div>
      <div class="summary-row">
        <span>Coupon (5%)</span>
        <span class="discount-tag">− ${formatPrice(discount)}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span><span>${formatPrice(grandTotal)}</span>
      </div>
      ${payBlock}
      <p class="secure-note">
        <i class="fa-solid fa-shield-halved"></i> Secure checkout · 256-bit SSL
      </p>
      <div class="pay-accepted">
        <span class="pay-accepted-label">We accept:</span>
        <div class="pay-accepted-icons">
          <span><i class="fa-solid fa-mobile-screen-button"></i> UPI</span>
          <span><i class="fa-solid fa-credit-card"></i> Card</span>
          <span><i class="fa-solid fa-truck-fast"></i> COD</span>
        </div>
      </div>
    </div>
  `;
}


/* ================================================================
   SECTION 15 – ORDERS PAGE
   ================================================================ */
function renderOrdersPage() {
  const container = document.getElementById("ordersContainer");
  if (!container) return;

  if (!isLoggedIn()) {
    container.innerHTML = `
      <div class="empty-orders">
        <div class="empty-orders-icon"><i class="fa-solid fa-lock"></i></div>
        <h2>Please log in to view your orders</h2>
        <a href="login.html" class="btn-primary">
          <i class="fa-solid fa-right-to-bracket"></i> Login Now
        </a>
      </div>`;
    return;
  }

  const orders  = getUserOrders();
  const countEl = document.getElementById("orderCountLine");
  if (countEl) {
    countEl.textContent = orders.length
      ? `You have placed ${orders.length} order${orders.length !== 1 ? "s" : ""}.`
      : "No orders yet.";
  }

  if (!orders.length) {
    container.innerHTML = `
      <div class="empty-orders">
        <div class="empty-orders-icon"><i class="fa-solid fa-box-open"></i></div>
        <h2>No orders yet</h2>
        <p>Start shopping and your orders will appear here.</p>
        <a href="index.html" class="btn-primary">
          <i class="fa-solid fa-bag-shopping"></i> Browse Products
        </a>
      </div>`;
    return;
  }

  container.innerHTML = orders.map(order => {
    const thumbs = order.items.slice(0, 3).map(i =>
      `<img src="${i.image}" alt="${i.name}" class="order-thumb"
            onerror="this.src='https://via.placeholder.com/52'"/>`
    ).join("") + (order.items.length > 3
      ? `<span class="order-more-badge">+${order.items.length - 3}</span>` : "");

    const rows = order.items.map(i => `
      <div class="order-item-row">
        <img src="${i.image}" alt="${i.name}" class="order-item-img"
             onerror="this.src='https://via.placeholder.com/52'"/>
        <div class="order-item-info">
          <p class="order-item-name">${i.name}</p>
          <p class="order-item-meta">Qty: ${i.quantity} · ${formatPrice(i.price)} each</p>
        </div>
        <p class="order-item-price">${formatPrice(i.price * i.quantity)}</p>
      </div>`).join("");

    return `
      <div class="order-card">
        <div class="order-card-header">
          <div class="order-meta">
            <span class="order-id">${order.orderId}</span>
            <span class="order-date">
              <i class="fa-regular fa-calendar"></i> ${formatDate(order.date)}
            </span>
          </div>
          <div class="order-status-wrap">
            <span class="order-status order-status--paid">
              <i class="fa-solid fa-circle-check"></i>
              ${order.status || "Paid"}
            </span>
            ${order.paymentMethod
              ? `<span class="order-payment-method">
                   <i class="fa-solid fa-wallet"></i> ${order.paymentMethod}
                 </span>` : ""}
            <span class="order-total-badge">
              ${formatPrice(order.total || order.totalAmount || 0)}
            </span>
          </div>
        </div>
        <div class="order-thumbs">${thumbs}</div>
        <div class="order-items-detail" id="od-${order.orderId}" style="display:none">
          ${rows}
        </div>
        <button class="order-toggle-btn" onclick="toggleOrderDetail('${order.orderId}')">
          <i class="fa-solid fa-chevron-down"></i>
          View ${order.items.length} item${order.items.length !== 1 ? "s" : ""}
        </button>
      </div>`;
  }).join("");
}

function toggleOrderDetail(orderId) {
  const el  = document.getElementById(`od-${orderId}`);
  const btn = el.nextElementSibling;
  const open = el.style.display !== "none";
  el.style.display = open ? "none" : "block";
  const count = parseInt(btn.textContent.match(/\d+/)) || 0;
  btn.innerHTML = open
    ? `<i class="fa-solid fa-chevron-down"></i> View ${count} item${count !== 1 ? "s" : ""}`
    : `<i class="fa-solid fa-chevron-up"></i> Hide Items`;
}


/* ================================================================
   SECTION 16 – ADMIN PAGE
   ================================================================ */
function renderAdminPage() {
  /* Guard: redirect non-admins */
  protectAdminPage();
  renderAdminProductList();
}

function renderAdminProductList() {
  const tbody = document.getElementById("adminProductList");
  if (!tbody) return;

  const products = getAllProducts();
  if (!products.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--clr-mid)">
      No products yet. Add one above.
    </td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr class="admin-table-row">
      <td><img src="${p.image}" alt="${p.name}" class="admin-thumb"
               onerror="this.src='https://via.placeholder.com/50'"/></td>
      <td>
        <p class="admin-prod-name">${p.name}</p>
        <p class="admin-prod-cat">${p.category}</p>
      </td>
      <td>${formatPrice(p.price)}</td>
      <td><span class="${p.stock <= 0 ? "admin-stock-out" : p.stock <= 5 ? "admin-stock-low" : "admin-stock-ok"}">${p.stock}</span></td>
      <td><span class="badge badge-${p.badge}">${p.badge}</span></td>
      <td class="admin-actions">
        <button class="admin-btn admin-btn--edit" onclick="adminOpenEditModal('${p.id}')">
          <i class="fa-solid fa-pen"></i> Edit
        </button>
        <button class="admin-btn admin-btn--delete" onclick="adminConfirmDelete('${p.id}')">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function adminOpenEditModal(productId) {
  const p = getProductById(productId);
  if (!p) return;
  document.getElementById("modalTitle").textContent        = "Edit Product";
  document.getElementById("formProductId").value           = p.id;
  document.getElementById("formName").value                = p.name;
  document.getElementById("formCategory").value            = p.category;
  document.getElementById("formPrice").value               = p.price;
  document.getElementById("formOriginalPrice").value       = p.originalPrice;
  document.getElementById("formDiscount").value            = p.discount;
  document.getElementById("formStock").value               = p.stock;
  document.getElementById("formBadge").value               = p.badge;
  document.getElementById("formImage").value               = p.image;
  document.getElementById("formDescription").value         = p.description;
  document.getElementById("formFeatures").value            = (p.features || []).join(", ");
  document.getElementById("adminModal").classList.add("open");
}

function adminOpenAddModal() {
  document.getElementById("modalTitle").textContent = "Add New Product";
  document.getElementById("adminProductForm").reset();
  document.getElementById("formProductId").value = "";
  document.getElementById("adminModal").classList.add("open");
}

function adminCloseModal() {
  document.getElementById("adminModal").classList.remove("open");
}

function adminHandleProductForm(e) {
  e.preventDefault();
  const id   = document.getElementById("formProductId").value.trim();
  const data = {
    name:          document.getElementById("formName").value,
    category:      document.getElementById("formCategory").value,
    price:         document.getElementById("formPrice").value,
    originalPrice: document.getElementById("formOriginalPrice").value,
    discount:      document.getElementById("formDiscount").value,
    stock:         document.getElementById("formStock").value,
    badge:         document.getElementById("formBadge").value,
    image:         document.getElementById("formImage").value,
    description:   document.getElementById("formDescription").value,
    features:      document.getElementById("formFeatures").value
  };

  if (id) { adminEditProduct(id, data); showToast("Product updated!"); }
  else     { adminAddProduct(data);     showToast("Product added!");   }

  adminCloseModal();
  renderAdminProductList();
  renderAdminStats();
}

function adminConfirmDelete(productId) {
  const p = getProductById(productId);
  if (!p) return;
  if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
    adminDeleteProduct(productId);
    showToast(`"${p.name}" deleted.`, "info");
    renderAdminProductList();
    renderAdminStats();
  }
}

function renderAdminStats() {
  const products = getAllProducts();
  const users    = getAllUsers().filter(u => !u.isAdmin);
  const orders   = getAllUsers().reduce((all, u) => all.concat(u.orders || []), []);
  const revenue  = orders.reduce((s, o) => s + (o.total || 0), 0);
  const setEl    = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setEl("statProducts", products.length);
  setEl("statUsers",    users.length);
  setEl("statOrders",   orders.length);
  setEl("statRevenue",  formatPrice(revenue));
}

function renderAdminUserList() {
  const tbody = document.getElementById("adminUserList");
  if (!tbody) return;
  const users = getAllUsers().filter(u => !u.isAdmin);
  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--clr-mid)">No users yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = users.map(u => {
    const orderCount = (u.orders || []).length;
    const spent      = (u.orders || []).reduce((s, o) => s + (o.total || 0), 0);
    const cartItems  = (u.cart   || []).reduce((s, i) => s + i.quantity, 0);
    const joinedDate = u.id.startsWith("u-")
      ? formatDate(new Date(parseInt(u.id.replace("u-",""))).toISOString()) : "—";
    const verifiedBadge = u.isVerified
      ? `<span class="stock-badge stock-badge--ok"><i class="fa-solid fa-circle-check"></i> Verified</span>`
      : `<span class="stock-badge stock-badge--low"><i class="fa-solid fa-clock"></i> Unverified</span>`;
    return `
      <tr class="admin-table-row">
        <td><div class="admin-user-avatar">${u.name.charAt(0).toUpperCase()}</div></td>
        <td>
          <p class="admin-prod-name">${u.name}</p>
          <p class="admin-prod-cat">${u.email}</p>
          <div style="margin-top:4px">${verifiedBadge}</div>
        </td>
        <td>${joinedDate}</td>
        <td>
          <span class="admin-user-stat">${orderCount} order${orderCount !== 1 ? "s" : ""}</span>
          ${spent > 0 ? `<br/><span class="admin-user-spent">${formatPrice(spent)}</span>` : ""}
        </td>
        <td>${cartItems > 0
          ? `<span class="stock-badge stock-badge--low">${cartItems} in cart</span>`
          : `<span class="stock-badge stock-badge--ok">Empty</span>`}
        </td>
      </tr>`;
  }).join("");
}


/* ================================================================
   SECTION 17 – PAGE PROTECTION
   ================================================================ */

/**
 * protectPage() — for cart.html and orders.html
 * Saves the current URL, redirects to login if not logged in.
 */
function protectPage() {
  if (!isLoggedIn()) {
    localStorage.setItem("se_redirect", window.location.pathname + window.location.search);
    window.location.href = "login.html";
  }
}

/**
 * protectAdminPage() — for admin.html
 * Not logged in → login.html
 * Logged in but not admin → index.html with denial flag
 */
function protectAdminPage() {
  if (!isLoggedIn()) {
    localStorage.setItem("se_redirect", "admin.html");
    window.location.href = "login.html";
    return;
  }
  if (!isAdmin()) {
    localStorage.setItem("se_access_denied", "1");
    window.location.href = "index.html";
  }
}

/** loginAndRedirect — called from login.html */
function loginAndRedirect(email, password) {
  const result = loginUser(email, password);
  if (!result.success) return result;

  const savedPath = localStorage.getItem("se_redirect");
  localStorage.removeItem("se_redirect");

  window.location.href = savedPath || (result.isAdmin ? "admin.html" : "index.html");
  return result;
}

/** handleRedirectAfterLogin — called on index.html */
function handleRedirectAfterLogin() {
  if (localStorage.getItem("se_access_denied")) {
    localStorage.removeItem("se_access_denied");
    showToast("Admin access required.", "error");
  }
}


/* ================================================================
   SECTION 18 – PAYMENT MODAL (4-step simulation)
   ================================================================ */

let _payMethod = "";
let _payTotal  = 0;

function openPaymentModal() {
  if (!isLoggedIn()) {
    localStorage.setItem("se_redirect", "cart.html");
    window.location.href = "login.html";
    return;
  }
  const cart = getCart();
  if (!cart.length) { showToast("Your cart is empty.", "error"); return; }

  const subtotal = getCartTotal();
  const delivery = subtotal > 500 ? 0 : 49;
  const discount = Math.round(subtotal * 0.05);
  _payTotal      = subtotal + delivery - discount;

  const existing = document.getElementById("paymentModal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id        = "paymentModal";
  overlay.className = "pay-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML = `
    <div class="pay-box" id="payBox">
      <div class="pay-header">
        <h2 class="pay-title">
          <i class="fa-solid fa-lock pay-lock-icon"></i> Secure Payment
        </h2>
        <button class="pay-close" id="payCloseBtn" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="pay-steps" id="paySteps">
        <div class="pay-step active" id="stepDot1">
          <span class="step-num">1</span>
          <span class="step-label">Method</span>
        </div>
        <div class="pay-step-line"></div>
        <div class="pay-step" id="stepDot2">
          <span class="step-num">2</span>
          <span class="step-label">Details</span>
        </div>
        <div class="pay-step-line"></div>
        <div class="pay-step" id="stepDot3">
          <span class="step-num">3</span>
          <span class="step-label">Confirm</span>
        </div>
      </div>
      <div class="pay-amount-strip">
        <span>Amount to pay:</span>
        <strong class="pay-amount-val">${formatPrice(_payTotal)}</strong>
      </div>
      <div class="pay-body" id="payBody"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", e => { if (e.target === overlay) closePaymentModal(); });
  document.getElementById("payCloseBtn").addEventListener("click", closePaymentModal);
  document.body.style.overflow = "hidden";
  showPayStep1();
  requestAnimationFrame(() => overlay.classList.add("pay-overlay--open"));
}

function closePaymentModal() {
  const overlay = document.getElementById("paymentModal");
  if (!overlay) return;
  overlay.classList.remove("pay-overlay--open");
  setTimeout(() => { overlay.remove(); document.body.style.overflow = ""; _payMethod = ""; }, 300);
}

function activateStep(n) {
  [1,2,3].forEach(i => {
    const d = document.getElementById("stepDot" + i);
    if (!d) return;
    d.classList.toggle("active",    i === n);
    d.classList.toggle("completed", i < n);
  });
}

function showPayStep1() {
  activateStep(1);
  const body = document.getElementById("payBody");
  if (!body) return;
  body.innerHTML = `
    <p class="pay-step-heading">Choose how you'd like to pay</p>
    <div class="pay-methods">
      <button class="pay-method-card" onclick="selectPayMethod('upi')">
        <div class="pay-method-icon pay-method-icon--upi"><i class="fa-solid fa-mobile-screen-button"></i></div>
        <div class="pay-method-info">
          <p class="pay-method-name">UPI</p>
          <p class="pay-method-sub">Pay via any UPI app instantly</p>
        </div>
        <i class="fa-solid fa-chevron-right pay-method-arrow"></i>
      </button>
      <button class="pay-method-card" onclick="selectPayMethod('card')">
        <div class="pay-method-icon pay-method-icon--card"><i class="fa-solid fa-credit-card"></i></div>
        <div class="pay-method-info">
          <p class="pay-method-name">Credit / Debit Card</p>
          <p class="pay-method-sub">Visa, Mastercard, RuPay</p>
        </div>
        <i class="fa-solid fa-chevron-right pay-method-arrow"></i>
      </button>
      <button class="pay-method-card" onclick="selectPayMethod('cod')">
        <div class="pay-method-icon pay-method-icon--cod"><i class="fa-solid fa-truck-fast"></i></div>
        <div class="pay-method-info">
          <p class="pay-method-name">Cash on Delivery</p>
          <p class="pay-method-sub">Pay when your order arrives</p>
        </div>
        <i class="fa-solid fa-chevron-right pay-method-arrow"></i>
      </button>
    </div>
  `;
}

function selectPayMethod(method) {
  _payMethod = method;
  setTimeout(() => {
    if (method === "upi")  showPayStep2Upi();
    if (method === "card") showPayStep2Card();
    if (method === "cod")  showPayStep2Cod();
  }, 200);
}

function showPayStep2Upi() {
  activateStep(2);
  const body = document.getElementById("payBody");
  if (!body) return;
  body.innerHTML = `
    <button class="pay-back-btn" onclick="showPayStep1()"><i class="fa-solid fa-arrow-left"></i> Back</button>
    <p class="pay-step-heading"><i class="fa-solid fa-mobile-screen-button" style="color:var(--clr-primary)"></i> Enter your UPI ID</p>
    <div class="pay-form">
      <div class="form-group">
        <label class="form-label">UPI ID <span class="req">*</span></label>
        <input type="text" id="upiId" class="form-input" placeholder="yourname@upi" autocomplete="off"/>
        <span class="field-error" id="upiError"></span>
      </div>
      <div class="upi-apps">
        <span class="upi-app-chip" onclick="document.getElementById('upiId').value='yourname@gpay'"><i class="fa-brands fa-google-pay"></i> GPay</span>
        <span class="upi-app-chip" onclick="document.getElementById('upiId').value='yourname@ybl'"><i class="fa-solid fa-phone"></i> PhonePe</span>
        <span class="upi-app-chip" onclick="document.getElementById('upiId').value='yourname@paytm'"><i class="fa-solid fa-p"></i> Paytm</span>
      </div>
      <div class="pay-divider"></div>
      <button class="pay-submit-btn" onclick="validateAndConfirmPayment()">
        <i class="fa-solid fa-check-circle"></i> Pay ${formatPrice(_payTotal)}
      </button>
    </div>`;
}

function showPayStep2Card() {
  activateStep(2);
  const body = document.getElementById("payBody");
  if (!body) return;
  body.innerHTML = `
    <button class="pay-back-btn" onclick="showPayStep1()"><i class="fa-solid fa-arrow-left"></i> Back</button>
    <p class="pay-step-heading"><i class="fa-solid fa-credit-card" style="color:var(--clr-primary)"></i> Card Details</p>
    <div class="card-preview" id="cardPreview">
      <div class="card-preview-top">
        <i class="fa-solid fa-wifi card-chip-icon"></i>
        <span class="card-network-label">CARD</span>
      </div>
      <p class="card-number-display" id="cardNumDisplay">•••• •••• •••• ••••</p>
      <div class="card-preview-bottom">
        <div><p class="card-label">Card Holder</p><p class="card-value" id="cardNameDisplay">YOUR NAME</p></div>
        <div><p class="card-label">Expires</p><p class="card-value" id="cardExpDisplay">MM/YY</p></div>
      </div>
    </div>
    <div class="pay-form">
      <div class="form-group">
        <label class="form-label">Card Number <span class="req">*</span></label>
        <input type="text" id="cardNumber" class="form-input" placeholder="1234 5678 9012 3456" maxlength="19" inputmode="numeric"/>
        <span class="field-error" id="cardNumError"></span>
      </div>
      <div class="form-group">
        <label class="form-label">Name on Card <span class="req">*</span></label>
        <input type="text" id="cardName" class="form-input" placeholder="Jane Doe" autocomplete="cc-name"/>
        <span class="field-error" id="cardNameError"></span>
      </div>
      <div class="pay-form-row">
        <div class="form-group">
          <label class="form-label">Expiry <span class="req">*</span></label>
          <input type="text" id="cardExpiry" class="form-input" placeholder="MM/YY" maxlength="5" inputmode="numeric"/>
          <span class="field-error" id="cardExpError"></span>
        </div>
        <div class="form-group">
          <label class="form-label">CVV <span class="req">*</span></label>
          <input type="password" id="cardCvv" class="form-input" placeholder="•••" maxlength="4" inputmode="numeric"/>
          <span class="field-error" id="cardCvvError"></span>
        </div>
      </div>
      <button class="pay-submit-btn" onclick="validateAndConfirmPayment()">
        <i class="fa-solid fa-check-circle"></i> Pay ${formatPrice(_payTotal)}
      </button>
    </div>`;

  document.getElementById("cardNumber").addEventListener("input", function () {
    let v = this.value.replace(/\D/g,"").slice(0,16);
    this.value = v.replace(/(.{4})/g,"$1 ").trim();
    document.getElementById("cardNumDisplay").textContent =
      v.padEnd(16,"•").replace(/(.{4})/g,"$1 ").trim();
  });
  document.getElementById("cardName").addEventListener("input", function () {
    document.getElementById("cardNameDisplay").textContent = this.value.toUpperCase() || "YOUR NAME";
  });
  document.getElementById("cardExpiry").addEventListener("input", function () {
    let v = this.value.replace(/\D/g,"").slice(0,4);
    if (v.length > 2) v = v.slice(0,2) + "/" + v.slice(2);
    this.value = v;
    document.getElementById("cardExpDisplay").textContent = v || "MM/YY";
  });
}

function showPayStep2Cod() {
  activateStep(2);
  const body = document.getElementById("payBody");
  if (!body) return;
  body.innerHTML = `
    <button class="pay-back-btn" onclick="showPayStep1()"><i class="fa-solid fa-arrow-left"></i> Back</button>
    <p class="pay-step-heading"><i class="fa-solid fa-truck-fast" style="color:var(--clr-primary)"></i> Cash on Delivery</p>
    <div class="cod-info-box">
      <div class="cod-info-row"><i class="fa-solid fa-circle-check cod-check"></i><span>Keep <strong>${formatPrice(_payTotal)}</strong> ready at delivery.</span></div>
      <div class="cod-info-row"><i class="fa-solid fa-circle-check cod-check"></i><span>Delivery in <strong>3–5 business days</strong>.</span></div>
      <div class="cod-info-row"><i class="fa-solid fa-circle-check cod-check"></i><span>No advance payment required.</span></div>
      <div class="cod-info-row cod-info-row--warn"><i class="fa-solid fa-triangle-exclamation"></i><span>COD orders cannot be cancelled after dispatch.</span></div>
    </div>
    <div class="pay-divider"></div>
    <button class="pay-submit-btn pay-submit-btn--cod" onclick="validateAndConfirmPayment()">
      <i class="fa-solid fa-check-circle"></i> Confirm COD Order
    </button>`;
}

function validateAndConfirmPayment() {
  if (_payMethod === "upi") {
    const upiId = (document.getElementById("upiId")?.value || "").trim();
    const errEl = document.getElementById("upiError");
    if (!upiId) { if (errEl) errEl.textContent = "Please enter your UPI ID."; return; }
    if (!/^[a-zA-Z0-9._+-]+@[a-zA-Z]+$/.test(upiId)) {
      if (errEl) errEl.textContent = "Invalid UPI ID (e.g. name@upi)."; return;
    }
    if (errEl) errEl.textContent = "";
  }

  if (_payMethod === "card") {
    let ok = true;
    const n = (document.getElementById("cardNumber")?.value || "").replace(/\s/g,"");
    const h = (document.getElementById("cardName")?.value   || "").trim();
    const x = (document.getElementById("cardExpiry")?.value || "").trim();
    const v = (document.getElementById("cardCvv")?.value    || "").trim();
    if (n.length < 16) { const e=document.getElementById("cardNumError");  if(e) e.textContent="Enter a valid 16-digit number."; ok=false; } else { const e=document.getElementById("cardNumError");  if(e) e.textContent=""; }
    if (!h)            { const e=document.getElementById("cardNameError"); if(e) e.textContent="Enter name on card.";            ok=false; } else { const e=document.getElementById("cardNameError"); if(e) e.textContent=""; }
    if (!/^\d{2}\/\d{2}$/.test(x)) { const e=document.getElementById("cardExpError");  if(e) e.textContent="Enter MM/YY."; ok=false; } else { const e=document.getElementById("cardExpError");  if(e) e.textContent=""; }
    if (v.length < 3)  { const e=document.getElementById("cardCvvError");  if(e) e.textContent="Enter CVV (3–4 digits).";       ok=false; } else { const e=document.getElementById("cardCvvError");  if(e) e.textContent=""; }
    if (!ok) return;
  }

  const labels    = { upi: "UPI", card: "Credit/Debit Card", cod: "Cash on Delivery" };
  const confirmed = window.confirm(
    `Confirm payment of ${formatPrice(_payTotal)} via ${labels[_payMethod]}?\n\nClick OK to complete.`
  );
  if (confirmed) finalisePayment();
}

function finalisePayment() {
  const user = getCurrentUser();
  if (!user) { closePaymentModal(); window.location.href = "login.html"; return; }

  const cart = getCart();
  if (!cart.length) { closePaymentModal(); return; }

  for (const item of cart) {
    const p = getProductById(item.productId);
    if (!p || item.quantity > p.stock) {
      closePaymentModal();
      showToast(`"${item.name}" stock changed. Please review cart.`, "error");
      renderCartPage();
      return;
    }
  }

  const subtotal    = getCartTotal();
  const delivery    = subtotal > 500 ? 0 : 49;
  const discount    = Math.round(subtotal * 0.05);
  const grandTotal  = subtotal + delivery - discount;
  const methodLabels = { upi: "UPI", card: "Credit/Debit Card", cod: "Cash on Delivery" };

  const order = {
    orderId:       "ORD-" + Date.now(),
    date:          new Date().toISOString(),
    items:         [...cart],
    subtotal, delivery, discount,
    total:         grandTotal,
    totalAmount:   grandTotal,
    paymentMethod: methodLabels[_payMethod] || _payMethod,
    status:        "Paid"
  };

  cart.forEach(item => reduceStock(item.productId, item.quantity));
  user.orders.unshift(order);
  user.cart = [];
  saveOneUser(user);
  updateCartBadge();
  activateStep(3);

  const body = document.getElementById("payBody");
  if (body) {
    body.innerHTML = `
      <div class="pay-success">
        <div class="pay-success-anim">
          <div class="pay-success-ring"></div>
          <i class="fa-solid fa-circle-check pay-success-icon"></i>
        </div>
        <h3 class="pay-success-title">Payment Successful! 🎉</h3>
        <p class="pay-success-sub">Order <strong>${order.orderId}</strong> placed.</p>
        <div class="pay-success-summary">
          <div class="pay-success-row"><span>Amount Paid</span><strong>${formatPrice(order.total)}</strong></div>
          <div class="pay-success-row"><span>Method</span><strong>${order.paymentMethod}</strong></div>
          <div class="pay-success-row"><span>Status</span><strong class="status-paid"><i class="fa-solid fa-circle-check"></i> ${order.status}</strong></div>
          <div class="pay-success-row"><span>Date</span><strong>${formatDate(order.date)}</strong></div>
        </div>
        <div class="pay-success-actions">
          <a href="orders.html" class="pay-action-primary" onclick="closePaymentModal()">
            <i class="fa-solid fa-box-open"></i> View Orders
          </a>
          <a href="index.html" class="pay-action-secondary" onclick="closePaymentModal()">
            <i class="fa-solid fa-bag-shopping"></i> Keep Shopping
          </a>
        </div>
      </div>`;
  }

  const closeBtn = document.getElementById("payCloseBtn");
  if (closeBtn) closeBtn.style.display = "none";
  renderCartPage();
}


/* ================================================================
   SECTION 19 – FORM VALIDATION HELPERS
   ================================================================ */

function setFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (error) error.textContent = message;
  if (field) {
    if (message) field.classList.add("input-error");
    else         field.classList.remove("input-error");
  }
}

function clearAllErrors(errorIds) {
  errorIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
