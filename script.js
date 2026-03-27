/* ============================================================
   SHOP EASY – script.js  (Phase 6 — localStorage Full System)
   No backend. Everything stored in the browser.

   SECTIONS:
   1.  Storage Keys
   2.  Default Data (seed products + admin)
   3.  User Helpers (register, login, logout, session)
   4.  Product Helpers (CRUD in localStorage)
   5.  Cart Helpers (per-user)
   6.  Order Helpers (checkout, history)
   7.  UI Helpers (toast, stars, price format, date)
   8.  Navbar Auth renderer
   9.  Product Card builder (shared HTML)
   10. index.html – renderProducts / filters / search
   11. product.html – renderProductPage
   12. cart.html – renderCartPage
   13. orders.html – renderOrdersPage
   14. admin.html – renderAdminPage (CRUD)
   ============================================================ */


/* ============================================================
   SECTION 1 – STORAGE KEYS
   One place for every localStorage key name.
   ============================================================ */
const KEYS = {
  USERS:      "se_users",        // Array of user objects
  SESSION:    "se_session",      // Email of logged-in user
  PRODUCTS:   "se_products",     // Array of product objects
};


/* ============================================================
   SECTION 2 – DEFAULT / SEED DATA
   Runs once when the page loads. Creates the admin account
   and 8 sample products if they don't already exist.
   ============================================================ */
function seedDefaultData() {

  /* ── Admin user ─────────────────────────────────────────── */
  let users = getAllUsers();
  const adminExists = users.some(u => u.email === "admin@example.com");
  if (!adminExists) {
    users.push({
      id:       "admin-001",
      name:     "Admin",
      email:    "admin@example.com",
      password: "123456",          // ⚠️ Demo only
      isAdmin:  true,
      cart:     [],
      orders:   []
    });
    saveAllUsers(users);
  }

  /* ── Sample products ────────────────────────────────────── */
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    const defaultProducts = [
      {
        id: "p1",
        name: "Wireless Noise-Cancelling Headphones",
        category: "Electronics",
        price: 2999,
        originalPrice: 4999,
        discount: 40,
        rating: 4.5,
        reviews: 1243,
        badge: "sale",
        stock: 25,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        description: "Immerse yourself in crystal-clear audio with 40dB active noise cancellation. Up to 30 hours of playtime, fast charging, premium memory foam ear cushions.",
        features: ["30-hr battery", "ANC Technology", "Bluetooth 5.3", "USB-C Charging", "Foldable Design"]
      },
      {
        id: "p2",
        name: "Men's Classic White Sneakers",
        category: "Fashion",
        price: 1499,
        originalPrice: 2499,
        discount: 40,
        rating: 4.3,
        reviews: 876,
        badge: "hot",
        stock: 40,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        description: "Timeless white sneakers in premium vegan leather. Lightweight EVA sole for all-day comfort. Available sizes 6–12.",
        features: ["Vegan Leather", "EVA Sole", "Sizes 6–12", "Hand-washable", "Unisex Fit"]
      },
      {
        id: "p3",
        name: "Stainless Steel Water Bottle 1L",
        category: "Sports",
        price: 499,
        originalPrice: 799,
        discount: 38,
        rating: 4.7,
        reviews: 3312,
        badge: "best",
        stock: 100,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
        description: "Double-walled vacuum insulation. Cold 24h, hot 12h. BPA-free, 1L, leak-proof lid.",
        features: ["24hr Cold / 12hr Hot", "BPA Free", "1 Litre", "Leak-proof Lid", "Food-grade Steel"]
      },
      {
        id: "p4",
        name: "Organic Face Moisturiser SPF50",
        category: "Beauty",
        price: 849,
        originalPrice: 1299,
        discount: 35,
        rating: 4.4,
        reviews: 568,
        badge: "new",
        stock: 60,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
        description: "Broad-spectrum SPF 50 with organic aloe vera, hyaluronic acid, green tea. All skin types.",
        features: ["SPF 50", "Organic Ingredients", "All Skin Types", "Non-Comedogenic", "50ml"]
      },
      {
        id: "p5",
        name: "Non-Stick Cookware Set (5-piece)",
        category: "Home & Kitchen",
        price: 3499,
        originalPrice: 5499,
        discount: 36,
        rating: 4.6,
        reviews: 2041,
        badge: "sale",
        stock: 20,
        image: "https://images.unsplash.com/photo-1584786996374-80dfa87e2c3f?w=600&q=80",
        description: "PFOA-free ceramic coating. Induction, gas & electric compatible. Oven safe to 220°C.",
        features: ["5-piece Set", "PFOA-Free", "Induction Safe", "Oven Safe 220°C", "Dishwasher Safe"]
      },
      {
        id: "p6",
        name: "Portable Bluetooth Speaker",
        category: "Electronics",
        price: 1799,
        originalPrice: 2999,
        discount: 40,
        rating: 4.2,
        reviews: 730,
        badge: "hot",
        stock: 35,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
        description: "360° sound, IPX7 waterproof, 20-hour battery, doubles as power bank.",
        features: ["IPX7 Waterproof", "360° Sound", "20hr Battery", "Power Bank Mode", "TWS Pairing"]
      },
      {
        id: "p7",
        name: "Women's Floral Kurti",
        category: "Fashion",
        price: 699,
        originalPrice: 1299,
        discount: 46,
        rating: 4.5,
        reviews: 1875,
        badge: "new",
        stock: 75,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4d2f?w=600&q=80",
        description: "Breathable Rayon, A-line fit, 3/4 sleeves, mandarin collar. Machine washable.",
        features: ["Rayon Fabric", "A-Line Fit", "3/4 Sleeves", "Machine Washable", "S to 3XL"]
      },
      {
        id: "p8",
        name: "Yoga Mat Anti-Slip 6mm",
        category: "Sports",
        price: 599,
        originalPrice: 999,
        discount: 40,
        rating: 4.8,
        reviews: 4105,
        badge: "best",
        stock: 55,
        image: "https://images.unsplash.com/photo-1601925228523-e22ac7aaf2a0?w=600&q=80",
        description: "6mm TPE foam, double-sided non-slip, carry strap included, eco-friendly.",
        features: ["6mm Thickness", "Double-side Non-slip", "TPE Foam", "Carry Strap Included", "Eco-Friendly"]
      }
    ];
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }
}


