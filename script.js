/* ============================================================
   SHOP EASY – script.js  (Phase 2 — Updated)
   Shared across index.html, cart.html, product.html
   ============================================================ */


/* ----------------------------------------------------------
   1. PRODUCT DATA ARRAY
   Single source of truth for all products.
   ---------------------------------------------------------- */
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


/* ----------------------------------------------------------
   2. HELPERS
   ---------------------------------------------------------- */

/* Format price in Indian Rupees */
function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

/* Build star HTML string from a numeric rating */
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


/* ----------------------------------------------------------
   3. LOCALSTORAGE CART HELPERS
   ---------------------------------------------------------- */

/* Read cart from localStorage. Returns array (or [] if empty). */
function getCart() {
  const stored = localStorage.getItem("shopeasy_cart");
  return stored ? JSON.parse(stored) : [];
}

/* Save the cart array back to localStorage */
function saveCart(cart) {
  localStorage.setItem("shopeasy_cart", JSON.stringify(cart));
}

/* Add a product to the cart (or increase qty if already there) */
function addToCart(productId, qty = 1) {
  const cart    = getCart();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += qty;   // Already in cart → bump qty
  } else {
    cart.push({ ...product, quantity: qty });  // New item
  }

  saveCart(cart);        // Persist
  updateCartBadge();     // Refresh navbar count
}

/* Remove a product from cart completely */
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

/* Change quantity of a cart item (+1 or -1).
   Removes the item if quantity drops to 0. */
function changeCartQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    renderCartPage();   // Refresh cart page
    return;
  }

  saveCart(cart);
  updateCartBadge();
  renderCartPage();   // Refresh the cart page UI
}

/* Calculate total price of all cart items */
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/* Total number of items in cart (sum of quantities) */
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}


/* ----------------------------------------------------------
   4. UPDATE CART BADGE (navbar)
   ---------------------------------------------------------- */
function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;

  const count = getCartItemCount();
  badge.textContent = count;

  // Animate the badge with a "bump" effect
  badge.classList.remove("bump");
  void badge.offsetWidth;   // Trigger reflow
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);
}


/* ----------------------------------------------------------
   5. TOAST NOTIFICATION
   ---------------------------------------------------------- */
let _toastTimer = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  const msg   = document.getElementById("toastMsg");
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add("show");

  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}


/* ----------------------------------------------------------
   6. RENDER PRODUCT CARDS (index.html)
   Builds a product card for each item and injects into grid.
   ---------------------------------------------------------- */
function buildProductCardHTML(product) {
  return `
    <div class="product-card">

      <!-- Clicking the image → goes to product detail page -->
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

        <!-- Clicking the name also goes to product detail page -->
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

        <!-- Add to Cart button – calls addToCart() then shows toast -->
        <button class="add-to-cart-btn" data-id="${product.id}">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>

        <!-- View Details link -->
        <a href="product.html?id=${product.id}" class="view-details-btn">
          View Details <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

/* Wire up all "Add to Cart" buttons in the product grid */
function attachAddToCartListeners() {
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();    // Don't navigate
      const id = parseInt(this.dataset.id);
      const p  = products.find(p => p.id === id);
      if (p) {
        addToCart(id);
        showToast(`"${p.name}" added to cart!`);
      }
    });
  });
}

/* Renders full products array into #productGrid */
function renderProducts() {
  renderFilteredProducts(products);
}

/* Renders a filtered subset */
function renderFilteredProducts(list) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const countEl = document.getElementById("resultCount");
  if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;

  if (list.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--clr-mid);padding:40px">
      No products found. Try a different search.
    </p>`;
    return;
  }

  grid.innerHTML = list.map(buildProductCardHTML).join("");
  attachAddToCartListeners();
}


/* ----------------------------------------------------------
   7. RENDER CART PAGE (cart.html)
   ---------------------------------------------------------- */
