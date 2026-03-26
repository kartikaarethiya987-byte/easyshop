/* ============================================================
   SHOP EASY – script.js  (Phase 5 — Real Backend Integration)
   All data now comes from the Node.js + Express + MongoDB API.
   localStorage is only used to store the JWT token & cached user info.
   ============================================================ */


/* ============================================================
   SECTION 1 – API CONFIGURATION
   Central place for all backend settings.
   Change API_BASE if your backend runs on a different port.
   ============================================================ */
const API_BASE = "http://localhost:5000/api";

// localStorage keys (only used for token & UI cache now)
const TOKEN_KEY   = "shopeasy_token";    // JWT string
const USER_KEY    = "shopeasy_user";     // { id, name, email } cache


/* ============================================================
   SECTION 2 – TOKEN & SESSION HELPERS
   ============================================================ */

/* Save JWT token after login/register */
function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/* Read JWT token from storage */
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/* Remove token (logout) */
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/* Save cached user info so navbar renders without an API call */
function saveUserCache(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/* Read cached user info */
function getCachedUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

/* Is the user currently logged in? (has a token) */
function isLoggedIn() {
  return !!getToken();
}


/* ============================================================
   SECTION 3 – API FETCH WRAPPER
   A helper that automatically attaches the JWT token and
   handles common error cases in one place.

   Usage:
     const data = await apiFetch("/products");
     const data = await apiFetch("/cart/add", "POST", { productId, quantity });
   ============================================================ */
async function apiFetch(endpoint, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json"
  };

  // Attach token for protected routes
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const data     = await response.json();

  // If token expired / invalid, log the user out automatically
  if (response.status === 401) {
    clearToken();
    window.location.href = "login.html";
    return null;
  }

  // Return { ok, status, data } so callers can check success
  return { ok: response.ok, status: response.status, data };
}


/* ============================================================
   SECTION 4 – AUTH FUNCTIONS (replaced localStorage logic)
   ============================================================ */

/* Register new user — calls POST /api/auth/register */
async function registerUser(name, email, password) {
  try {
    const result = await apiFetch("/auth/register", "POST", { name, email, password });
    if (!result) return { success: false, message: "Network error." };

    if (result.ok) {
      // Save token and user cache
      saveToken(result.data.token);
      saveUserCache(result.data.user);
      return { success: true };
    } else {
      return { success: false, message: result.data.error || "Registration failed." };
    }
  } catch (err) {
    return { success: false, message: "Cannot connect to server. Is the backend running?" };
  }
}

/* Login — calls POST /api/auth/login */
async function loginUser(email, password) {
  try {
    const result = await apiFetch("/auth/login", "POST", { email, password });
    if (!result) return { success: false, message: "Network error." };

    if (result.ok) {
      saveToken(result.data.token);
      saveUserCache(result.data.user);
      return { success: true, name: result.data.user.name };
    } else {
      return { success: false, message: result.data.error || "Login failed." };
    }
  } catch (err) {
    return { success: false, message: "Cannot connect to server. Is the backend running?" };
  }
}

/* Logout — clear token, redirect home */
function logoutUser() {
  clearToken();
  window.location.href = "index.html";
}

/* Get logged-in user from cache (for navbar rendering) */
function getLoggedInUser() {
  return getCachedUser();
}


/* ============================================================
   SECTION 5 – CART FUNCTIONS (API-based)
   ============================================================ */

/* Global in-memory cart cache to avoid repeated fetches */
let _cartCache = null;

/* Fetch cart from API — GET /api/cart */
async function fetchCart() {
  if (!isLoggedIn()) {
    _cartCache = [];
    return [];
  }
  try {
    const result = await apiFetch("/cart");
    if (result && result.ok) {
      _cartCache = result.data.cart;
      return result.data.cart;
    }
    return [];
  } catch (err) {
    console.error("Fetch cart error:", err.message);
    return [];
  }
}

/* Get cart (from cache if available) */
function getCart() {
  return _cartCache || [];
}

/* Add product to cart — POST /api/cart/add */
async function addToCart(productId, quantity = 1) {
  if (!isLoggedIn()) {
    showToast("Please login to add items to your cart.", "error");
    setTimeout(() => { window.location.href = "login.html"; }, 1500);
    return;
  }
  try {
    const result = await apiFetch("/cart/add", "POST", { productId, quantity });
    if (result && result.ok) {
      _cartCache = result.data.cart;
      updateCartBadge();
    } else {
      showToast(result?.data?.error || "Could not add to cart.", "error");
    }
  } catch (err) {
    showToast("Network error. Please try again.", "error");
  }
}

