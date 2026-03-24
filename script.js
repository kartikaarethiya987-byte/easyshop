/* ============================================================
   SHOP EASY – script.js
   All cart logic, product rendering, and UI interactions.
   ============================================================ */

/* ----------------------------------------------------------
   1. PRODUCT DATA
   Each object represents one product in the store.
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
    badge: "sale",          // sale | new | hot | best
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
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
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
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
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80"
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
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80"
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
    image: "https://images.unsplash.com/photo-1584786996374-80dfa87e2c3f?w=400&q=80"
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
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80"
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
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4d2f?w=400&q=80"
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
    image: "https://images.unsplash.com/photo-1601925228523-e22ac7aaf2a0?w=400&q=80"
  }
];


/* ----------------------------------------------------------
   2. CART STATE
   cartItems holds the array of products in the cart.
   Each entry: { ...productData, quantity: N }
   ---------------------------------------------------------- */
let cartItems = [];   // Our cart array


/* ----------------------------------------------------------
   3. HELPER – Format price in Indian Rupees
   ---------------------------------------------------------- */
function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}


/* ----------------------------------------------------------
   4. RENDER PRODUCTS
   Builds HTML for each product card and inserts it into
   the #productGrid div.
   ---------------------------------------------------------- */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = ""; // Clear existing cards before rendering

  // Loop through each product in the products array
  products.forEach(product => {

    // Build star icons based on the rating (max 5 stars)
    const fullStars  = Math.floor(product.rating);
    const halfStar   = product.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    let starsHTML = "";
    for (let i = 0; i < fullStars; i++)  starsHTML += '<i class="fa-solid fa-star"></i>';
    if (halfStar)                         starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="fa-regular fa-star"></i>';

    // Create the product card HTML string
    const card = `
      <div class="product-card" id="product-${product.id}">

        <!-- Image section -->
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />

          <!-- Badge (sale / new / hot / best) -->
          <span class="badge badge-${product.badge}">${product.badge}</span>

          <!-- Wishlist icon -->
          <button class="wishlist-btn" aria-label="Add to wishlist">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>

        <!-- Text info section -->
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <p class="product-name">${product.name}</p>

          <!-- Star rating -->
          <div class="product-rating">
            <span class="stars">${starsHTML}</span>
            <span class="rating-count">(${product.reviews.toLocaleString()})</span>
          </div>

          <!-- Price row -->
          <div class="product-price-row">
            <span class="price-current">${formatPrice(product.price)}</span>
            <span class="price-original">${formatPrice(product.originalPrice)}</span>
            <span class="price-discount">${product.discount}% off</span>
          </div>

          <!-- Add to Cart button (data-id links this button to the product) -->
          <button class="add-to-cart-btn" data-id="${product.id}">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `;

    // Insert the card HTML into the grid
    grid.insertAdjacentHTML("beforeend", card);
  });

  // Attach click listeners to ALL "Add to Cart" buttons
  attachCartListeners();
}


/* ----------------------------------------------------------
   5. ATTACH CART BUTTON LISTENERS
   Called after rendering so every button is wired up.
   ---------------------------------------------------------- */
function attachCartListeners() {
  const buttons = document.querySelectorAll(".add-to-cart-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", function () {
      // Get product id from the button's data-id attribute
      const productId = parseInt(this.getAttribute("data-id"));

      // Find the matching product in our products array
      const product = products.find(p => p.id === productId);

      if (product) {
        addToCart(product);        // Add to cart array
        showToast(`"${product.name}" added to cart!`);  // Show confirmation
      }
    });
  });
}


/* ----------------------------------------------------------
   6. ADD TO CART
   If the item already exists in the cart, increase qty.
   Otherwise push a new entry with quantity = 1.
   ---------------------------------------------------------- */
function addToCart(product) {

  // Check if item already in cart
  const existingItem = cartItems.find(item => item.id === product.id);

  if (existingItem) {
    // Item found – increase quantity
    existingItem.quantity += 1;
  } else {
    // New item – add with quantity 1
    cartItems.push({ ...product, quantity: 1 });
  }

  // Update the cart count badge in the navbar
  updateCartCount();

  // Re-render the cart sidebar contents
  renderCartSidebar();
}


/* ----------------------------------------------------------
   7. REMOVE FROM CART
   Removes an item by id from the cartItems array.
   ---------------------------------------------------------- */
function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item.id !== productId);
  updateCartCount();
  renderCartSidebar();
}


/* ----------------------------------------------------------
   8. CHANGE QUANTITY
   Increases or decreases quantity. Removes if qty drops to 0.
   ---------------------------------------------------------- */
function changeQty(productId, delta) {
  const item = cartItems.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;

  // If qty hits 0 or below, remove the item entirely
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  updateCartCount();
  renderCartSidebar();
}