/* ============================================================
   SECTION 3 – USER HELPERS
   ============================================================ */

/* Read entire users array */
function getAllUsers() {
  const raw = localStorage.getItem(KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

/* Write entire users array */
function saveAllUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

/* Find one user by email (case-insensitive) */
function findUserByEmail(email) {
  return getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/* Update one user in place and persist */
function saveOneUser(updatedUser) {
  const users = getAllUsers();
  const idx   = users.findIndex(u => u.email === updatedUser.email);
  if (idx !== -1) { users[idx] = updatedUser; saveAllUsers(users); }
}

/* Get the currently logged-in user (fresh from storage every call) */
function getCurrentUser() {
  const email = localStorage.getItem(KEYS.SESSION);
  if (!email) return null;
  return findUserByEmail(email);
}

/* Is someone logged in? */
function isLoggedIn() { return !!getCurrentUser(); }

/* Is the current user an admin? */
function isAdmin() {
  const u = getCurrentUser();
  return u ? !!u.isAdmin : false;
}

/* ── REGISTER ──────────────────────────────────────────────── */
function registerUser(name, email, password) {
  if (findUserByEmail(email)) {
    return { success: false, message: "This email is already registered. Please log in." };
  }
  const users = getAllUsers();
  users.push({
    id:       "u-" + Date.now(),
    name:     name.trim(),
    email:    email.toLowerCase().trim(),
    password: password,         // plain text – demo only
    isAdmin:  false,
    cart:     [],
    orders:   []
  });
  saveAllUsers(users);
  return { success: true };
}

/* ── LOGIN ─────────────────────────────────────────────────── */
function loginUser(email, password) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return { success: false, message: "Incorrect email or password." };
  }
  localStorage.setItem(KEYS.SESSION, user.email);
  return { success: true, name: user.name, isAdmin: user.isAdmin };
}

/* ── LOGOUT ────────────────────────────────────────────────── */
function logoutUser() {
  localStorage.removeItem(KEYS.SESSION);
  window.location.href = "index.html";
}


/* ============================================================
   SECTION 4 – PRODUCT HELPERS (CRUD)
   ============================================================ */

/* Read all products */
function getAllProducts() {
  const raw = localStorage.getItem(KEYS.PRODUCTS);
  return raw ? JSON.parse(raw) : [];
}

/* Write all products */
function saveAllProducts(products) {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
}

/* Get one product by id */
function getProductById(id) {
  return getAllProducts().find(p => p.id === id) || null;
}

/* ── ADMIN: Add product ────────────────────────────────────── */
function adminAddProduct(data) {
  const products = getAllProducts();
  const newProduct = {
    id:            "p-" + Date.now(),
    name:          data.name.trim(),
    category:      data.category,
    price:         Number(data.price),
    originalPrice: Number(data.originalPrice) || Number(data.price),
    discount:      Number(data.discount) || 0,
    rating:        Number(data.rating) || 0,
    reviews:       Number(data.reviews) || 0,
    badge:         data.badge || "new",
    stock:         Number(data.stock) || 0,
    image:         data.image.trim() || "https://via.placeholder.com/400",
    description:   data.description.trim(),
    features:      data.features
      ? data.features.split(",").map(f => f.trim()).filter(Boolean)
      : []
  };
  products.push(newProduct);
  saveAllProducts(products);
  return newProduct;
}

/* ── ADMIN: Edit product ───────────────────────────────────── */
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
    rating:        Number(data.rating) || products[idx].rating,
    reviews:       Number(data.reviews) || products[idx].reviews,
    badge:         data.badge || products[idx].badge,
    stock:         Number(data.stock),
    image:         data.image.trim() || products[idx].image,
    description:   data.description.trim(),
    features:      data.features
      ? data.features.split(",").map(f => f.trim()).filter(Boolean)
      : products[idx].features
  };
  saveAllProducts(products);
  return true;
}