/* Remove item from cart — DELETE /api/cart/remove/:productId */
async function removeFromCart(productId) {
  try {
    const result = await apiFetch(`/cart/remove/${productId}`, "DELETE");
    if (result && result.ok) {
      _cartCache = result.data.cart;
      updateCartBadge();
    }
  } catch (err) {
    console.error("Remove from cart error:", err.message);
  }
}

/* Change item quantity — PUT /api/cart/update */
async function changeCartQty(productId, delta) {
  const cart   = getCart();
  const item   = cart.find(i => i.productId === productId || i.productId?._id === productId);
  if (!item) return;

  const newQty = item.quantity + delta;

  try {
    const result = await apiFetch("/cart/update", "PUT", { productId, quantity: newQty });
    if (result && result.ok) {
      _cartCache = result.data.cart;
      updateCartBadge();
      renderCartPage();
    }
  } catch (err) {
    console.error("Change cart qty error:", err.message);
  }
}

/* Calculate total from cached cart */
function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/* Calculate total item count from cached cart */
function getCartItemCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}


/* ============================================================
   SECTION 6 – ORDER FUNCTIONS (API-based)
   ============================================================ */

/* Checkout — POST /api/orders */
async function processCheckout() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return null;
  }
  try {
    const result = await apiFetch("/orders", "POST");
    if (result && result.ok) {
      _cartCache = [];          // Clear local cache
      updateCartBadge();
      return result.data.order; // Return order object for success display
    } else {
      showToast(result?.data?.error || "Checkout failed.", "error");
      return null;
    }
  } catch (err) {
    showToast("Network error during checkout.", "error");
    return null;
  }
}

/* Fetch all orders for logged-in user — GET /api/orders */
async function fetchUserOrders() {
  if (!isLoggedIn()) return [];
  try {
    const result = await apiFetch("/orders");
    return (result && result.ok) ? result.data.orders : [];
  } catch (err) {
    console.error("Fetch orders error:", err.message);
    return [];
  }
}


/* ============================================================
   SECTION 7 – PRODUCT FUNCTIONS (API-based)
   ============================================================ */

/* Fetch all products — GET /api/products */
async function fetchProducts(category = "", search = "") {
  try {
    let endpoint = "/products";
    const params = [];
    if (category && category !== "All") params.push(`category=${encodeURIComponent(category)}`);
    if (search)                          params.push(`search=${encodeURIComponent(search)}`);
    if (params.length) endpoint += "?" + params.join("&");

    const result = await apiFetch(endpoint);
    return (result && result.ok) ? result.data.products : [];
  } catch (err) {
    console.error("Fetch products error:", err.message);
    return [];
  }
}

/* Fetch one product by MongoDB _id — GET /api/products/:id */
async function fetchProductById(id) {
  try {
    const result = await apiFetch(`/products/${id}`);
    return (result && result.ok) ? result.data.product : null;
  } catch (err) {
    console.error("Fetch product error:", err.message);
    return null;
  }
}


/* ============================================================
   SECTION 8 – UI HELPERS
   ============================================================ */

function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
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

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric"
  });
}

/* Update the cart badge count in the navbar */
function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  const count = getCartItemCount();
  badge.textContent = count;
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);
}

/* Show a floating toast notification */
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

/* Show an inline loading spinner inside a container */
function showLoading(containerId, message = "Loading…") {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `
    <div class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>${message}</p>
    </div>`;
}


/* ============================================================
   SECTION 9 – NAVBAR AUTH (dropdown menu)
   Reads from the user cache (no API call needed each page load)
   ============================================================ */
function renderNavAuth() {
  const container = document.getElementById("navAuth");
  if (!container) return;

  const user = getLoggedInUser();

  if (user && isLoggedIn()) {
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
          </div>
          <div class="dropdown-divider"></div>
          <a href="orders.html" class="dropdown-item">
            <i class="fa-solid fa-box-open"></i> My Orders
          </a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item dropdown-item--danger" onclick="logoutUser()">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>
    `;

    const toggle   = document.getElementById("userMenuToggle");
    const dropdown = document.getElementById("userDropdown");

    toggle.addEventListener("click", (e) => {
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
      <a href="login.html" class="nav-auth-login">
        <i class="fa-solid fa-right-to-bracket"></i> Login
      </a>
      <a href="register.html" class="nav-auth-register">
        <i class="fa-solid fa-user-plus"></i> Register
      </a>
    `;
  }
}