function renderCartPage() {
  const layout = document.getElementById("cartLayout");
  if (!layout) return;

  const cart = getCart();

  /* Empty state */
  if (cart.length === 0) {
    layout.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-shopping empty-cart-icon"></i>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <a href="index.html"><i class="fa-solid fa-arrow-left"></i> Start Shopping</a>
      </div>
    `;
    return;
  }

  /* Build item rows */
  const itemsHTML = cart.map(item => `
    <div class="cart-item-card" id="cart-item-${item.id}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}"/>

      <div class="cart-item-body">
        <p class="cart-item-cat">${item.category}</p>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-unit">Unit price: ${formatPrice(item.price)}</p>

        <!-- Qty controls -->
        <div class="qty-row">
          <button class="qty-btn" onclick="changeCartQty(${item.id}, -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="changeCartQty(${item.id}, +1)">+</button>

          <!-- Inline remove -->
          <button class="remove-btn" onclick="confirmRemove(${item.id})">
            <i class="fa-solid fa-trash-can"></i> Remove
          </button>
        </div>
      </div>

      <!-- Subtotal for this line item -->
      <div class="cart-item-subtotal">
        ${formatPrice(item.price * item.quantity)}
      </div>
    </div>
  `).join("");

  /* Calculate order totals */
  const subtotal  = getCartTotal();
  const delivery  = subtotal > 500 ? 0 : 49;
  const discount  = Math.round(subtotal * 0.05);   // 5% coupon simulation
  const grandTotal = subtotal + delivery - discount;

  layout.innerHTML = `
    <!-- LEFT: Cart item list -->
    <div class="cart-items-list">${itemsHTML}</div>

    <!-- RIGHT: Order summary -->
    <div class="order-summary">
      <p class="summary-title">Order Summary</p>

      <div class="summary-row">
        <span>Subtotal (${getCartItemCount()} items)</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Delivery</span>
        <span>${delivery === 0 ? '<span style="color:var(--clr-green);font-weight:600">FREE</span>' : formatPrice(delivery)}</span>
      </div>
      <div class="summary-row">
        <span>Coupon Discount (5%)</span>
        <span style="color:var(--clr-green)">− ${formatPrice(discount)}</span>
      </div>

      <div class="summary-row total">
        <span>Total</span>
        <span>${formatPrice(grandTotal)}</span>
      </div>

      <button class="checkout-btn" onclick="showToast('Checkout coming soon! 🚀')">
        <i class="fa-solid fa-lock"></i> Proceed to Checkout
      </button>

      <p class="secure-note">
        <i class="fa-solid fa-shield-halved"></i> Secure checkout · 256-bit SSL
      </p>
    </div>
  `;
}

/* Ask confirmation before removing an item */
function confirmRemove(productId) {
  const item = getCart().find(i => i.id === productId);
  if (!item) return;

  if (confirm(`Remove "${item.name}" from your cart?`)) {
    removeFromCart(productId);
    showToast("Item removed from cart.");
    renderCartPage();   // Refresh the page
  }
}


/* ----------------------------------------------------------
   8. RENDER PRODUCT DETAIL PAGE (product.html)
   Reads ?id=N from the URL, finds the product, builds the UI.
   ---------------------------------------------------------- */
function renderProductPage() {
  const panel = document.getElementById("productDetail");
  if (!panel) return;

  /* Read product id from the URL query string: product.html?id=3 */
  const params    = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));
  const product   = products.find(p => p.id === productId);

  /* Product not found */
  if (!product) {
    panel.innerHTML = `
      <div class="detail-loading">
        <i class="fa-solid fa-triangle-exclamation" style="color:var(--clr-red)"></i>
        Product not found. <a href="index.html" style="color:var(--clr-primary)">Go back home →</a>
      </div>
    `;
    return;
  }

  /* Update page title & breadcrumb */
  document.title = `SHOP EASY – ${product.name}`;
  const bCat  = document.getElementById("breadcrumbCat");
  const bName = document.getElementById("breadcrumbName");
  if (bCat)  bCat.textContent  = product.category;
  if (bName) bName.textContent = product.name;

  /* Feature tags */
  const featuresHTML = (product.features || [])
    .map(f => `<span class="feature-tag"><i class="fa-solid fa-check" style="color:var(--clr-green);margin-right:4px"></i>${f}</span>`)
    .join("");

  /* Build detail panel HTML */
  panel.innerHTML = `
    <!-- LEFT: Product image -->
    <div class="detail-image-wrap">
      <img src="${product.image}" alt="${product.name}"/>
      <span class="badge badge-${product.badge}">${product.badge}</span>
    </div>

    <!-- RIGHT: Product info -->
    <div class="detail-info">
      <p class="detail-category">${product.category}</p>
      <h1 class="detail-name">${product.name}</h1>

      <!-- Rating -->
      <div class="detail-rating">
        <span class="stars">${buildStars(product.rating)}</span>
        <span class="rating-count">${product.rating} · ${product.reviews.toLocaleString()} reviews</span>
      </div>

      <div class="detail-divider"></div>

      <!-- Price -->
      <div class="detail-price-row">
        <span class="detail-price">${formatPrice(product.price)}</span>
        <span class="detail-original">${formatPrice(product.originalPrice)}</span>
        <span class="detail-discount">${product.discount}% OFF</span>
      </div>

      <!-- Description -->
      <p class="detail-desc">${product.description}</p>

      <!-- Features -->
      <div class="detail-features">${featuresHTML}</div>

      <div class="detail-divider"></div>

      <!-- Quantity selector -->
      <div class="detail-qty">
        <span class="detail-qty-label">Quantity:</span>
        <div class="detail-qty-controls">
          <button class="detail-qty-btn" id="qtyMinus">−</button>
          <span class="detail-qty-val" id="qtyVal">1</span>
          <button class="detail-qty-btn" id="qtyPlus">+</button>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="detail-actions">
        <button class="btn-add-cart" id="detailAddCart">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
        <a href="cart.html" class="btn-go-cart">
          <i class="fa-solid fa-cart-shopping"></i> View Cart
        </a>
      </div>

      <!-- Delivery info -->
      <div class="detail-delivery">
        <div class="delivery-chip"><i class="fa-solid fa-truck-fast"></i> Free delivery over ₹500</div>
        <div class="delivery-chip"><i class="fa-solid fa-rotate-left"></i> 7-day easy returns</div>
        <div class="delivery-chip"><i class="fa-solid fa-shield-halved"></i> Secure payments</div>
      </div>
    </div>
  `;

  /* Quantity control logic */
  let qty = 1;
  const qtyVal   = document.getElementById("qtyVal");
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus  = document.getElementById("qtyPlus");

  qtyMinus.addEventListener("click", () => {
    if (qty > 1) { qty--; qtyVal.textContent = qty; }
  });
  qtyPlus.addEventListener("click", () => {
    if (qty < 10) { qty++; qtyVal.textContent = qty; }
  });

  /* Add to Cart from detail page */
  document.getElementById("detailAddCart").addEventListener("click", () => {
    addToCart(product.id, qty);
    showToast(`${qty}× "${product.name}" added to cart!`);
  });

  /* Render related products (same category, exclude current) */
  const related = products.filter(p => p.category === product.category && p.id !== product.id);
  const relGrid = document.getElementById("relatedGrid");
  if (relGrid) {
    if (related.length === 0) {
      relGrid.innerHTML = `<p style="color:var(--clr-mid)">No related products found.</p>`;
    } else {
      relGrid.innerHTML = related.map(buildProductCardHTML).join("");
      attachAddToCartListeners();  // Wire up add-to-cart on related cards
    }
  }
}