/* ── ADMIN: Delete product ─────────────────────────────────── */
function adminDeleteProduct(id) {
  const products = getAllProducts().filter(p => p.id !== id);
  saveAllProducts(products);
}

/* Reduce stock after purchase */
function reduceStock(productId, qty) {
  const products = getAllProducts();
  const p        = products.find(p => p.id === productId);
  if (p) {
    p.stock = Math.max(0, p.stock - qty);
    saveAllProducts(products);
  }
}


/* ============================================================
   SECTION 5 – CART HELPERS (per-user)
   ============================================================ */

/* Get current user's cart */
function getCart() {
  const user = getCurrentUser();
  return user ? (user.cart || []) : [];
}

/* Save cart back to current user */
function saveCart(cart) {
  const user = getCurrentUser();
  if (!user) return;
  user.cart = cart;
  saveOneUser(user);
}

/* Add to cart – checks stock */
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

/* Remove one item from cart */
function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.productId !== productId));
  updateCartBadge();
}

/* Change cart item quantity; removes if qty ≤ 0 */
function changeCartQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
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

/* Cart totals */
function getCartTotal()     { return getCart().reduce((s, i) => s + i.price * i.quantity, 0); }
function getCartItemCount() { return getCart().reduce((s, i) => s + i.quantity, 0); }


/* ============================================================
   SECTION 6 – ORDER HELPERS
   ============================================================ */

/* Checkout: snapshot cart → order, reduce stock, clear cart */
function processCheckout() {
  const user = getCurrentUser();
  if (!user) { window.location.href = "login.html"; return null; }

  const cart = getCart();
  if (!cart.length) return null;

  /* Stock double-check */
  for (const item of cart) {
    const p = getProductById(item.productId);
    if (!p || item.quantity > p.stock) {
      showToast(`"${item.name}" stock changed. Please review your cart.`, "error");
      return null;
    }
  }

  /* Build order */
  const order = {
    orderId:   "ORD-" + Date.now(),
    date:      new Date().toISOString(),
    items:     [...cart],
    subtotal:  getCartTotal(),
    delivery:  getCartTotal() > 500 ? 0 : 49,
    discount:  Math.round(getCartTotal() * 0.05),
    get total() { return this.subtotal + this.delivery - this.discount; },
    status:    "Delivered"
  };
  /* Materialise the getter so it serialises */
  order.total = order.subtotal + order.delivery - order.discount;

  /* Reduce stock for each item */
  cart.forEach(item => reduceStock(item.productId, item.quantity));

  /* Save order to user */
  user.orders.unshift(order);
  user.cart = [];
  saveOneUser(user);
  updateCartBadge();
  return order;
}

