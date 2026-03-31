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
      id:       "admin-001",
      name:     "Admin",
      email:    "admin@example.com",
      password: "123456",        // demo only – never do this in production
      isAdmin:  true,
      cart:     [],
      orders:   []
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
    id:       "u-" + Date.now(),
    name:     name.trim(),
    email:    email.toLowerCase().trim(),
    password: password,       // plain-text – demo only
    isAdmin:  false,
    cart:     [],
    orders:   []
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
    const dropdown = document.getElementById("userDropdown");
    toggle.addEventListener("click", e => {
      e.stopPropagation();
      const open = dropdown.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", () => {
      dropdown?.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    });

  } else {
    /* ── Not logged in: Login + Register links ────────────────── */
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
   SECTION 9 – PRODUCT CARD BUILDER
   Shared between index page and product-detail related grid.
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

/** Wire "Add to Cart" buttons that were just injected into the DOM. */
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
      if (result.success) showToast(`"${name}" added to cart!`);
      else                showToast(result.message, "error");
    });
  });
}


/* ================================================================
   SECTION 10 – INDEX PAGE
   ================================================================ */
function renderProducts(category = "All", search = "") {
  const grid    = document.getElementById("productGrid");
  const countEl = document.getElementById("resultCount");
  if (!grid) return;

  let list = getAllProducts();
  if (category && category !== "All") list = list.filter(p => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    list    = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;

  if (!list.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--clr-mid)">
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
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--clr-mid)">
        <i class="fa-solid fa-magnifying-glass" style="font-size:2rem;display:block;margin-bottom:12px;opacity:.4"></i>
        No products found.
      </div>`;
    return;
  }
  grid.innerHTML = list.map(buildProductCardHTML).join("");
  attachAddToCartListeners();
}


/* ================================================================
   SECTION 11 – PRODUCT DETAIL PAGE
   ================================================================ */
function renderProductPage() {
  const panel = document.getElementById("productDetail");
  if (!panel) return;

  const id      = new URLSearchParams(window.location.search).get("id");
  const product = id ? getProductById(id) : null;

  if (!product) {
    panel.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px">
        <i class="fa-solid fa-triangle-exclamation" style="color:var(--clr-red);font-size:2rem"></i>
        <p style="margin-top:12px">Product not found.
          <a href="index.html" style="color:var(--clr-primary)">← Go back</a>
        </p>
      </div>`;
    return;
  }

  document.title = `SHOP EASY – ${product.name}`;
  const bCat  = document.getElementById("breadcrumbCat");
  const bName = document.getElementById("breadcrumbName");
  if (bCat)  bCat.textContent  = product.category;
  if (bName) bName.textContent = product.name;

  const outOfStock  = product.stock <= 0;
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

  /* Quantity controls */
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
    const rel = getAllProducts().filter(p => p.category === product.category && p.id !== product.id);
    if (rel.length) { relGrid.innerHTML = rel.map(buildProductCardHTML).join(""); attachAddToCartListeners(); }
    else            { relGrid.innerHTML = `<p style="color:var(--clr-mid)">No related products found.</p>`; }
  }
}


/* ================================================================
   SECTION 12 – CART PAGE
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

  /* Cart items */
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

/**
 * renderCartSummary()
 * Builds the right-hand Order Summary card.
 * The "Proceed to Payment" button calls proceedToCheckout() which
 * checks login before opening the payment modal.
 */