/* ============================================================
   SECTION 10 – PRODUCT CARDS (reusable HTML builder)
   Now uses MongoDB _id as the product identifier.
   ============================================================ */
function buildProductCardHTML(product) {
  const id = product._id || product.id; // Works with both API and legacy format
  return `
    <div class="product-card">
      <a href="product.html?id=${id}" class="product-img-link">
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy"/>
          <span class="badge badge-${product.badge}">${product.badge}</span>
          <button class="wishlist-btn" aria-label="Wishlist">
            <i class="fa-regular fa-heart"></i>
          </button>
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
          ${product.originalPrice
            ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>`
            : ""}
          ${product.discount
            ? `<span class="price-discount">${product.discount}% off</span>`
            : ""}
        </div>
        <button class="add-to-cart-btn" data-id="${id}">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
        <a href="product.html?id=${id}" class="view-details-btn">
          View Details <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

/* Wire up Add to Cart buttons after rendering a grid */
function attachAddToCartListeners() {
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", async function (e) {
      e.preventDefault();
      const id    = this.dataset.id;
      const name  = this.closest(".product-card")?.querySelector(".product-name-link")?.textContent || "Item";
      this.disabled  = true;
      this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Adding…';
      await addToCart(id, 1);
      showToast(`"${name}" added to cart!`);
      this.disabled  = false;
      this.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
    });
  });
}

/* Render products into #productGrid — called on index.html */
async function renderProducts(category = "", search = "") {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  showLoading("productGrid", "Fetching products…");

  const products = await fetchProducts(category, search);

  const countEl = document.getElementById("resultCount");
  if (countEl) countEl.textContent = `${products.length} product${products.length !== 1 ? "s" : ""}`;

  if (!products.length) {
    grid.innerHTML = `<p class="empty-msg" style="grid-column:1/-1">
      <i class="fa-solid fa-magnifying-glass"></i> No products found.
    </p>`;
    return;
  }

  grid.innerHTML = products.map(buildProductCardHTML).join("");
  attachAddToCartListeners();
}


/* ============================================================
   SECTION 11 – CART PAGE  (cart.html)
   ============================================================ */