/* Get orders for current user */
function getUserOrders() {
  const user = getCurrentUser();
  return user ? (user.orders || []) : [];
}


/* ============================================================
   SECTION 7 – UI HELPERS
   ============================================================ */

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

/* Stock badge colour helper */
function stockBadgeHTML(stock) {
  if (stock <= 0)  return `<span class="stock-badge stock-badge--out">Out of Stock</span>`;
  if (stock <= 5)  return `<span class="stock-badge stock-badge--low">Only ${stock} left</span>`;
  return `<span class="stock-badge stock-badge--ok">In Stock (${stock})</span>`;
}


/* ============================================================
   SECTION 8 – NAVBAR AUTH RENDERER
   Renders the right content in #navAuth on every page.
   ============================================================ */
function renderNavAuth() {
  const container = document.getElementById("navAuth");
  if (!container) return;

  const user = getCurrentUser();

  if (user) {
    /* Logged-in: show dropdown with name, orders, admin (if admin), logout */
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

    /* Toggle dropdown on chip click */
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
    /* Not logged in: show Login + Register buttons */
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


/* ============================================================
   SECTION 9 – PRODUCT CARD BUILDER (shared across pages)
   ============================================================ */
function buildProductCardHTML(product) {
  const id        = product.id;
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
          ${product.originalPrice && product.originalPrice > product.price
            ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>`
            : ""}
          ${product.discount
            ? `<span class="price-discount">${product.discount}% off</span>`
            : ""}
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

/* Wire "Add to Cart" buttons after rendering a grid */
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


/* ============================================================
   SECTION 10 – INDEX PAGE
   Renders products from localStorage with filter + search.
   ============================================================ */
function renderProducts(category = "All", search = "") {
  const grid    = document.getElementById("productGrid");
  const countEl = document.getElementById("resultCount");
  if (!grid) return;

  let list = getAllProducts();

  if (category && category !== "All") {
    list = list.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-msg" style="grid-column:1/-1; text-align:center; padding:60px 0; color:var(--clr-mid)">
        <i class="fa-solid fa-magnifying-glass" style="font-size:2rem;display:block;margin-bottom:12px;opacity:.4"></i>
        No products found.
      </div>`;
    return;
  }

  grid.innerHTML = list.map(buildProductCardHTML).join("");
  attachAddToCartListeners();
}

/* Convenience wrapper used by category pills */
function renderFilteredProducts(list) {
  const grid    = document.getElementById("productGrid");
  const countEl = document.getElementById("resultCount");
  if (!grid) return;

  if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-msg" style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--clr-mid)">
        <i class="fa-solid fa-magnifying-glass" style="font-size:2rem;display:block;margin-bottom:12px;opacity:.4"></i>
        No products found.
      </div>`;
    return;
  }
  grid.innerHTML = list.map(buildProductCardHTML).join("");
  attachAddToCartListeners();
}


/* ============================================================
   SECTION 11 – PRODUCT DETAIL PAGE  (product.html)
   ============================================================ */
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

  const featuresHTML = (product.features || []).map(f =>
    `<span class="feature-tag"><i class="fa-solid fa-check"></i>${f}</span>`
  ).join("");

  const outOfStock = product.stock <= 0;

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
        <div class="delivery-chip"><i class="fa-solid fa-rotate-left"></i> 7-day easy returns</div>
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
    if (result.success) {
      showToast(`${qty}× "${product.name}" added to cart!`);
    } else {
      showToast(result.message, "error");
    }
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


/* ============================================================
   SECTION 12 – CART PAGE  (cart.html)
   ============================================================ */
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

  const checkoutBlock = isLoggedIn()
    ? `<button class="checkout-btn" id="checkoutBtn">
         <i class="fa-solid fa-lock"></i> Proceed to Checkout
       </button>`
    : `<a href="login.html" class="checkout-btn checkout-btn--login">
         <i class="fa-solid fa-right-to-bracket"></i> Login to Checkout
       </a>`;

  layout.innerHTML = `
    <div class="cart-items-list">${itemsHTML}</div>
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
      ${checkoutBlock}
      <p class="secure-note">
        <i class="fa-solid fa-shield-halved"></i> Secure checkout · 256-bit SSL
      </p>
    </div>
  `;

  /* Checkout handler */
  document.getElementById("checkoutBtn")?.addEventListener("click", function () {
    this.disabled  = true;
    this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Placing order…';
    const order = processCheckout();
    if (order) {
      layout.innerHTML = `
        <div class="checkout-success">
          <div class="success-icon"><i class="fa-solid fa-circle-check"></i></div>
          <h2>Order Placed Successfully!</h2>
          <p>Your order <strong>${order.orderId}</strong> has been confirmed.</p>
          <p class="success-total">Total paid: <strong>${formatPrice(order.total)}</strong></p>
          <div class="success-actions">
            <a href="orders.html" class="btn-primary">
              <i class="fa-solid fa-box-open"></i> View My Orders
            </a>
            <a href="index.html" class="btn-secondary">
              <i class="fa-solid fa-arrow-left"></i> Continue Shopping
            </a>
          </div>
        </div>`;
      updateCartBadge();
    } else {
      this.disabled  = false;
      this.innerHTML = '<i class="fa-solid fa-lock"></i> Proceed to Checkout';
    }
  });
}


/* ============================================================
   SECTION 13 – ORDERS PAGE  (orders.html)
   ============================================================ */
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

  const orders = getUserOrders();
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
      `<img src="${i.image}" alt="${i.name}" class="order-thumb" title="${i.name}"
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
            <span class="order-status order-status--${order.status.toLowerCase()}">
              ${order.status}
            </span>
            <span class="order-total-badge">${formatPrice(order.total)}</span>
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
    ? `<i class="fa-solid fa-chevron-down"></i> View ${count} item${count!==1?"s":""}`
    : `<i class="fa-solid fa-chevron-up"></i> Hide Items`;
}


/* ============================================================
   SECTION 14 – ADMIN PAGE  (admin.html)
   Full product CRUD + user list
   ============================================================ */
function renderAdminPage() {
  /* Guard: redirect non-admins */
  if (!isAdmin()) {
    document.body.innerHTML = `
      <div style="display:grid;place-items:center;min-height:100vh;font-family:sans-serif">
        <div style="text-align:center;padding:40px">
          <i class="fa-solid fa-lock" style="font-size:3rem;color:#FF6B35"></i>
          <h2 style="margin:16px 0">Access Denied</h2>
          <p style="color:#666;margin-bottom:24px">
            You must be an admin to view this page.
          </p>
          <a href="index.html"
             style="background:#FF6B35;color:#fff;padding:12px 28px;
                    border-radius:8px;text-decoration:none;font-weight:600">
            Go Home
          </a>
        </div>
      </div>`;
    return;
  }
  renderAdminProductList();
}

/* Render the product table in admin panel */
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

/* Open modal pre-filled with product data for editing */
function adminOpenEditModal(productId) {
  const p = getProductById(productId);
  if (!p) return;

  document.getElementById("modalTitle").textContent  = "Edit Product";
  document.getElementById("formProductId").value     = p.id;
  document.getElementById("formName").value          = p.name;
  document.getElementById("formCategory").value      = p.category;
  document.getElementById("formPrice").value         = p.price;
  document.getElementById("formOriginalPrice").value = p.originalPrice;
  document.getElementById("formDiscount").value      = p.discount;
  document.getElementById("formStock").value         = p.stock;
  document.getElementById("formBadge").value         = p.badge;
  document.getElementById("formImage").value         = p.image;
  document.getElementById("formDescription").value   = p.description;
  document.getElementById("formFeatures").value      = (p.features || []).join(", ");

  document.getElementById("adminModal").classList.add("open");
}

/* Open blank modal for adding a new product */
function adminOpenAddModal() {
  document.getElementById("modalTitle").textContent  = "Add New Product";
  document.getElementById("adminProductForm").reset();
  document.getElementById("formProductId").value = "";
  document.getElementById("adminModal").classList.add("open");
}

/* Close the modal */
function adminCloseModal() {
  document.getElementById("adminModal").classList.remove("open");
}

/* Handle product form submit (add or edit) */
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

  if (id) {
    adminEditProduct(id, data);
    showToast("Product updated successfully!");
  } else {
    adminAddProduct(data);
    showToast("Product added successfully!");
  }

  adminCloseModal();
  renderAdminProductList();
}

/* Confirm then delete */
function adminConfirmDelete(productId) {
  const p = getProductById(productId);
  if (!p) return;
  if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
    adminDeleteProduct(productId);
    showToast(`"${p.name}" deleted.`, "info");
    renderAdminProductList();
  }
}