function renderCartSummary(subtotal, delivery, discount, grandTotal) {
  return `
    <div class="order-summary">
      <p class="summary-title">Order Summary</p>
      <div class="summary-row">
        <span>Subtotal (${getCartItemCount()} item${getCartItemCount() !== 1 ? "s" : ""})</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Delivery</span>
        <span>${delivery === 0
          ? '<span class="free-tag">FREE</span>'
          : formatPrice(delivery)}</span>
      </div>
      <div class="summary-row">
        <span>Discount (5%)</span>
        <span class="discount-tag">− ${formatPrice(discount)}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>${formatPrice(grandTotal)}</span>
      </div>

      <!-- The button calls proceedToCheckout() which guards login -->
      <button class="pay-trigger-btn" onclick="proceedToCheckout()">
        <i class="fa-solid fa-lock"></i> Proceed to Payment
      </button>

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

/**
 * proceedToCheckout()
 * ───────────────────
 * CHECKOUT PROTECTION as required in the spec.
 * Called when the user clicks "Proceed to Payment".
 *
 *  • NOT logged in → alert + redirect to login.html  STOP
 *  • Logged in     → open the payment modal
 */
function proceedToCheckout() {
  if (!isLoggedIn()) {
    alert("Please log in first to proceed to payment.");
    window.location.href = "login.html";
    return;   // STOP
  }
  openPaymentModal();
}


/* ================================================================
   SECTION 13 – ORDERS PAGE
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
    /* Product thumbnails (first 3) */
    const thumbs = order.items.slice(0, 3).map(i =>
      `<img src="${i.image}" alt="${i.name}" class="order-thumb"
            onerror="this.src='https://via.placeholder.com/52'"/>`
    ).join("") + (order.items.length > 3
      ? `<span class="order-more-badge">+${order.items.length - 3}</span>` : "");

    /* Expandable item rows */
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
              <i class="fa-solid fa-circle-check"></i> ${order.status || "Paid"}
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
  const el    = document.getElementById(`od-${orderId}`);
  const btn   = el.nextElementSibling;
  const isOpen = el.style.display !== "none";
  el.style.display = isOpen ? "none" : "block";
  const count = parseInt(btn.textContent.match(/\d+/)) || 0;
  btn.innerHTML = isOpen
    ? `<i class="fa-solid fa-chevron-down"></i> View ${count} item${count !== 1 ? "s" : ""}`
    : `<i class="fa-solid fa-chevron-up"></i> Hide Items`;
}


/* ================================================================
   SECTION 14 – ADMIN PAGE
   ================================================================ */
function renderAdminPage() {
  protectAdminPage();        // redirect if not admin
  renderAdminProductList();
}

function renderAdminProductList() {
  const tbody = document.getElementById("adminProductList");
  if (!tbody) return;

  const products = getAllProducts();
  if (!products.length) {
    tbody.innerHTML = `
      <tr><td colspan="6" style="text-align:center;padding:24px;color:var(--clr-mid)">
        No products yet.  Use "Add Product" above.
      </td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr class="admin-table-row">
      <td>
        <img src="${p.image}" alt="${p.name}" class="admin-thumb"
             onerror="this.src='https://via.placeholder.com/50'"/>
      </td>
      <td>
        <p class="admin-prod-name">${p.name}</p>
        <p class="admin-prod-cat">${p.category}</p>
      </td>
      <td>${formatPrice(p.price)}</td>
      <td>
        <span class="${p.stock <= 0 ? "admin-stock-out" : p.stock <= 5 ? "admin-stock-low" : "admin-stock-ok"}">
          ${p.stock}
        </span>
      </td>
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
  document.getElementById("modalTitle").textContent  = "Add New Product";
  document.getElementById("adminProductForm").reset();
  document.getElementById("formProductId").value     = "";
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
  else    { adminAddProduct(data);      showToast("Product added!");   }
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
    const joined     = u.id.startsWith("u-")
      ? formatDate(new Date(parseInt(u.id.replace("u-",""))).toISOString()) : "—";
    return `
      <tr class="admin-table-row">
        <td><div class="admin-user-avatar">${u.name.charAt(0).toUpperCase()}</div></td>
        <td>
          <p class="admin-prod-name">${u.name}</p>
          <p class="admin-prod-cat">${u.email}</p>
        </td>
        <td>${joined}</td>
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
   SECTION 15 – PAGE PROTECTION
   ================================================================ */

/**
 * protectPage()
 * Redirect to login.html if the user is not logged in.
 * Saves the current page URL as se_redirect so loginAndRedirect()
 * can bounce the user back after a successful login.
 */
function protectPage() {
  if (!isLoggedIn()) {
    localStorage.setItem("se_redirect", window.location.pathname + window.location.search);
    window.location.href = "login.html";
  }
}

/**
 * protectAdminPage()
 * Not logged in → login.html
 * Logged in but not admin → index.html with access-denied toast
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


/* ================================================================
   SECTION 16 – PAYMENT MODAL  (4-step simulation)
   ──────────────────────────────────────────────────────────────
   Step 1 – Method selection  (UPI | Card | COD)
   Step 2 – Payment form      (UPI ID or card fields)
   Step 3 – Confirm dialog    window.confirm()
   Step 4 – Success screen    order saved, stock reduced, cart cleared
   ================================================================ */

let _payMethod = "";    // "upi" | "card" | "cod"
let _payTotal  = 0;     // grand total locked in when modal opens

/* ── Open ────────────────────────────────────────────────────── */
function openPaymentModal() {
  const cart = getCart();
  if (!cart.length) { showToast("Your cart is empty.", "error"); return; }

  const subtotal = getCartTotal();
  const delivery = subtotal > 500 ? 0 : 49;
  const discount = Math.round(subtotal * 0.05);
  _payTotal      = subtotal + delivery - discount;

  /* Remove any leftover modal */
  document.getElementById("paymentModal")?.remove();

  const overlay = document.createElement("div");
  overlay.id        = "paymentModal";
  overlay.className = "pay-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  overlay.innerHTML = `
    <div class="pay-box" id="payBox">

      <!-- Header -->
      <div class="pay-header">
        <h2 class="pay-title">
          <i class="fa-solid fa-lock pay-lock-icon"></i> Secure Payment
        </h2>
        <button class="pay-close" id="payCloseBtn" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Step indicator -->
      <div class="pay-steps">
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

      <!-- Amount strip -->
      <div class="pay-amount-strip">
        <span>Amount to pay:</span>
        <strong class="pay-amount-val">${formatPrice(_payTotal)}</strong>
      </div>

      <!-- Dynamic body — steps rendered here -->
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

/* ── Close ───────────────────────────────────────────────────── */
function closePaymentModal() {
  const overlay = document.getElementById("paymentModal");
  if (!overlay) return;
  overlay.classList.remove("pay-overlay--open");
  setTimeout(() => { overlay.remove(); document.body.style.overflow = ""; _payMethod = ""; }, 300);
}

/* ── Step indicator helper ───────────────────────────────────── */
function activateStep(n) {
  [1, 2, 3].forEach(i => {
    const d = document.getElementById("stepDot" + i);
    if (!d) return;
    d.classList.toggle("active",    i === n);
    d.classList.toggle("completed", i < n);
  });
}

/* ── STEP 1 – Method selection ───────────────────────────────── */
function showPayStep1() {
  activateStep(1);
  const body = document.getElementById("payBody");
  if (!body) return;
  body.innerHTML = `
    <p class="pay-step-heading">How would you like to pay?</p>
    <div class="pay-methods">

      <button class="pay-method-card" onclick="selectPayMethod('upi')">
        <div class="pay-method-icon pay-method-icon--upi">
          <i class="fa-solid fa-mobile-screen-button"></i>
        </div>
        <div class="pay-method-info">
          <p class="pay-method-name">UPI</p>
          <p class="pay-method-sub">GPay · PhonePe · Paytm · BHIM</p>
        </div>
        <i class="fa-solid fa-chevron-right pay-method-arrow"></i>
      </button>

      <button class="pay-method-card" onclick="selectPayMethod('card')">
        <div class="pay-method-icon pay-method-icon--card">
          <i class="fa-solid fa-credit-card"></i>
        </div>
        <div class="pay-method-info">
          <p class="pay-method-name">Credit / Debit Card</p>
          <p class="pay-method-sub">Visa · Mastercard · RuPay</p>
        </div>
        <i class="fa-solid fa-chevron-right pay-method-arrow"></i>
      </button>

      <button class="pay-method-card" onclick="selectPayMethod('cod')">
        <div class="pay-method-icon pay-method-icon--cod">
          <i class="fa-solid fa-truck-fast"></i>
        </div>
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
  const map = { upi: "optUpi", card: "optCard", cod: "optCod" };
  const el  = document.getElementById(map[method]);
  if (el) el.classList.add("pay-method-card--selected");
  setTimeout(() => {
    if (method === "upi")  showPayStep2Upi();
    if (method === "card") showPayStep2Card();
    if (method === "cod")  showPayStep2Cod();
  }, 200);
}

/* ── STEP 2a – UPI ───────────────────────────────────────────── */
function showPayStep2Upi() {
  activateStep(2);
  const body = document.getElementById("payBody");
  if (!body) return;
  body.innerHTML = `
    <button class="pay-back-btn" onclick="showPayStep1()">
      <i class="fa-solid fa-arrow-left"></i> Back
    </button>
    <p class="pay-step-heading">
      <i class="fa-solid fa-mobile-screen-button" style="color:var(--clr-primary)"></i>
      Enter your UPI ID
    </p>
    <div class="pay-form">
      <div class="form-group">
        <label class="form-label">UPI ID <span class="req">*</span></label>
        <input type="text" id="upiId" class="form-input"
          placeholder="yourname@upi" autocomplete="off"/>
        <span class="field-error" id="upiError"></span>
      </div>
      <div class="upi-apps">
        <span class="upi-app-chip" onclick="document.getElementById('upiId').value='yourname@gpay'">GPay</span>
        <span class="upi-app-chip" onclick="document.getElementById('upiId').value='yourname@ybl'">PhonePe</span>
        <span class="upi-app-chip" onclick="document.getElementById('upiId').value='yourname@paytm'">Paytm</span>
        <span class="upi-app-chip" onclick="document.getElementById('upiId').value='yourname@oksbi'">BHIM</span>
      </div>
      <div class="pay-divider"></div>
      <button class="pay-submit-btn" onclick="validateAndConfirmPayment()">
        <i class="fa-solid fa-check-circle"></i> Pay ${formatPrice(_payTotal)}
      </button>
    </div>
  `;
}

/* ── STEP 2b – Card ──────────────────────────────────────────── */
function showPayStep2Card() {
  activateStep(2);
  const body = document.getElementById("payBody");
  if (!body) return;
  body.innerHTML = `
    <button class="pay-back-btn" onclick="showPayStep1()">
      <i class="fa-solid fa-arrow-left"></i> Back
    </button>
    <p class="pay-step-heading">
      <i class="fa-solid fa-credit-card" style="color:var(--clr-primary)"></i>
      Card Details
    </p>

    <!-- Live card preview -->
    <div class="card-preview">
      <div class="card-preview-top">
        <i class="fa-solid fa-wifi card-chip-icon"></i>
        <span class="card-network-label">CARD</span>
      </div>
      <p class="card-number-display" id="cardNumDisplay">•••• •••• •••• ••••</p>
      <div class="card-preview-bottom">
        <div>
          <p class="card-label">Card Holder</p>
          <p class="card-value" id="cardNameDisplay">YOUR NAME</p>
        </div>
        <div>
          <p class="card-label">Expires</p>
          <p class="card-value" id="cardExpDisplay">MM/YY</p>
        </div>
      </div>
    </div>

    <div class="pay-form">
      <div class="form-group">
        <label class="form-label">Card Number <span class="req">*</span></label>
        <input type="text" id="cardNumber" class="form-input"
          placeholder="1234 5678 9012 3456" maxlength="19" inputmode="numeric"/>
        <span class="field-error" id="cardNumError"></span>
      </div>
      <div class="form-group">
        <label class="form-label">Name on Card <span class="req">*</span></label>
        <input type="text" id="cardName" class="form-input" placeholder="Jane Doe"/>
        <span class="field-error" id="cardNameError"></span>
      </div>
      <div class="pay-form-row">
        <div class="form-group">
          <label class="form-label">Expiry <span class="req">*</span></label>
          <input type="text" id="cardExpiry" class="form-input"
            placeholder="MM/YY" maxlength="5" inputmode="numeric"/>
          <span class="field-error" id="cardExpError"></span>
        </div>
        <div class="form-group">
          <label class="form-label">CVV <span class="req">*</span></label>
          <input type="password" id="cardCvv" class="form-input"
            placeholder="•••" maxlength="4" inputmode="numeric"/>
          <span class="field-error" id="cardCvvError"></span>
        </div>
      </div>
      <div class="pay-secure-badges">
        <span><i class="fa-solid fa-shield-halved"></i> SSL Encrypted</span>
        <span><i class="fa-solid fa-lock"></i> PCI DSS Safe</span>
      </div>
      <button class="pay-submit-btn" onclick="validateAndConfirmPayment()">
        <i class="fa-solid fa-check-circle"></i> Pay ${formatPrice(_payTotal)}
      </button>
    </div>
  `;

  /* Live card preview listeners */
  document.getElementById("cardNumber").addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "").slice(0, 16);
    this.value = v.replace(/(.{4})/g, "$1 ").trim();
    document.getElementById("cardNumDisplay").textContent =
      v.padEnd(16, "•").replace(/(.{4})/g, "$1 ").trim();
  });
  document.getElementById("cardName").addEventListener("input", function () {
    document.getElementById("cardNameDisplay").textContent = this.value.toUpperCase() || "YOUR NAME";
  });
  document.getElementById("cardExpiry").addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    this.value = v;
    document.getElementById("cardExpDisplay").textContent = v || "MM/YY";
  });
}

/* ── STEP 2c – COD ───────────────────────────────────────────── */
function showPayStep2Cod() {
  activateStep(2);
  const body = document.getElementById("payBody");
  if (!body) return;
  body.innerHTML = `
    <button class="pay-back-btn" onclick="showPayStep1()">
      <i class="fa-solid fa-arrow-left"></i> Back
    </button>
    <p class="pay-step-heading">
      <i class="fa-solid fa-truck-fast" style="color:var(--clr-primary)"></i>
      Cash on Delivery
    </p>
    <div class="cod-info-box">
      <div class="cod-info-row">
        <i class="fa-solid fa-circle-check cod-check"></i>
        <span>Keep <strong>${formatPrice(_payTotal)}</strong> ready at delivery.</span>
      </div>
      <div class="cod-info-row">
        <i class="fa-solid fa-circle-check cod-check"></i>
        <span>Delivery in <strong>3–5 business days</strong>.</span>
      </div>
      <div class="cod-info-row">
        <i class="fa-solid fa-circle-check cod-check"></i>
        <span>No advance payment required.</span>
      </div>
      <div class="cod-info-row cod-info-row--warn">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>COD orders cannot be cancelled after dispatch.</span>
      </div>
    </div>
    <div class="pay-divider"></div>
    <button class="pay-submit-btn pay-submit-btn--cod" onclick="validateAndConfirmPayment()">
      <i class="fa-solid fa-check-circle"></i> Confirm COD Order
    </button>
  `;
}

/* ── STEP 3 – Validate then confirm ─────────────────────────── */
function validateAndConfirmPayment() {

  /* UPI validation */
  if (_payMethod === "upi") {
    const upiId = (document.getElementById("upiId")?.value || "").trim();
    const errEl = document.getElementById("upiError");
    if (!upiId) { if (errEl) errEl.textContent = "Please enter your UPI ID."; return; }
    if (!/^[a-zA-Z0-9._+-]+@[a-zA-Z]+$/.test(upiId)) {
      if (errEl) errEl.textContent = "Invalid UPI ID (e.g. name@upi)."; return;
    }
    if (errEl) errEl.textContent = "";
  }

  /* Card validation */
  if (_payMethod === "card") {
    let ok = true;
    const n = (document.getElementById("cardNumber")?.value || "").replace(/\s/g,"");
    const h = (document.getElementById("cardName")?.value   || "").trim();
    const x = (document.getElementById("cardExpiry")?.value || "").trim();
    const v = (document.getElementById("cardCvv")?.value    || "").trim();

    const setErr = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg; };
    if (n.length < 16)              { setErr("cardNumError",  "Enter a valid 16-digit number."); ok = false; } else setErr("cardNumError",  "");
    if (!h)                         { setErr("cardNameError", "Enter the name on your card.");   ok = false; } else setErr("cardNameError", "");
    if (!/^\d{2}\/\d{2}$/.test(x)) { setErr("cardExpError",  "Enter expiry as MM/YY.");         ok = false; } else setErr("cardExpError",  "");
    if (v.length < 3)               { setErr("cardCvvError",  "Enter CVV (3–4 digits).");        ok = false; } else setErr("cardCvvError",  "");
    if (!ok) return;
  }

  /* COD needs no validation */

  /* ── native confirm dialog (Step 3) ── */
  const labels    = { upi: "UPI", card: "Credit/Debit Card", cod: "Cash on Delivery" };
  const confirmed = window.confirm(
    `Confirm payment of ${formatPrice(_payTotal)} via ${labels[_payMethod]}?\n\nClick OK to place your order.`
  );
  if (confirmed) finalisePayment();
}

/* ── STEP 4 – Finalise order ─────────────────────────────────── */
function finalisePayment() {
  const user = getCurrentUser();
  if (!user) { closePaymentModal(); window.location.href = "login.html"; return; }

  const cart = getCart();
  if (!cart.length) { closePaymentModal(); return; }

  /* Stock re-check just before order is saved */
  for (const item of cart) {
    const p = getProductById(item.productId);
    if (!p || item.quantity > p.stock) {
      closePaymentModal();
      showToast(`"${item.name}" stock changed. Please review your cart.`, "error");
      renderCartPage();
      return;
    }
  }

  /* Build order object */
  const subtotal   = getCartTotal();
  const delivery   = subtotal > 500 ? 0 : 49;
  const discount   = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + delivery - discount;
  const labels     = { upi: "UPI", card: "Credit/Debit Card", cod: "Cash on Delivery" };

  const order = {
    orderId:       "ORD-" + Date.now(),
    date:          new Date().toISOString(),
    items:         [...cart],
    subtotal, delivery, discount,
    total:         grandTotal,
    totalAmount:   grandTotal,
    paymentMethod: labels[_payMethod] || _payMethod,
    status:        "Paid"
  };

  /* Persist */
  cart.forEach(item => reduceStock(item.productId, item.quantity));
  user.orders.unshift(order);
  user.cart = [];
  saveOneUser(user);
  updateCartBadge();

  activateStep(3);

  /* Success screen inside modal */
  const body = document.getElementById("payBody");
  if (body) {
    body.innerHTML = `
      <div class="pay-success">
        <div class="pay-success-anim">
          <div class="pay-success-ring"></div>
          <i class="fa-solid fa-circle-check pay-success-icon"></i>
        </div>
        <h3 class="pay-success-title">Payment Successful! 🎉</h3>
        <p class="pay-success-sub">
          Order <strong>${order.orderId}</strong> has been placed.
        </p>
        <div class="pay-success-summary">
          <div class="pay-success-row">
            <span>Amount Paid</span>
            <strong>${formatPrice(order.total)}</strong>
          </div>
          <div class="pay-success-row">
            <span>Payment Method</span>
            <strong>${order.paymentMethod}</strong>
          </div>
          <div class="pay-success-row">
            <span>Status</span>
            <strong class="status-paid">
              <i class="fa-solid fa-circle-check"></i> ${order.status}
            </strong>
          </div>
          <div class="pay-success-row">
            <span>Date</span>
            <strong>${formatDate(order.date)}</strong>
          </div>
        </div>
        <div class="pay-success-actions">
          <a href="orders.html" class="pay-action-primary" onclick="closePaymentModal()">
            <i class="fa-solid fa-box-open"></i> View My Orders
          </a>
          <a href="index.html" class="pay-action-secondary" onclick="closePaymentModal()">
            <i class="fa-solid fa-bag-shopping"></i> Keep Shopping
          </a>
        </div>
      </div>
    `;
  }

  /* Hide × button – user must choose a CTA */
  const closeBtn = document.getElementById("payCloseBtn");
  if (closeBtn) closeBtn.style.display = "none";

  renderCartPage(); // refresh cart (shows empty state below modal)
}


/* ================================================================
   SECTION 17 – FORM VALIDATION HELPERS
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

function clearAllErrors(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
