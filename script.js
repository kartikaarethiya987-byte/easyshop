/* ============================================================
   SHOP EASY – script.js  (Phase 4 — Full User Account System)
   Shared across: index.html, cart.html, product.html,
                  login.html, register.html, orders.html
   ============================================================ */


/* ============================================================
   SECTION 1 – PRODUCT DATA
   ============================================================ */
const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    rating: 4.5,
    reviews: 1243,
    badge: "sale",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    description: "Immerse yourself in crystal-clear audio with 40dB active noise cancellation. Enjoy up to 30 hours of playtime with fast charging — 10 minutes gives 3 hours of playback. Foldable design with premium memory foam ear cushions for all-day comfort.",
    features: ["30-hr battery", "ANC Technology", "Bluetooth 5.3", "USB-C Charging", "Foldable Design"]
  },
  {
    id: 2,
    name: "Men's Classic White Sneakers",
    category: "Fashion",
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    rating: 4.3,
    reviews: 876,
    badge: "hot",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    description: "Timeless white sneakers crafted from premium vegan leather. Lightweight EVA sole ensures all-day comfort. Versatile enough to pair with everything from jeans to chinos. Available in sizes 6–12.",
    features: ["Vegan Leather", "EVA Sole", "Sizes 6–12", "Hand-washable", "Unisex Fit"]
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle 1L",
    category: "Sports",
    price: 499,
    originalPrice: 799,
    discount: 38,
    rating: 4.7,
    reviews: 3312,
    badge: "best",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    description: "Double-walled vacuum insulation keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, food-grade 304 stainless steel. Wide mouth opening fits standard ice cubes. Leak-proof lid, sweat-free exterior.",
    features: ["24hr Cold / 12hr Hot", "BPA Free", "1 Litre", "Leak-proof Lid", "Food-grade Steel"]
  },
  {
    id: 4,
    name: "Organic Face Moisturiser SPF50",
    category: "Beauty",
    price: 849,
    originalPrice: 1299,
    discount: 35,
    rating: 4.4,
    reviews: 568,
    badge: "new",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
    description: "Lightweight daily moisturiser with broad-spectrum SPF 50 protection. Formulated with certified organic aloe vera, hyaluronic acid, and green tea extract. Suitable for all skin types, non-comedogenic, and dermatologist tested.",
    features: ["SPF 50", "Organic Ingredients", "All Skin Types", "Non-Comedogenic", "50ml"]
  },
  {
    id: 5,
    name: "Non-Stick Cookware Set (5-piece)",
    category: "Home & Kitchen",
    price: 3499,
    originalPrice: 5499,
    discount: 36,
    rating: 4.6,
    reviews: 2041,
    badge: "sale",
    image: "https://images.unsplash.com/photo-1584786996374-80dfa87e2c3f?w=600&q=80",
    description: "Professional-grade non-stick cookware set. Includes 20cm saucepan, 24cm fry pan, 26cm deep pan, and two lids. PFOA-free ceramic coating. Induction, gas, and electric compatible. Oven safe up to 220°C.",
    features: ["5-piece Set", "PFOA-Free", "Induction Safe", "Oven Safe 220°C", "Dishwasher Safe"]
  },
  {
    id: 6,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 1799,
    originalPrice: 2999,
    discount: 40,
    rating: 4.2,
    reviews: 730,
    badge: "hot",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    description: "360° immersive sound in a rugged, waterproof (IPX7) body. Pair two speakers for true stereo. Built-in 5000mAh battery doubles as a power bank for your phone. 20-hour playtime per charge.",
    features: ["IPX7 Waterproof", "360° Sound", "20hr Battery", "Power Bank Mode", "TWS Pairing"]
  },
  {
    id: 7,
    name: "Women's Floral Kurti",
    category: "Fashion",
    price: 699,
    originalPrice: 1299,
    discount: 46,
    rating: 4.5,
    reviews: 1875,
    badge: "new",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4d2f?w=600&q=80",
    description: "Elegant floral print kurti crafted from breathable Rayon fabric. Features a comfortable A-line fit, 3/4 sleeves, and a mandarin collar. Perfect for casual and semi-formal occasions. Machine washable.",
    features: ["Rayon Fabric", "A-Line Fit", "3/4 Sleeves", "Machine Washable", "S to 3XL"]
  },
  {
    id: 8,
    name: "Yoga Mat Anti-Slip 6mm",
    category: "Sports",
    price: 599,
    originalPrice: 999,
    discount: 40,
    rating: 4.8,
    reviews: 4105,
    badge: "best",
    image: "https://images.unsplash.com/photo-1601925228523-e22ac7aaf2a0?w=600&q=80",
    description: "Premium 6mm thick yoga mat with double-sided non-slip texture. High-density TPE foam provides superior joint cushioning. Includes carry strap and free alignment guide. Eco-friendly, sweat-resistant, and odour-free.",
    features: ["6mm Thickness", "Double-side Non-slip", "TPE Foam", "Carry Strap Included", "Eco-Friendly"]
  }
];