/* Admin stats panel */
function renderAdminStats() {
  const products = getAllProducts();
  const users    = getAllUsers().filter(u => !u.isAdmin);
  const orders   = getAllUsers().reduce((all, u) => all.concat(u.orders || []), []);
  const revenue  = orders.reduce((s, o) => s + (o.total || 0), 0);

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl("statProducts", products.length);
  setEl("statUsers",    users.length);
  setEl("statOrders",   orders.length);
  setEl("statRevenue",  formatPrice(revenue));
}

/* ============================================================
   SECTION 15 – PAGE PROTECTION (NEW in Phase 7)
   Call protectPage() or protectAdminPage() at the top of
   any page's inline <script> block to enforce access rules.
   ============================================================ */

/**
 * protectPage()
 * Redirects to login.html if the user is NOT logged in.
 * Saves the current URL so we can bounce back after login.
 *
 * Usage (add to cart.html / orders.html):
 *   protectPage();
 */
function protectPage() {
  if (!isLoggedIn()) {
    /* Store intended destination so login can redirect back */
    localStorage.setItem("se_redirect", window.location.pathname + window.location.search);
    window.location.href = "login.html";
  }
}

/**
 * protectAdminPage()
 * Redirects non-admins away. Logged-out users go to login.
 * Non-admin users go to index with an error toast.
 *
 * Usage (add to admin.html):
 *   protectAdminPage();
 */