async function renderCartPage() {
  const layout = document.getElementById("cartLayout");
  if (!layout) return;

  // Show loading state while fetching
  layout.innerHTML = `<div class="loading-state" style="grid-column:1/-1">
    <i class="fa-solid fa-spinner fa-spin"></i><p>Loading your cart…</p>
  </div>`;

  // Fetch fresh cart from API
  const cart = await fetchCart();
  updateCartBadge();

  if (!cart.length) {
    layout.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping empty-cart-icon"></i>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <a href="index.html"><i class="fa-solid fa-arrow-left"></i> Start Shopping</a>
      </div>`;
    return;
  }

  /* Build item rows */
  const itemsHTML = cart.map(item => {
    // Handle both { productId: ObjectId } and { productId: { _id } } formats
    const pid = typeof item.productId === "object" ? item.productId._id : item.productId;
    return `
      <div class="cart-item-card" id="cart-item-${pid}">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}"/>
        <div class="cart-item-body">
          <p class="cart-item-cat">${item.category || ""}</p>
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-unit">Unit price: ${formatPrice(item.price)}</p>
          <div class="qty-row">
            <button class="qty-btn" onclick="changeCartQtyAndRefresh('${pid}', -1)">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="changeCartQtyAndRefresh('${pid}', +1)">+</button>
            <button class="remove-btn" onclick="removeAndRefresh('${pid}')">
              <i class="fa-solid fa-trash-can"></i> Remove
            </button>
          </div>
        </div>
        <div class="cart-item-subtotal">${formatPrice(item.price * item.quantity)}</div>
      </div>`;
  }).join("");

  const subtotal    = getCartTotal();
  const delivery    = subtotal > 500 ? 0 : 49;
  const discount    = Math.round(subtotal * 0.05);
  const grandTotal  = subtotal + delivery - discount;

  const checkoutBtn = isLoggedIn()
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
        <span>Coupon Discount (5%)</span>
        <span class="discount-tag">− ${formatPrice(discount)}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>${formatPrice(grandTotal)}</span>
      </div>
      ${checkoutBtn}
      <p class="secure-note"><i class="fa-solid fa-shield-halved"></i> Secure checkout · 256-bit SSL</p>
    </div>
  `;

  /* Attach checkout handler */
  const btn = document.getElementById("checkoutBtn");
  if (btn) {
    btn.addEventListener("click", async function () {
      this.disabled  = true;
      this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Placing order…';
      const order = await processCheckout();
      if (order) {
        layout.innerHTML = `
          <div class="checkout-success">
            <div class="success-icon"><i class="fa-solid fa-circle-check"></i></div>
            <h2>Order Placed Successfully!</h2>
            <p>Your order <strong>${order.orderId}</strong> has been confirmed.</p>
            <p class="success-total">Total paid: <strong>${formatPrice(order.totalAmount)}</strong></p>
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
}

/* Wrapper: change qty then re-render cart */
async function changeCartQtyAndRefresh(productId, delta) {
  await changeCartQty(productId, delta);
  await renderCartPage();
}

/* Wrapper: remove item then re-render cart */
async function removeAndRefresh(productId) {
  if (confirm("Remove this item from your cart?")) {
    await removeFromCart(productId);
    showToast("Item removed.", "info");
    await renderCartPage();
  }
}


/* ============================================================
   SECTION 12 – PRODUCT DETAIL PAGE  (product.html)
   Reads ?id= from URL and fetches product from API.
   ============================================================ */
async function renderProductPage() {
  const panel = document.getElementById("productDetail");
  if (!panel) return;

  const params    = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    panel.innerHTML = `<div class="detail-loading">No product ID in URL.
      <a href="index.html">Go back home →</a></div>`;
    return;
  }

  // Show loading spinner
  panel.innerHTML = `<div class="detail-loading" style="grid-column:1/-1">
    <i class="fa-solid fa-spinner fa-spin"></i> Loading product…
  </div>`;

  const product = await fetchProductById(productId);

  if (!product) {
    panel.innerHTML = `<div class="detail-loading" style="grid-column:1/-1">
      <i class="fa-solid fa-triangle-exclamation" style="color:var(--clr-red)"></i>
      Product not found. <a href="index.html" style="color:var(--clr-primary)">Go back →</a>
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

  panel.innerHTML = `
    <div class="detail-image-wrap">
      <img src="${product.image}" alt="${product.name}"/>
      <span class="badge badge-${product.badge}">${product.badge}</span>
    </div>
    <div class="detail-info">
      <p class="detail-category">${product.category}</p>
      <h1 class="detail-name">${product.name}</h1>
      <div class="detail-rating">
        <span class="stars">${buildStars(product.rating)}</span>
        <span class="rating-count">${product.rating} · ${(product.reviews || 0).toLocaleString()} reviews</span>
      </div>
      <div class="detail-divider"></div>
      <div class="detail-price-row">
        <span class="detail-price">${formatPrice(product.price)}</span>
        ${product.originalPrice ? `<span class="detail-original">${formatPrice(product.originalPrice)}</span>` : ""}
        ${product.discount ? `<span class="detail-discount">${product.discount}% OFF</span>` : ""}
      </div>
      <p class="detail-desc">${product.description}</p>
      <div class="detail-features">${featuresHTML}</div>
      <div class="detail-divider"></div>
      <div class="detail-qty">
        <span class="detail-qty-label">Quantity:</span>
        <div class="detail-qty-controls">
          <button class="detail-qty-btn" id="qtyMinus">−</button>
          <span class="detail-qty-val" id="qtyVal">1</span>
          <button class="detail-qty-btn" id="qtyPlus">+</button>
        </div>
      </div>
      <div class="detail-actions">
        <button class="btn-add-cart" id="detailAddCart">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
        <a href="cart.html" class="btn-go-cart">
          <i class="fa-solid fa-cart-shopping"></i> View Cart
        </a>
      </div>
      <div class="detail-delivery">
        <div class="delivery-chip"><i class="fa-solid fa-truck-fast"></i> Free delivery over ₹500</div>
        <div class="delivery-chip"><i class="fa-solid fa-rotate-left"></i> 7-day easy returns</div>
        <div class="delivery-chip"><i class="fa-solid fa-shield-halved"></i> Secure payments</div>
      </div>
    </div>
  `;

  let qty = 1;
  const qtyValEl = document.getElementById("qtyVal");
  document.getElementById("qtyMinus").addEventListener("click", () => { if (qty > 1)  { qty--; qtyValEl.textContent = qty; } });
  document.getElementById("qtyPlus").addEventListener("click",  () => { if (qty < 10) { qty++; qtyValEl.textContent = qty; } });

  document.getElementById("detailAddCart").addEventListener("click", async function () {
    this.disabled  = true;
    this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Adding…';
    await addToCart(product._id, qty);
    showToast(`${qty}× "${product.name}" added to cart!`);
    this.disabled  = false;
    this.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
  });

  // Load related products (same category, from API)
  const relGrid = document.getElementById("relatedGrid");
  if (relGrid) {
    relGrid.innerHTML = '<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i></div>';
    const allInCategory = await fetchProducts(product.category);
    const related       = allInCategory.filter(p => p._id !== product._id);

    relGrid.innerHTML = related.length
      ? related.map(buildProductCardHTML).join("")
      : `<p class="empty-msg">No related products found.</p>`;
    attachAddToCartListeners();
  }
}


/* ============================================================
   SECTION 13 – ORDERS PAGE  (orders.html)
   Fetches orders from API and renders them.
   ============================================================ */
async function renderOrdersPage() {
  const container = document.getElementById("ordersContainer");
  if (!container) return;

  if (!isLoggedIn()) {
    container.innerHTML = `
      <div class="empty-orders">
        <div class="empty-orders-icon"><i class="fa-solid fa-lock"></i></div>
        <h2>Please log in to view your orders</h2>
        <p>Your order history is tied to your account.</p>
        <a href="login.html" class="btn-primary">
          <i class="fa-solid fa-right-to-bracket"></i> Login Now
        </a>
      </div>`;
    return;
  }

  showLoading("ordersContainer", "Fetching your orders…");

  const orders = await fetchUserOrders();

  // Update subtitle count
  const countLine = document.getElementById("orderCountLine");
  if (countLine) {
    countLine.textContent = orders.length
      ? `You have placed ${orders.length} order${orders.length !== 1 ? "s" : ""}.`
      : "No orders yet.";
  }

  if (!orders.length) {
    container.innerHTML = `
      <div class="empty-orders">
        <div class="empty-orders-icon"><i class="fa-solid fa-box-open"></i></div>
        <h2>No orders yet</h2>
        <p>You haven't placed any orders. Start shopping!</p>
        <a href="index.html" class="btn-primary">
          <i class="fa-solid fa-bag-shopping"></i> Browse Products
        </a>
      </div>`;
    return;
  }

  const html = orders.map(order => {
    const thumbs = order.items.slice(0, 3).map(i =>
      `<img src="${i.image}" alt="${i.name}" class="order-thumb" title="${i.name}"/>`
    ).join("") + (order.items.length > 3
      ? `<span class="order-more-badge">+${order.items.length - 3}</span>`
      : "");

    const itemRows = order.items.map(i => `
      <div class="order-item-row">
        <img src="${i.image}" alt="${i.name}" class="order-item-img"/>
        <div class="order-item-info">
          <p class="order-item-name">${i.name}</p>
          <p class="order-item-meta">Qty: ${i.quantity} &middot; ${formatPrice(i.price)} each</p>
        </div>
        <p class="order-item-price">${formatPrice(i.price * i.quantity)}</p>
      </div>`).join("");

    return `
      <div class="order-card">
        <div class="order-card-header">
          <div class="order-meta">
            <span class="order-id">${order.orderId}</span>
            <span class="order-date">
              <i class="fa-regular fa-calendar"></i> ${formatDate(order.createdAt)}
            </span>
          </div>
          <div class="order-status-wrap">
            <span class="order-status order-status--${order.status.toLowerCase()}">${order.status}</span>
            <span class="order-total-badge">${formatPrice(order.totalAmount)}</span>
          </div>
        </div>
        <div class="order-thumbs">${thumbs}</div>
        <div class="order-items-detail" id="detail-${order._id}" style="display:none">
          ${itemRows}
        </div>
        <button class="order-toggle-btn" onclick="toggleOrderDetail('${order._id}')">
          <i class="fa-solid fa-chevron-down"></i> View ${order.items.length} item${order.items.length !== 1 ? "s" : ""}
        </button>
      </div>`;
  }).join("");

  container.innerHTML = html;
}

function toggleOrderDetail(orderId) {
  const detail = document.getElementById(`detail-${orderId}`);
  const btn    = detail.nextElementSibling;
  const isOpen = detail.style.display !== "none";
  detail.style.display = isOpen ? "none" : "block";
  const count = parseInt(btn.textContent.match(/\d+/)) || 0;
  btn.innerHTML = isOpen
    ? `<i class="fa-solid fa-chevron-down"></i> View ${count} item${count !== 1 ? "s" : ""}`
    : `<i class="fa-solid fa-chevron-up"></i> Hide Items`;
}