/* ============================================================
   SECTION 2 – STORAGE KEYS
   Central names for all localStorage keys.
   ============================================================ */
const KEYS = {
  USERS:      "shopeasy_users",       // Array of all registered user objects
  SESSION:    "shopeasy_session",     // Email string of logged-in user
  GUEST_CART: "shopeasy_guest_cart"   // Temporary cart for guests
};


/* ============================================================
   SECTION 3 – USER MANAGEMENT
   User object shape:
   {
     id:       string  (timestamp)
     name:     string
     email:    string  (lowercase)
     password: string  (plain-text — DEMO ONLY)
     cart:     Array   (cart item objects)
     orders:   Array   (order objects)
   }
   ============================================================ */

/* Read all users from localStorage */
function getAllUsers() {
  const raw = localStorage.getItem(KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

/* Write all users back to localStorage */
function saveAllUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

/* Find one user by email (case-insensitive) */
function findUserByEmail(email) {
  return getAllUsers().find(u => u.email === email.toLowerCase()) || null;
}

/* Update a single user inside the users array */
function saveOneUser(updatedUser) {
  const users = getAllUsers();
  const idx   = users.findIndex(u => u.email === updatedUser.email);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveAllUsers(users);
  }
}

/* ── REGISTER ─────────────────────────────────────────── */
function registerUser(name, email, password) {
  const normalEmail = email.toLowerCase().trim();

  if (findUserByEmail(normalEmail)) {
    return { success: false, message: "This email is already registered. Please log in." };
  }

  const newUser = {
    id:       Date.now().toString(),
    name:     name.trim(),
    email:    normalEmail,
    password: password,
    cart:     [],
    orders:   []
  };

  const users = getAllUsers();
  users.push(newUser);
  saveAllUsers(users);
  return { success: true };
}

/* ── LOGIN ────────────────────────────────────────────── */
function loginUser(email, password) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return { success: false, message: "Incorrect email or password. Please try again." };
  }
  // Session = user email only (look up full object on demand)
  localStorage.setItem(KEYS.SESSION, user.email);
  return { success: true, name: user.name };
}

/* ── LOGOUT ───────────────────────────────────────────── */
function logoutUser() {
  localStorage.removeItem(KEYS.SESSION);
  window.location.href = "index.html";
}

/* ── GET CURRENT USER (always fresh from storage) ────── */
function getLoggedInUser() {
  const email = localStorage.getItem(KEYS.SESSION);
  if (!email) return null;
  return findUserByEmail(email);
}


/* ============================================================
   SECTION 4 – USER-SCOPED CART
   Cart lives inside the user object. Guests get a temp key.
   ============================================================ */

function getCart() {
  const user = getLoggedInUser();
  if (user) return user.cart || [];
  const raw = localStorage.getItem(KEYS.GUEST_CART);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  const user = getLoggedInUser();
  if (user) {
    user.cart = cart;
    saveOneUser(user);
  } else {
    localStorage.setItem(KEYS.GUEST_CART, JSON.stringify(cart));
  }
}

function addToCart(productId, qty = 1) {
  const cart    = getCart();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id:       product.id,
      name:     product.name,
      category: product.category,
      price:    product.price,
      image:    product.image,
      quantity: qty
    });
  }
  saveCart(cart);
  updateCartBadge();
}