function protectAdminPage() {
  if (!isLoggedIn()) {
    localStorage.setItem("se_redirect", "admin.html");
    window.location.href = "login.html";
    return;
  }
  if (!isAdmin()) {
    /* User is logged in but not admin – go home with message */
    localStorage.setItem("se_access_denied", "1");
    window.location.href = "index.html";
  }
}

/**
 * handleRedirectAfterLogin()
 * Called on index.html (and optionally other pages) after the
 * user lands post-login. If a saved redirect URL exists, go there.
 * Also shows the "access denied" toast if needed.
 *
 * Usage (add to index.html init):
 *   handleRedirectAfterLogin();
 */
function handleRedirectAfterLogin() {
  /* Show access-denied toast set by protectAdminPage() */
  if (localStorage.getItem("se_access_denied")) {
    localStorage.removeItem("se_access_denied");
    showToast("Admin access required.", "error");
  }
}

/**
 * loginAndRedirect()
 * Replacement for the plain loginUser() call in login.html.
 * After successful login, checks for a saved redirect and uses it.
 */
function loginAndRedirect(email, password) {
  const result = loginUser(email, password);
  if (!result.success) return result;

  /* Where should we send the user? */
  const savedPath = localStorage.getItem("se_redirect");
  localStorage.removeItem("se_redirect");

  if (result.isAdmin) {
    window.location.href = savedPath || "admin.html";
  } else {
    window.location.href = savedPath || "index.html";
  }
  return result;
}


/* ============================================================
   SECTION 16 – ADMIN USER LIST (NEW in Phase 7)
   Shows all registered (non-admin) users + their order counts.
   ============================================================ */

/**
 * renderAdminUserList()
 * Injects a table of registered users into #adminUserList tbody.
 * Called from admin.html after the page renders.
 */