/* ----------------------------------------------------------
   9. UPDATE CART COUNT BADGE
   Counts total quantity across all cart items.
   ---------------------------------------------------------- */
function updateCartCount() {
  const badge = document.getElementById("cartCount");

  // Total number of items (sum of all quantities)
  const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = total;

  // Animate the badge with a quick "bump" effect
  badge.classList.remove("bump");
  void badge.offsetWidth;           // Force browser reflow to restart animation
  badge.classList.add("bump");

  // Remove the animation class after it completes
  setTimeout(() => badge.classList.remove("bump"), 300);
}


/* ----------------------------------------------------------
   10. RENDER CART SIDEBAR
   Builds the list of items inside the cart drawer.
   ---------------------------------------------------------- */
function renderCartSidebar() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal          = document.getElementById("cartTotal");

  // If cart is empty, show placeholder message
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <p class="empty-cart-msg">
        <i class="fa-solid fa-cart-shopping" style="font-size:2rem; display:block; margin-bottom:12px; opacity:.3"></i>
        Your cart is empty. Start shopping!
      </p>
    `;
    cartTotal.textContent = "₹0";
    return;
  }

  // Build HTML for each cart item
  let itemsHTML = "";
  let total = 0;

  cartItems.forEach(item => {
    total += item.price * item.quantity;

    itemsHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
          <!-- Quantity controls -->
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
          </div>
        </div>
        <!-- Remove button -->
        <button class="remove-item" onclick="removeFromCart(${item.id})" aria-label="Remove item">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = itemsHTML;
  cartTotal.textContent = formatPrice(total);
}


/* ----------------------------------------------------------
   11. CART SIDEBAR OPEN / CLOSE
   ---------------------------------------------------------- */
function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";       // Restore scroll
}

// Cart icon in navbar → open cart
document.getElementById("cartBtn").addEventListener("click", openCart);

// Close button inside sidebar → close cart
document.getElementById("closeCart").addEventListener("click", closeCart);

// Clicking the dark overlay → close cart
document.getElementById("cartOverlay").addEventListener("click", closeCart);


/* ----------------------------------------------------------
   12. TOAST NOTIFICATION
   Shows a temporary message at the bottom of the screen.
   ---------------------------------------------------------- */
let toastTimer = null; // We store the timer so we can reset it if needed

function showToast(message) {
  const toast    = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");

  toastMsg.textContent = message;
  toast.classList.add("show");

  // Clear any previous timer so multiple rapid clicks don't conflict
  clearTimeout(toastTimer);

  // Auto-hide the toast after 2.5 seconds
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


/* ----------------------------------------------------------
   13. CATEGORY PILL FILTER
   Clicking a pill filters products by category.
   "All" shows everything.
   ---------------------------------------------------------- */
document.querySelectorAll(".pill").forEach(pill => {
  pill.addEventListener("click", function () {

    // Update active pill styling
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    this.classList.add("active");

    const selected = this.textContent.trim();

    // Filter or show all
    const filtered = selected === "All"
      ? products
      : products.filter(p => p.category === selected);

    // Re-render grid with filtered products
    renderFilteredProducts(filtered);
  });
});

/* Renders a custom array of products (used for filtering) */
function renderFilteredProducts(filteredProducts) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (filteredProducts.length === 0) {
    grid.innerHTML = `<p style="color:var(--clr-mid); grid-column:1/-1; text-align:center; padding:40px 0;">
      No products found in this category.
    </p>`;
    return;
  }

  filteredProducts.forEach(product => {
    const fullStars  = Math.floor(product.rating);
    const halfStar   = product.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    let starsHTML = "";
    for (let i = 0; i < fullStars; i++)  starsHTML += '<i class="fa-solid fa-star"></i>';
    if (halfStar)                         starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="fa-regular fa-star"></i>';

    const card = `
      <div class="product-card" id="product-${product.id}">
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <span class="badge badge-${product.badge}">${product.badge}</span>
          <button class="wishlist-btn" aria-label="Add to wishlist"><i class="fa-regular fa-heart"></i></button>
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <p class="product-name">${product.name}</p>
          <div class="product-rating">
            <span class="stars">${starsHTML}</span>
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
        </div>
      </div>
    `;
    grid.insertAdjacentHTML("beforeend", card);
  });

  attachCartListeners(); // Re-attach listeners to newly rendered buttons
}


/* ----------------------------------------------------------
   14. SEARCH BAR – Live filter as user types
   ---------------------------------------------------------- */
document.querySelector(".search-input").addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();

  if (query === "") {
    // Empty search → show all products
    renderProducts();
    return;
  }

  // Filter products whose name or category matches the query
  const results = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  renderFilteredProducts(results);
});


/* ----------------------------------------------------------
   15. INIT – Run when page loads
   ---------------------------------------------------------- */
renderProducts();       // Draw all product cards on page load
renderCartSidebar();    // Initialise sidebar (shows empty state)