function removeFromCart(productId) {
  saveCart(getCart().filter(item => item.id !== productId));
  updateCartBadge();
}

function changeCartQty(productId, delta) {
  const cart = getCart();
  const item  = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    saveCart(cart.filter(i => i.id !== productId));
    updateCartBadge();
    renderCartPage();
    return;
  }
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartItemCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}


/* ============================================================
   SECTION 5 – ORDER / CHECKOUT SYSTEM
   Order shape: { orderId, date, items[], total, status }
   ============================================================ */
function processCheckout() {
  const user = getLoggedInUser();
  if (!user) { window.location.href = "login.html"; return null; }

  const cart = getCart();
  if (cart.length === 0) return null;

  const order = {
    orderId: "ORD-" + Date.now(),
    date:    new Date().toISOString(),
    items:   [...cart],
    total:   getCartTotal(),
    status:  "Delivered"
  };

  user.orders.unshift(order);   // newest first
  user.cart = [];
  saveOneUser(user);
  updateCartBadge();
  return order;
}

function getUserOrders() {
  const user = getLoggedInUser();
  return user ? (user.orders || []) : [];
}


/* ============================================================
   SECTION 6 – UI HELPERS
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
  msg.textContent   = message;
  toast.className   = `toast toast--${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}


/* ============================================================
   SECTION 7 – NAVBAR AUTH (dropdown menu)
   ============================================================ */
function renderNavAuth() {
  const container = document.getElementById("navAuth");
  if (!container) return;

  const user = getLoggedInUser();

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
          </div>
          <div class="dropdown-divider"></div>
          <a href="orders.html" class="dropdown-item">
            <i class="fa-solid fa-box-open"></i> My Orders
            ${user.orders.length > 0
              ? `<span class="dropdown-badge">${user.orders.length}</span>`
              : ""}
          </a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item dropdown-item--danger" onclick="logoutUser()">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>
    `;

    /* Toggle dropdown */
    const toggle   = document.getElementById("userMenuToggle");
    const dropdown = document.getElementById("userDropdown");

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    /* Close when clicking outside */
    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
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
   SECTION 8 – PRODUCT CARDS (index.html)
   ============================================================ */
function buildProductCardHTML(product) {
  return `
    <div class="product-card">
      <a href="product.html?id=${product.id}" class="product-img-link">
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
        <a href="product.html?id=${product.id}" class="product-name-link">${product.name}</a>
        <div class="product-rating">
          <span class="stars">${buildStars(product.rating)}</span>
          <span class="rating-count">(${product.reviews.toLocaleString()})</span>
        </div>
        <div class="product-price-row">
          <span class="price-current">${formatPrice(product.price)}</span>
          <span class="price-original">${formatPrice(product.originalPrice)}</span>
          <span class="price-discount">${product.discount}% off</span>
        </div>
        <button class="add-to-cart-btn" data-id="${product.id}">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
        <a href="product.html?id=${product.id}" class="view-details-btn">
          View Details <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

function attachAddToCartListeners() {
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const id = parseInt(this.dataset.id);
      const p  = products.find(p => p.id === id);
      if (p) { addToCart(id); showToast(`"${p.name}" added to cart!`); }
    });
  });
}

function renderProducts() {
  renderFilteredProducts(products);
}

function renderFilteredProducts(list) {
  const grid    = document.getElementById("productGrid");
  const countEl = document.getElementById("resultCount");
  if (!grid) return;

  if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;

  if (!list.length) {
    grid.innerHTML = `<p class="empty-msg" style="grid-column:1/-1">
      <i class="fa-solid fa-magnifying-glass"></i> No products found.
    </p>`;
    return;
  }

  grid.innerHTML = list.map(buildProductCardHTML).join("");
  attachAddToCartListeners();
}


/* ============================================================
   SECTION 9 – CART PAGE  (cart.html)
   ============================================================ */