function renderAdminUserList() {
  const tbody = document.getElementById("adminUserList");
  if (!tbody) return;

  /* All users except the admin account itself */
  const users = getAllUsers().filter(u => !u.isAdmin);

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--clr-mid)">
      No registered users yet.
    </td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => {
    const orderCount  = (u.orders || []).length;
    const spent       = (u.orders || []).reduce((s, o) => s + (o.total || 0), 0);
    const cartItems   = (u.cart   || []).reduce((s, i) => s + i.quantity, 0);
    const joinedDate  = u.id.startsWith("u-")
      ? formatDate(new Date(parseInt(u.id.replace("u-", ""))).toISOString())
      : "—";

    return `
      <tr class="admin-table-row">
        <td>
          <div class="admin-user-avatar">
            ${u.name.charAt(0).toUpperCase()}
          </div>
        </td>
        <td>
          <p class="admin-prod-name">${u.name}</p>
          <p class="admin-prod-cat">${u.email}</p>
        </td>
        <td>${joinedDate}</td>
        <td>
          <span class="admin-user-stat">${orderCount} order${orderCount !== 1 ? "s" : ""}</span>
          ${spent > 0 ? `<br/><span class="admin-user-spent">${formatPrice(spent)}</span>` : ""}
        </td>
        <td>
          ${cartItems > 0
            ? `<span class="stock-badge stock-badge--low">${cartItems} in cart</span>`
            : `<span class="stock-badge stock-badge--ok">Empty cart</span>`}
        </td>
      </tr>`;
  }).join("");
}


/* ============================================================
   SECTION 17 – FORM VALIDATION HELPERS (NEW in Phase 7)
   Reusable inline error helpers used by login/register pages.
   ============================================================ */

/**
 * setFieldError(fieldId, errorId, message)
 * Shows an error message below a form field and adds error styling.
 * Pass message="" to clear the error.
 */
function setFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (error) error.textContent = message;
  if (field) {
    if (message) {
      field.classList.add("input-error");
    } else {
      field.classList.remove("input-error");
    }
  }
}

/** Clear all field errors in a form */
function clearAllErrors(errorIds) {
  errorIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

/** Simple email format check */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ============================================================
   SECTION 18 – WISHLIST (NEW in Phase 7)
   Simple per-user wishlist stored alongside the user object.
   ============================================================ */

/* Get current user's wishlist */
function getWishlist() {
  const user = getCurrentUser();
  return user ? (user.wishlist || []) : [];
}

/* Toggle a product in / out of the wishlist */
function toggleWishlist(productId) {
  if (!isLoggedIn()) {
    showToast("Please log in to save to wishlist.", "error");
    return false;
  }
  const user     = getCurrentUser();
  const list     = user.wishlist || [];
  const idx      = list.indexOf(productId);
  let   added    = false;

  if (idx === -1) {
    list.push(productId);
    added = true;
  } else {
    list.splice(idx, 1);
  }
  user.wishlist = list;
  saveOneUser(user);
  return added; /* true = added, false = removed */
}

/** Is a product in the current user's wishlist? */
function isWishlisted(productId) {
  return getWishlist().includes(productId);
}


/* ============================================================
   SECTION 19 – SEARCH HISTORY (NEW in Phase 7)
   Persists recent searches per-user for a better UX.
   ============================================================ */
const MAX_SEARCH_HISTORY = 5;

function addSearchHistory(query) {
  if (!query || !isLoggedIn()) return;
  const user = getCurrentUser();
  const hist = user.searchHistory || [];
  /* Remove duplicate then prepend */
  const cleaned = hist.filter(q => q !== query);
  cleaned.unshift(query);
  user.searchHistory = cleaned.slice(0, MAX_SEARCH_HISTORY);
  saveOneUser(user);
}

function getSearchHistory() {
  const user = getCurrentUser();
  return user ? (user.searchHistory || []) : [];
}

function clearSearchHistory() {
  const user = getCurrentUser();
  if (!user) return;
  user.searchHistory = [];
  saveOneUser(user);
}


/* ============================================================
   SECTION 20 – ENHANCED renderAdminPage (Phase 7 override)
   Replaces the Phase 6 guard-only version with a full render
   that also runs page protection via protectAdminPage().
   ============================================================ */
/* Override the Phase 6 renderAdminPage to use the new guard */
(function patchAdminPage() {
  /* Store the original Phase 6 implementation */
  const _origRender = typeof renderAdminPage === "function" ? renderAdminPage : null;

  window.renderAdminPage = function () {
    /* Use the new, safer guard */
    protectAdminPage();
    /* If we're still here (not redirected), render product list & stats */
    renderAdminProductList();
  };
})();