function renderCartPage() {
  const layout = document.getElementById("cartLayout");
  if (!layout) return;

  const cart = getCart();
  const user = getLoggedInUser();

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

  const itemsHTML = cart.map(item => `
    <div class="cart-item-card" id="cart-item-${item.id}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}"/>
      <div class="cart-item-body">
        <p class="cart-item-cat">${item.category}</p>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-unit">Unit price: ${formatPrice(item.price)}</p>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeCartQty(${item.id}, -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="changeCartQty(${item.id}, +1)">+</button>
          <button class="remove-btn" onclick="confirmRemove(${item.id})">
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

  const checkoutBtn = user
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

  const btn = document.getElementById("checkoutBtn");
  if (btn) {
    btn.addEventListener("click", function () {
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
      }
    });
  }
}

function confirmRemove(productId) {
  const item = getCart().find(i => i.id === productId);
  if (item && confirm(`Remove "${item.name}" from your cart?`)) {
    removeFromCart(productId);
    showToast("Item removed from cart.", "info");
    renderCartPage();
  }
}


/* ============================================================
   SECTION 10 – PRODUCT DETAIL PAGE  (product.html)
   ============================================================ */
function renderProductPage() {
  const panel = document.getElementById("productDetail");
  if (!panel) return;

  const params    = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));
  const product   = products.find(p => p.id === productId);

  if (!product) {
    panel.innerHTML = `<div class="detail-loading">
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
        <span class="rating-count">${product.rating} · ${product.reviews.toLocaleString()} reviews</span>
      </div>
      <div class="detail-divider"></div>
      <div class="detail-price-row">
        <span class="detail-price">${formatPrice(product.price)}</span>
        <span class="detail-original">${formatPrice(product.originalPrice)}</span>
        <span class="detail-discount">${product.discount}% OFF</span>
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
  document.getElementById("qtyMinus").addEventListener("click", () => {
    if (qty > 1) { qty--; qtyValEl.textContent = qty; }
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    if (qty < 10) { qty++; qtyValEl.textContent = qty; }
  });
  document.getElementById("detailAddCart").addEventListener("click", () => {
    addToCart(product.id, qty);
    showToast(`${qty}× "${product.name}" added to cart!`);
  });

  const related = products.filter(p => p.category === product.category && p.id !== product.id);
  const relGrid = document.getElementById("relatedGrid");
  if (relGrid) {
    relGrid.innerHTML = related.length
      ? related.map(buildProductCardHTML).join("")
      : `<p class="empty-msg">No related products found.</p>`;
    attachAddToCartListeners();
  }
}


/* ============================================================
   SECTION 11 – ORDERS PAGE  (orders.html)
   ============================================================ */
function renderOrdersPage() {
  const container = document.getElementById("ordersContainer");
  if (!container) return;

  const user = getLoggedInUser();

  /* Not logged in */
  if (!user) {
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

  const orders = getUserOrders();

  /* No orders yet */
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
    /* Show up to 3 thumbnail images, then a "+N more" badge */
    const thumbs = order.items.slice(0, 3).map(i =>
      `<img src="${i.image}" alt="${i.name}" class="order-thumb" title="${i.name}"/>`
    ).join("") + (order.items.length > 3
      ? `<span class="order-more-badge">+${order.items.length - 3}</span>`
      : "");

    /* Full item rows (shown when user expands) */
    const itemRows = order.items.map(i => `
      <div class="order-item-row">
        <img src="${i.image}" alt="${i.name}" class="order-item-img"/>
        <div class="order-item-info">
          <p class="order-item-name">${i.name}</p>
          <p class="order-item-meta">Qty: ${i.quantity} &middot; ${formatPrice(i.price)} each</p>
        </div>
        <p class="order-item-price">${formatPrice(i.price * i.quantity)}</p>
      </div>
    `).join("");

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
            <span class="order-status order-status--${order.status.toLowerCase()}">${order.status}</span>
            <span class="order-total-badge">${formatPrice(order.total)}</span>
          </div>
        </div>
        <div class="order-thumbs">${thumbs}</div>
        <div class="order-items-detail" id="detail-${order.orderId}" style="display:none">
          ${itemRows}
        </div>
        <button class="order-toggle-btn" onclick="toggleOrderDetail('${order.orderId}')">
          <i class="fa-solid fa-chevron-down"></i> View ${order.items.length} item${order.items.length !== 1 ? "s" : ""}
        </button>
      </div>
    `;
  }).join("");

  container.innerHTML = html;
}

/* Expand / collapse order item list */
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
