/* ================================================================
   SHOP EASY  script.js  Clean Unified Build
   100% localStorage. No backend. No duplicate functions.
   ================================================================

   SECTION MAP
   §1  Storage Keys
   §2  Seed Data
   §3  User Helpers
   §4  Product CRUD
   §5  Cart Helpers
   §6  Global Order Store (se_orders - admin view)
   §7  UI Helpers
   §8  Navbar
   §9  Product Card Builder
   §10 Index Page
   §11 Product Detail
   §12 Cart Page
   §13 Orders History Page
   §14 Admin Page (products / users / ALL ORDERS)
   §15 Page Protection
   §16 Address CRUD
   §17 Order.html Checkout Page
   §18 Form Validation
   ================================================================ */


/* ================================================================
   §1  STORAGE KEYS
   ================================================================ */
const KEYS = {
  USERS:    "se_users",
  SESSION:  "se_session",
  PRODUCTS: "se_products",
  ORDERS:   "se_orders"
};


/* ================================================================
   §2  SEED DEFAULT DATA
   ================================================================ */
function seedDefaultData() {
  var users    = getAllUsers();
  var adminIdx = users.findIndex(function(u){ return u.email === "admin@example.com"; });

  if (adminIdx === -1) {
    /* Admin does not exist yet – create it */
    users.push({
      id:"admin-001", name:"Admin", email:"admin@example.com",
      password:"123456", isAdmin:true, addresses:[], cart:[], orders:[]
    });
    saveAllUsers(users);
  } else {
    /* Admin already exists – always force-correct the isAdmin flag.
       This fixes cases where old localStorage data had isAdmin missing
       or corrupted from a previous version of the site. */
    var changed = false;
    if (!users[adminIdx].isAdmin)        { users[adminIdx].isAdmin  = true;    changed = true; }
    if (users[adminIdx].password !== "123456") { /* keep existing password */          }
    if (!users[adminIdx].addresses)      { users[adminIdx].addresses = [];     changed = true; }
    if (!users[adminIdx].cart)           { users[adminIdx].cart      = [];     changed = true; }
    if (!users[adminIdx].orders)         { users[adminIdx].orders    = [];     changed = true; }
    if (changed) saveAllUsers(users);
  }
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify([
      { id:"p1", name:"Wireless Noise-Cancelling Headphones",
        category:"Electronics", price:2999, originalPrice:4999,
        discount:40, rating:4.5, reviews:1243, badge:"sale", stock:25,
        image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        description:"Crystal-clear audio, 40dB ANC, 30hr battery, USB-C fast charge.",
        features:["30-hr battery","ANC","Bluetooth 5.3","USB-C","Foldable"] },
      { id:"p2", name:"Men's Classic White Sneakers",
        category:"Fashion", price:1499, originalPrice:2499,
        discount:40, rating:4.3, reviews:876, badge:"hot", stock:40,
        image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        description:"Premium vegan leather, lightweight EVA sole, sizes 6-12.",
        features:["Vegan Leather","EVA Sole","Sizes 6-12","Unisex"] },
      { id:"p3", name:"Stainless Steel Water Bottle 1L",
        category:"Sports", price:499, originalPrice:799,
        discount:38, rating:4.7, reviews:3312, badge:"best", stock:100,
        image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
        description:"Cold 24h, hot 12h. BPA-free, leak-proof.",
        features:["24hr Cold","BPA Free","1 Litre","Leak-proof"] },
      { id:"p4", name:"Organic Face Moisturiser SPF 50",
        category:"Beauty", price:849, originalPrice:1299,
        discount:35, rating:4.4, reviews:568, badge:"new", stock:60,
        image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
        description:"SPF 50, aloe vera, hyaluronic acid. All skin types.",
        features:["SPF 50","Organic","Non-Comedogenic","50ml"] },
      { id:"p5", name:"Non-Stick Cookware Set (5-piece)",
        category:"Home & Kitchen", price:3499, originalPrice:5499,
        discount:36, rating:4.6, reviews:2041, badge:"sale", stock:20,
        image:"https://images.unsplash.com/photo-1584786996374-80dfa87e2c3f?w=600&q=80",
        description:"PFOA-free ceramic. Induction, gas & electric compatible.",
        features:["5-piece","PFOA-Free","Induction","Oven Safe 220C"] },
      { id:"p6", name:"Portable Bluetooth Speaker",
        category:"Electronics", price:1799, originalPrice:2999,
        discount:40, rating:4.2, reviews:730, badge:"hot", stock:35,
        image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
        description:"360 sound, IPX7 waterproof, 20hr battery, power bank.",
        features:["IPX7","360 Sound","20hr","Power Bank"] },
      { id:"p7", name:"Women's Floral Kurti",
        category:"Fashion", price:699, originalPrice:1299,
        discount:46, rating:4.5, reviews:1875, badge:"new", stock:75,
        image:"https://images.unsplash.com/photo-1594938298603-c8148c4b4d2f?w=600&q=80",
        description:"Breathable Rayon, A-line fit, machine washable.",
        features:["Rayon","A-Line","Machine Washable","S-3XL"] },
      { id:"p8", name:"Yoga Mat Anti-Slip 6mm",
        category:"Sports", price:599, originalPrice:999,
        discount:40, rating:4.8, reviews:4105, badge:"best", stock:55,
        image:"https://images.unsplash.com/photo-1601925228523-e22ac7aaf2a0?w=600&q=80",
        description:"6mm TPE foam, carry strap included, eco-friendly.",
        features:["6mm","Non-slip","TPE Foam","Carry Strap"] }
    ]));
  }
}


/* ================================================================
   §3  USER HELPERS
   ================================================================ */
function getAllUsers() {
  var raw = localStorage.getItem(KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}
function saveAllUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}
function findUserByEmail(email) {
  return getAllUsers().find(function(u){
    return u.email.toLowerCase() === email.toLowerCase();
  }) || null;
}
function saveOneUser(updated) {
  var users = getAllUsers();
  var idx   = users.findIndex(function(u){ return u.email === updated.email; });
  if (idx !== -1) { users[idx] = updated; saveAllUsers(users); }
}
function getCurrentUser() {
  var email = localStorage.getItem(KEYS.SESSION);
  return email ? findUserByEmail(email) : null;
}
function isLoggedIn() { return !!getCurrentUser(); }
function isAdmin()    { var u = getCurrentUser(); return u ? !!u.isAdmin : false; }

function registerUser(name, email, password) {
  if (findUserByEmail(email))
    return { success:false, message:"Email already registered. Please log in." };
  var users = getAllUsers();
  users.push({
    id:"u-"+Date.now(), name:name.trim(),
    email:email.toLowerCase().trim(), password:password,
    isAdmin:false, addresses:[], cart:[], orders:[]
  });
  saveAllUsers(users);
  return { success:true };
}

function loginUser(email, password) {
  var user = findUserByEmail(email);
  if (!user || user.password !== password)
    return { success:false, message:"Incorrect email or password." };
  localStorage.setItem(KEYS.SESSION, user.email);
  return { success:true, name:user.name, isAdmin:user.isAdmin };
}

function logoutUser() {
  localStorage.removeItem(KEYS.SESSION);
  window.location.href = "index.html";
}

function loginAndRedirect(email, password) {
  var result = loginUser(email, password);
  if (!result.success) return result;

  var saved = localStorage.getItem("se_redirect");
  localStorage.removeItem("se_redirect");

  /* Admins always go to admin.html – never let a saved redirect
     from a normal page (cart.html, Order.html etc.) override this. */
  if (result.isAdmin) {
    window.location.href = "admin.html";
  } else {
    /* Regular users: go to saved page (e.g. cart they were on) or home */
    window.location.href = saved || "index.html";
  }
  return result;
}

function handleRedirectAfterLogin() {
  if (localStorage.getItem("se_access_denied")) {
    localStorage.removeItem("se_access_denied");
    showToast("Admin access required.", "error");
  }
}


/* ================================================================
   §4  PRODUCT CRUD
   ================================================================ */
function getAllProducts() {
  var raw = localStorage.getItem(KEYS.PRODUCTS);
  return raw ? JSON.parse(raw) : [];
}
function saveAllProducts(products) {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
}
function getProductById(id) {
  return getAllProducts().find(function(p){ return p.id === id; }) || null;
}

function adminAddProduct(data) {
  var products = getAllProducts();
  products.push({
    id:"p-"+Date.now(),
    name:data.name.trim(), category:data.category,
    price:Number(data.price),
    originalPrice:Number(data.originalPrice) || Number(data.price),
    discount:Number(data.discount) || 0,
    rating:Number(data.rating) || 0,
    reviews:Number(data.reviews) || 0,
    badge:data.badge || "new",
    stock:Number(data.stock) || 0,
    image:(data.image||"").trim() || "https://via.placeholder.com/400",
    description:(data.description||"").trim(),
    features: data.features
      ? String(data.features).split(",").map(function(f){ return f.trim(); }).filter(Boolean)
      : []
  });
  saveAllProducts(products);
}

function adminEditProduct(id, data) {
  var products = getAllProducts();
  var idx = products.findIndex(function(p){ return p.id === id; });
  if (idx === -1) return false;
  var p = products[idx];
  products[idx] = Object.assign({}, p, {
    name:data.name.trim(), category:data.category,
    price:Number(data.price),
    originalPrice:Number(data.originalPrice) || Number(data.price),
    discount:Number(data.discount) || 0,
    stock:Number(data.stock),
    badge:data.badge || p.badge,
    image:(data.image||"").trim() || p.image,
    description:(data.description||"").trim(),
    features: data.features
      ? String(data.features).split(",").map(function(f){ return f.trim(); }).filter(Boolean)
      : p.features
  });
  saveAllProducts(products);
  return true;
}

function adminDeleteProduct(id) {
  saveAllProducts(getAllProducts().filter(function(p){ return p.id !== id; }));
}

function reduceStock(productId, qty) {
  var products = getAllProducts();
  var p = products.find(function(p){ return p.id === productId; });
  if (p) { p.stock = Math.max(0, p.stock - qty); saveAllProducts(products); }
}


/* ================================================================
   §5  CART HELPERS
   ================================================================ */
function getCart() {
  var u = getCurrentUser();
  return u ? (u.cart || []) : [];
}
function saveCart(cart) {
  var u = getCurrentUser();
  if (!u) return;
  u.cart = cart;
  saveOneUser(u);
}

function addToCart(productId, qty) {
  qty = qty || 1;
  var product  = getProductById(productId);
  if (!product) return { success:false, message:"Product not found." };
  var cart     = getCart();
  var existing = cart.find(function(i){ return i.productId === productId; });
  var inCart   = existing ? existing.quantity : 0;
  if (inCart + qty > product.stock)
    return { success:false, message:"Only "+(product.stock - inCart)+" left in stock." };
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      productId:productId, name:product.name, price:product.price,
      image:product.image, category:product.category, quantity:qty
    });
  }
  saveCart(cart);
  updateCartBadge();
  return { success:true };
}

function removeFromCart(productId) {
  saveCart(getCart().filter(function(i){ return i.productId !== productId; }));
  updateCartBadge();
}

function changeCartQty(productId, delta) {
  var cart    = getCart();
  var item    = cart.find(function(i){ return i.productId === productId; });
  if (!item) return;
  var product = getProductById(productId);
  var newQty  = item.quantity + delta;
  if (newQty <= 0) {
    saveCart(cart.filter(function(i){ return i.productId !== productId; }));
  } else {
    if (product && newQty > product.stock) {
      showToast("Only "+product.stock+" in stock.", "error");
      return;
    }
    item.quantity = newQty;
    saveCart(cart);
  }
  updateCartBadge();
  renderCartPage();
}

function getCartTotal() {
  return getCart().reduce(function(s,i){ return s + i.price * i.quantity; }, 0);
}
function getCartItemCount() {
  return getCart().reduce(function(s,i){ return s + i.quantity; }, 0);
}
function getUserOrders() {
  var u = getCurrentUser();
  return u ? (u.orders || []) : [];
}


/* ================================================================
   §6  GLOBAL ORDER STORE  (se_orders - admin sees all)
   ================================================================ */
function placeOrder(order, user) {
  var raw    = localStorage.getItem(KEYS.ORDERS);
  var orders = raw ? JSON.parse(raw) : [];
  var record = Object.assign({}, order, {
    userEmail: user ? user.email : "guest",
    userName:  user ? user.name  : "Guest"
  });
  orders.unshift(record);
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
}

function loadOrders() {
  var raw = localStorage.getItem(KEYS.ORDERS);
  return raw ? JSON.parse(raw) : [];
}

function clearOrders() {
  if (!confirm("Delete ALL orders permanently? This cannot be undone.")) return;
  localStorage.removeItem(KEYS.ORDERS);
  renderAdminOrders();
  renderAdminStats();
  showToast("All orders cleared.", "info");
}


/* ================================================================
   §7  UI HELPERS
   ================================================================ */
function formatPrice(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day:"numeric", month:"long", year:"numeric"
  });
}

function buildStars(rating) {
  var full  = Math.floor(rating);
  var half  = rating % 1 >= 0.5 ? 1 : 0;
  var empty = 5 - full - half;
  var s = "";
  for (var i=0; i<full;  i++) s += '<i class="fa-solid fa-star"></i>';
  if (half)                    s += '<i class="fa-solid fa-star-half-stroke"></i>';
  for (var i=0; i<empty; i++) s += '<i class="fa-regular fa-star"></i>';
  return s;
}

function updateCartBadge() {
  var el = document.getElementById("cartCount");
  if (!el) return;
  el.textContent = getCartItemCount();
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
  setTimeout(function(){ el.classList.remove("bump"); }, 300);
}

var _toastTimer = null;
function showToast(msg, type) {
  type = type || "success";
  var toast = document.getElementById("toast");
  var span  = document.getElementById("toastMsg");
  if (!toast || !span) return;
  span.textContent = msg;
  toast.className  = "toast toast--" + type + " show";
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function(){ toast.classList.remove("show"); }, 2800);
}

function stockBadgeHTML(stock) {
  if (stock <= 0) return '<span class="stock-badge stock-badge--out">Out of Stock</span>';
  if (stock <= 5) return '<span class="stock-badge stock-badge--low">Only '+stock+' left</span>';
  return '<span class="stock-badge stock-badge--ok">In Stock ('+stock+')</span>';
}

function hideLoader() {
  var el = document.getElementById("pageLoader");
  if (el) { el.classList.add("hidden"); setTimeout(function(){ el.remove(); }, 450); }
}

function generateDeliverySlots() {
  var times    = ["9:00 AM - 12:00 PM","12:00 PM - 3:00 PM",
                  "3:00 PM - 6:00 PM","6:00 PM - 9:00 PM"];
  var dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var months   = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"];
  var slots = [];
  for (var d = 0; d < 3; d++) {
    var dt = new Date();
    dt.setDate(dt.getDate() + d + 1);
    var lbl = d === 0 ? "Tomorrow"
      : dayNames[dt.getDay()]+" "+dt.getDate()+" "+months[dt.getMonth()];
    for (var t = 0; t < times.length; t++) {
      slots.push(lbl + " - " + times[t]);
    }
  }
  return slots;
}

function calculateExtraCharge(timeStr) {
  if (!timeStr) return 0;
  var diff = new Date(timeStr).getTime() - Date.now();
  return (diff > 0 && diff < 24 * 60 * 60 * 1000) ? 100 : 0;
}


/* ================================================================
   §8  NAVBAR
   ================================================================ */
function renderNavAuth() {
  var container = document.getElementById("navAuth");
  if (!container) return;
  var user = getCurrentUser();

  if (user) {
    var ordersLink = '<a href="orders.html" class="dropdown-item">'
      + '<i class="fa-solid fa-box-open"></i> My Orders'
      + (user.orders.length > 0 ? '<span class="dropdown-badge">'+user.orders.length+'</span>' : "")
      + '</a>';
    var adminLink = user.isAdmin
      ? '<a href="admin.html" class="dropdown-item dropdown-item--admin">'
        + '<i class="fa-solid fa-screwdriver-wrench"></i> Admin Panel</a>'
      : "";
    var adminBadge = user.isAdmin
      ? '<span class="dropdown-admin-badge"><i class="fa-solid fa-shield-halved"></i> Admin</span>'
      : "";

    container.innerHTML =
      '<div class="nav-user-menu" id="navUserMenu">'
      + '<button class="nav-user-chip" id="userMenuToggle" aria-expanded="false">'
      + '<i class="fa-solid fa-circle-user"></i>'
      + '<span>'+user.name.split(" ")[0]+'</span>'
      + '<i class="fa-solid fa-chevron-down nav-chevron"></i>'
      + '</button>'
      + '<div class="nav-user-dropdown" id="userDropdown">'
      + '<div class="dropdown-header">'
      + '<p class="dropdown-name">'+user.name+'</p>'
      + '<p class="dropdown-email">'+user.email+'</p>'
      + adminBadge
      + '</div>'
      + '<div class="dropdown-divider"></div>'
      + ordersLink
      + adminLink
      + '<div class="dropdown-divider"></div>'
      + '<button class="dropdown-item dropdown-item--danger" onclick="logoutUser()">'
      + '<i class="fa-solid fa-right-from-bracket"></i> Logout</button>'
      + '</div></div>';

    var toggle   = document.getElementById("userMenuToggle");
    var dropdown = document.getElementById("userDropdown");
    toggle.addEventListener("click", function(e) {
      e.stopPropagation();
      var open = dropdown.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function() {
      if (dropdown) dropdown.classList.remove("open");
      if (toggle)   toggle.setAttribute("aria-expanded","false");
    });
  } else {
    container.innerHTML =
      '<a href="login.html" class="nav-auth-login">'
      + '<i class="fa-solid fa-right-to-bracket"></i> Login</a>'
      + '<a href="register.html" class="nav-auth-register">'
      + '<i class="fa-solid fa-user-plus"></i> Register</a>';
  }
}


/* ================================================================
   §9  PRODUCT CARD BUILDER
   ================================================================ */
function buildProductCardHTML(product) {
  var oos = product.stock <= 0;
  var priceRow = '<span class="price-current">'+formatPrice(product.price)+'</span>';
  if (product.originalPrice > product.price)
    priceRow += '<span class="price-original">'+formatPrice(product.originalPrice)+'</span>';
  if (product.discount)
    priceRow += '<span class="price-discount">'+product.discount+'% off</span>';

  return '<div class="product-card '+(oos?"product-card--oos":"")+'"><a href="product.html?id='+product.id+'" class="product-img-link"><div class="product-img-wrap"><img src="'+product.image+'" alt="'+product.name+'" loading="lazy" onerror="this.src=\'https://via.placeholder.com/400\'"/><span class="badge badge-'+product.badge+'">'+product.badge+'</span>'+(oos?'<div class="oos-overlay">Out of Stock</div>':"")+'</div></a><div class="product-info"><span class="product-category">'+product.category+'</span><a href="product.html?id='+product.id+'" class="product-name-link">'+product.name+'</a><div class="product-rating"><span class="stars">'+buildStars(product.rating)+'</span><span class="rating-count">('+Number(product.reviews||0).toLocaleString()+')</span></div><div class="product-price-row">'+priceRow+'</div>'+stockBadgeHTML(product.stock)+'<button class="add-to-cart-btn" data-id="'+product.id+'" '+(oos?"disabled":"")+"><i class=\"fa-solid fa-cart-plus\"></i> "+(oos?"Out of Stock":"Add to Cart")+'</button><a href="product.html?id='+product.id+'" class="view-details-btn">View Details <i class="fa-solid fa-arrow-right"></i></a></div></div>';
}

function attachAddToCartListeners() {
  var btns = document.querySelectorAll(".add-to-cart-btn:not([disabled])");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", (function(btn){
      return function() {
        if (!isLoggedIn()) {
          showToast("Please log in to add items to cart.", "error");
          setTimeout(function(){ window.location.href = "login.html"; }, 1500);
          return;
        }
        var id     = btn.dataset.id;
        var result = addToCart(id, 1);
        var card   = btn.closest(".product-card");
        var nameEl = card ? card.querySelector(".product-name-link") : null;
        var name   = nameEl ? nameEl.textContent : "Item";
        if (result.success) showToast('"'+name+'" added to cart!');
        else                showToast(result.message, "error");
      };
    })(btns[i]));
  }
}


/* ================================================================
   §10  INDEX PAGE
   ================================================================ */
function renderProducts(category, search) {
  category = category || "All";
  search   = search   || "";
  var grid    = document.getElementById("productGrid");
  var countEl = document.getElementById("resultCount");
  if (!grid) return;
  var list = getAllProducts();
  if (category && category !== "All")
    list = list.filter(function(p){ return p.category === category; });
  if (search) {
    var q = search.toLowerCase();
    list = list.filter(function(p){
      return p.name.toLowerCase().indexOf(q) > -1 || p.category.toLowerCase().indexOf(q) > -1;
    });
  }
  if (countEl) countEl.textContent = list.length + " product" + (list.length !== 1 ? "s" : "");
  if (!list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--clr-mid)">No products found.</div>';
    return;
  }
  grid.innerHTML = list.map(buildProductCardHTML).join("");
  attachAddToCartListeners();
}

function renderFilteredProducts(list) {
  var grid    = document.getElementById("productGrid");
  var countEl = document.getElementById("resultCount");
  if (!grid) return;
  if (countEl) countEl.textContent = list.length + " product" + (list.length !== 1 ? "s" : "");
  if (!list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--clr-mid)">No products found.</div>';
    return;
  }
  grid.innerHTML = list.map(buildProductCardHTML).join("");
  attachAddToCartListeners();
}


/* ================================================================
   §11  PRODUCT DETAIL PAGE
   ================================================================ */
function renderProductPage() {
  var panel = document.getElementById("productDetail");
  if (!panel) return;
  var id      = new URLSearchParams(window.location.search).get("id");
  var product = id ? getProductById(id) : null;

  if (!product) {
    panel.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px">Product not found. <a href="index.html" style="color:var(--clr-primary)">Go back</a></div>';
    return;
  }

  document.title = "SHOP EASY - " + product.name;
  var bc = document.getElementById("breadcrumbCat");
  var bn = document.getElementById("breadcrumbName");
  if (bc) bc.textContent = product.category;
  if (bn) bn.textContent = product.name;

  var oos = product.stock <= 0;
  var featuresHTML = (product.features || []).map(function(f){
    return '<span class="feature-tag"><i class="fa-solid fa-check"></i>'+f+'</span>';
  }).join("");

  var priceHTML = '<span class="detail-price">'+formatPrice(product.price)+'</span>';
  if (product.originalPrice > product.price)
    priceHTML += '<span class="detail-original">'+formatPrice(product.originalPrice)+'</span>';
  if (product.discount)
    priceHTML += '<span class="detail-discount">'+product.discount+'% OFF</span>';

  panel.innerHTML =
    '<div class="detail-image-wrap">'
    + '<img src="'+product.image+'" alt="'+product.name+'" onerror="this.src=\'https://via.placeholder.com/400\'"/>'
    + '<span class="badge badge-'+product.badge+'">'+product.badge+'</span>'
    + '</div>'
    + '<div class="detail-info">'
    + '<p class="detail-category">'+product.category+'</p>'
    + '<h1 class="detail-name">'+product.name+'</h1>'
    + '<div class="detail-rating"><span class="stars">'+buildStars(product.rating)+'</span>'
    + '<span class="rating-count">'+product.rating+' - '+Number(product.reviews||0).toLocaleString()+' reviews</span></div>'
    + '<div class="detail-divider"></div>'
    + '<div class="detail-price-row">'+priceHTML+'</div>'
    + '<p class="detail-desc">'+product.description+'</p>'
    + '<div class="detail-features">'+featuresHTML+'</div>'
    + '<div class="detail-divider"></div>'
    + stockBadgeHTML(product.stock)
    + '<div class="detail-qty"'+(oos?' style="opacity:.5;pointer-events:none"':"")+' >'
    + '<span class="detail-qty-label">Quantity:</span>'
    + '<div class="detail-qty-controls">'
    + '<button class="detail-qty-btn" id="qtyMinus">-</button>'
    + '<span class="detail-qty-val" id="qtyVal">1</span>'
    + '<button class="detail-qty-btn" id="qtyPlus">+</button>'
    + '</div></div>'
    + '<div class="detail-actions">'
    + '<button class="btn-add-cart" id="detailAddCart"'+(oos?" disabled":"")+' >'
    + '<i class="fa-solid fa-cart-plus"></i> '+(oos?"Out of Stock":"Add to Cart")+'</button>'
    + '<a href="cart.html" class="btn-go-cart"><i class="fa-solid fa-cart-shopping"></i> View Cart</a>'
    + '</div>'
    + '<div class="detail-delivery">'
    + '<div class="delivery-chip"><i class="fa-solid fa-truck-fast"></i> Free delivery over Rs.500</div>'
    + '<div class="delivery-chip"><i class="fa-solid fa-rotate-left"></i> 7-day returns</div>'
    + '<div class="delivery-chip"><i class="fa-solid fa-shield-halved"></i> Secure checkout</div>'
    + '</div></div>';

  var qty = 1;
  var qtyEl = document.getElementById("qtyVal");
  var minusBtn = document.getElementById("qtyMinus");
  var plusBtn  = document.getElementById("qtyPlus");
  var addBtn   = document.getElementById("detailAddCart");

  if (minusBtn) minusBtn.addEventListener("click", function(){
    if (qty > 1) { qty--; qtyEl.textContent = qty; }
  });
  if (plusBtn)  plusBtn.addEventListener("click", function(){
    if (qty < Math.min(10, product.stock)) { qty++; qtyEl.textContent = qty; }
  });
  if (addBtn && !oos) addBtn.addEventListener("click", function(){
    if (!isLoggedIn()) {
      showToast("Please log in to add items to cart.", "error");
      setTimeout(function(){ window.location.href = "login.html"; }, 1500);
      return;
    }
    var result = addToCart(product.id, qty);
    if (result.success) showToast(qty+"x \""+product.name+"\" added to cart!");
    else                showToast(result.message, "error");
  });

  var relGrid = document.getElementById("relatedGrid");
  if (relGrid) {
    var rel = getAllProducts().filter(function(p){ return p.category === product.category && p.id !== product.id; });
    if (rel.length) { relGrid.innerHTML = rel.map(buildProductCardHTML).join(""); attachAddToCartListeners(); }
    else relGrid.innerHTML = '<p style="color:var(--clr-mid)">No related products found.</p>';
  }
}


/* ================================================================
   §12  CART PAGE
   ================================================================ */
function renderCartPage() {
  var layout = document.getElementById("cartLayout");
  if (!layout) return;
  var cart = getCart();

  if (!cart.length) {
    layout.innerHTML = '<div class="empty-cart">'
      + '<i class="fa-solid fa-cart-shopping empty-cart-icon"></i>'
      + '<h2>Your cart is empty</h2>'
      + '<p>Browse our products and add something you love!</p>'
      + '<a href="index.html" class="btn-primary"><i class="fa-solid fa-arrow-left"></i> Start Shopping</a>'
      + '</div>';
    return;
  }

  var itemsHTML = cart.map(function(item){
    return '<div class="cart-item-card">'
      + '<img class="cart-item-img" src="'+item.image+'" alt="'+item.name+'" onerror="this.src=\'https://via.placeholder.com/80\'"/>'
      + '<div class="cart-item-body">'
      + '<p class="cart-item-cat">'+(item.category||"")+'</p>'
      + '<p class="cart-item-name">'+item.name+'</p>'
      + '<p class="cart-item-unit">Unit: '+formatPrice(item.price)+'</p>'
      + '<div class="qty-row">'
      + '<button class="qty-btn" onclick="changeCartQty(\''+item.productId+'\',-1)">-</button>'
      + '<span class="qty-value">'+item.quantity+'</span>'
      + '<button class="qty-btn" onclick="changeCartQty(\''+item.productId+'\',+1)">+</button>'
      + '<button class="remove-btn" onclick="removeFromCart(\''+item.productId+'\');renderCartPage()">'
      + '<i class="fa-solid fa-trash-can"></i> Remove</button>'
      + '</div></div>'
      + '<div class="cart-item-subtotal">'+formatPrice(item.price * item.quantity)+'</div>'
      + '</div>';
  }).join("");

  var subtotal   = getCartTotal();
  var discount   = Math.round(subtotal * 0.05);
  var grandTotal = subtotal - discount;

  layout.innerHTML = '<div class="cart-items-list">'+itemsHTML+'</div>'
    + '<div class="order-summary">'
    + '<p class="summary-title">Order Summary</p>'
    + '<div class="summary-row"><span>Subtotal ('+getCartItemCount()+' items)</span><span>'+formatPrice(subtotal)+'</span></div>'
    + '<div class="summary-row"><span>Discount (5%)</span><span class="discount-tag">- '+formatPrice(discount)+'</span></div>'
    + '<div class="summary-row total"><span>Total</span><span>'+formatPrice(grandTotal)+'</span></div>'
    + '<button class="pay-trigger-btn" onclick="proceedToCheckout()">'
    + '<i class="fa-solid fa-lock"></i> Proceed to Payment</button>'
    + '<p class="secure-note"><i class="fa-solid fa-shield-halved"></i> Secure checkout - 256-bit SSL</p>'
    + '<div class="pay-accepted"><span class="pay-accepted-label">We accept:</span>'
    + '<div class="pay-accepted-icons">'
    + '<span><i class="fa-solid fa-mobile-screen-button"></i> UPI</span>'
    + '<span><i class="fa-solid fa-credit-card"></i> Card</span>'
    + '<span><i class="fa-solid fa-truck-fast"></i> COD</span>'
    + '</div></div></div>';
}

/* proceedToCheckout - guards login then navigates to Order.html */
function proceedToCheckout() {
  if (!isLoggedIn()) {
    alert("Please log in first to proceed to payment.");
    window.location.href = "login.html";
    return;
  }
  window.location.href = "Order.html";
}


/* ================================================================
   §13  ORDERS HISTORY PAGE
   ================================================================ */
function renderOrdersPage() {
  var container = document.getElementById("ordersContainer");
  if (!container) return;

  if (!isLoggedIn()) {
    container.innerHTML = '<div class="empty-orders"><div class="empty-orders-icon"><i class="fa-solid fa-lock"></i></div>'
      + '<h2>Please log in to view your orders</h2>'
      + '<a href="login.html" class="btn-primary"><i class="fa-solid fa-right-to-bracket"></i> Login Now</a></div>';
    return;
  }

  var orders  = getUserOrders();
  var countEl = document.getElementById("orderCountLine");
  if (countEl)
    countEl.textContent = orders.length
      ? "You have placed "+orders.length+" order"+(orders.length!==1?"s":"")+"."
      : "No orders yet.";

  if (!orders.length) {
    container.innerHTML = '<div class="empty-orders"><div class="empty-orders-icon"><i class="fa-solid fa-box-open"></i></div>'
      + '<h2>No orders yet</h2><p>Start shopping and your orders will appear here.</p>'
      + '<a href="index.html" class="btn-primary"><i class="fa-solid fa-bag-shopping"></i> Browse Products</a></div>';
    return;
  }

  container.innerHTML = orders.map(function(order){
    var addr = order.selectedAddress || {};
    var dc   = order.deliveryCharge || 0;

    var thumbs = order.items.slice(0,3).map(function(i){
      return '<img src="'+i.image+'" alt="'+i.name+'" class="order-thumb" onerror="this.src=\'https://via.placeholder.com/52\'"/>';
    }).join("");
    if (order.items.length > 3)
      thumbs += '<span class="order-more-badge">+' + (order.items.length-3) + '</span>';

    var rows = order.items.map(function(i){
      return '<div class="order-item-row">'
        + '<img src="'+i.image+'" alt="'+i.name+'" class="order-item-img" onerror="this.src=\'https://via.placeholder.com/52\'"/>'
        + '<div class="order-item-info"><p class="order-item-name">'+i.name+'</p>'
        + '<p class="order-item-meta">Qty: '+i.quantity+' - '+formatPrice(i.price)+' each</p></div>'
        + '<p class="order-item-price">'+formatPrice(i.price*i.quantity)+'</p></div>';
    }).join("");

    var chips = [];
    if (addr.companyName) chips.push('<div class="order-del-chip"><i class="fa-solid fa-building"></i> '+addr.companyName+'</div>');
    if (addr.address)     chips.push('<div class="order-del-chip"><i class="fa-solid fa-location-dot"></i> '+addr.address+'</div>');
    if (order.deliverySlot) chips.push('<div class="order-del-chip"><i class="fa-solid fa-clock"></i> '+order.deliverySlot+'</div>');
    chips.push('<div class="order-del-chip order-del-chip--'+(dc>0?"fast":"free")+'">'
      + '<i class="fa-solid fa-'+(dc>0?"bolt":"truck-fast")+'"></i> '
      + (dc>0?"Fast Delivery +"+formatPrice(dc):"Standard Delivery - FREE")+'</div>');

    var payBadge = order.paymentMethod
      ? '<span class="order-payment-method"><i class="fa-solid fa-wallet"></i> '+order.paymentMethod+'</span>'
      : "";

    return '<div class="order-card">'
      + '<div class="order-card-header">'
      + '<div class="order-meta">'
      + '<span class="order-id">'+order.orderId+'</span>'
      + '<span class="order-date"><i class="fa-regular fa-calendar"></i> '+formatDate(order.date)+'</span>'
      + '</div>'
      + '<div class="order-status-wrap">'
      + '<span class="order-status order-status--paid"><i class="fa-solid fa-circle-check"></i> '+(order.status||"Paid")+'</span>'
      + payBadge
      + '<span class="order-total-badge">'+formatPrice(order.total||order.totalAmount||0)+'</span>'
      + '</div></div>'
      + '<div class="order-delivery-info">'+chips.join("")+'</div>'
      + '<div class="order-thumbs">'+thumbs+'</div>'
      + '<div class="order-items-detail" id="od-'+order.orderId+'" style="display:none">'+rows+'</div>'
      + '<button class="order-toggle-btn" onclick="toggleOrderDetail(\''+order.orderId+'\')">'
      + '<i class="fa-solid fa-chevron-down"></i> View '+order.items.length+' item'+(order.items.length!==1?"s":"")+'</button>'
      + '</div>';
  }).join("");
}

function toggleOrderDetail(orderId) {
  var el   = document.getElementById("od-"+orderId);
  var btn  = el.nextElementSibling;
  var open = el.style.display !== "none";
  el.style.display = open ? "none" : "block";
  var count = parseInt(btn.textContent.match(/\d+/)) || 0;
  btn.innerHTML = open
    ? '<i class="fa-solid fa-chevron-down"></i> View '+count+' item'+(count!==1?"s":"")
    : '<i class="fa-solid fa-chevron-up"></i> Hide Items';
}


/* ================================================================
   §14  ADMIN PAGE
   ================================================================ */
function renderAdminPage() {
  protectAdminPage();
  renderAdminProductList();
}

function renderAdminProductList() {
  var tbody = document.getElementById("adminProductList");
  if (!tbody) return;
  var products = getAllProducts();
  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--clr-mid)">No products yet.</td></tr>';
    return;
  }
  tbody.innerHTML = products.map(function(p){
    var stockClass = p.stock<=0 ? "admin-stock-out" : p.stock<=5 ? "admin-stock-low" : "admin-stock-ok";
    return '<tr class="admin-table-row">'
      + '<td><img src="'+p.image+'" alt="'+p.name+'" class="admin-thumb" onerror="this.src=\'https://via.placeholder.com/50\'"/></td>'
      + '<td><p class="admin-prod-name">'+p.name+'</p><p class="admin-prod-cat">'+p.category+'</p></td>'
      + '<td>'+formatPrice(p.price)+'</td>'
      + '<td><span class="'+stockClass+'">'+p.stock+'</span></td>'
      + '<td><span class="badge badge-'+p.badge+'">'+p.badge+'</span></td>'
      + '<td class="admin-actions">'
      + '<button class="admin-btn admin-btn--edit" onclick="adminOpenEditModal(\''+p.id+'\')">'
      + '<i class="fa-solid fa-pen"></i> Edit</button>'
      + '<button class="admin-btn admin-btn--delete" onclick="adminConfirmDelete(\''+p.id+'\')">'
      + '<i class="fa-solid fa-trash"></i> Delete</button>'
      + '</td></tr>';
  }).join("");
}

function adminOpenEditModal(productId) {
  var p = getProductById(productId); if (!p) return;
  document.getElementById("modalTitle").textContent    = "Edit Product";
  document.getElementById("formProductId").value       = p.id;
  document.getElementById("formName").value            = p.name;
  document.getElementById("formCategory").value        = p.category;
  document.getElementById("formPrice").value           = p.price;
  document.getElementById("formOriginalPrice").value   = p.originalPrice;
  document.getElementById("formDiscount").value        = p.discount;
  document.getElementById("formStock").value           = p.stock;
  document.getElementById("formBadge").value           = p.badge;
  document.getElementById("formImage").value           = p.image;
  document.getElementById("formDescription").value     = p.description;
  document.getElementById("formFeatures").value        = (p.features||[]).join(", ");
  document.getElementById("adminModal").classList.add("open");
}

function adminOpenAddModal() {
  document.getElementById("modalTitle").textContent = "Add New Product";
  document.getElementById("adminProductForm").reset();
  document.getElementById("formProductId").value    = "";
  document.getElementById("adminModal").classList.add("open");
}

function adminCloseModal() {
  document.getElementById("adminModal").classList.remove("open");
}

function adminHandleProductForm(e) {
  e.preventDefault();
  var id = document.getElementById("formProductId").value.trim();
  var data = {
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
  var p = getProductById(productId); if (!p) return;
  if (confirm('Delete "'+p.name+'"? This cannot be undone.')) {
    adminDeleteProduct(productId);
    showToast('"'+p.name+'" deleted.', "info");
    renderAdminProductList();
    renderAdminStats();
  }
}

/* Stats now use global se_orders for accurate live counts */
function renderAdminStats() {
  var products = getAllProducts();
  var users    = getAllUsers().filter(function(u){ return !u.isAdmin; });
  var orders   = loadOrders();
  var revenue  = orders.reduce(function(s,o){ return s + (o.total||0); }, 0);
  var setEl    = function(id, v) { var el = document.getElementById(id); if(el) el.textContent = v; };
  setEl("statProducts", products.length);
  setEl("statUsers",    users.length);
  setEl("statOrders",   orders.length);
  setEl("statRevenue",  formatPrice(revenue));
}

function renderAdminUserList() {
  var tbody = document.getElementById("adminUserList");
  if (!tbody) return;
  var users = getAllUsers().filter(function(u){ return !u.isAdmin; });
  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--clr-mid)">No users yet.</td></tr>';
    return;
  }
  tbody.innerHTML = users.map(function(u){
    var orderCount = (u.orders||[]).length;
    var spent      = (u.orders||[]).reduce(function(s,o){ return s+(o.total||0); }, 0);
    var cartItems  = (u.cart||[]).reduce(function(s,i){ return s+i.quantity; }, 0);
    var joined     = u.id.startsWith("u-")
      ? formatDate(new Date(parseInt(u.id.replace("u-",""))).toISOString()) : "-";
    return '<tr class="admin-table-row">'
      + '<td><div class="admin-user-avatar">'+u.name.charAt(0).toUpperCase()+'</div></td>'
      + '<td><p class="admin-prod-name">'+u.name+'</p><p class="admin-prod-cat">'+u.email+'</p></td>'
      + '<td>'+joined+'</td>'
      + '<td><span class="admin-user-stat">'+orderCount+' order'+(orderCount!==1?"s":"")+'</span>'
      + (spent>0?'<br/><span class="admin-user-spent">'+formatPrice(spent)+'</span>':"")+' </td>'
      + '<td>'+(cartItems>0
        ? '<span class="stock-badge stock-badge--low">'+cartItems+' in cart</span>'
        : '<span class="stock-badge stock-badge--ok">Empty</span>')+'</td>'
      + '</tr>';
  }).join("");
}

/* All Orders section */
function renderAdminOrders() {
  var container = document.getElementById("adminOrdersContainer");
  if (!container) return;
  var orders = loadOrders();
  if (!orders.length) {
    container.innerHTML = '<div class="ao-empty">'
      + '<i class="fa-solid fa-inbox ao-empty-icon"></i>'
      + '<p class="ao-empty-title">No Orders Yet</p>'
      + '<p class="ao-empty-sub">Orders placed through the store will appear here automatically.</p>'
      + '</div>';
    return;
  }
  container.innerHTML = orders.map(function(order, idx){ return _aoOrderCard(order, idx); }).join("");
}

function _aoOrderCard(order, idx) {
  var addr    = order.selectedAddress || {};
  var company = addr.companyName || order.companyName || "-";
  var name    = addr.fullName    || order.fullName    || order.userName || "-";
  var address = addr.address     || order.address     || "-";
  var phone   = addr.phone       || order.phone       || "-";
  var dc      = order.deliveryCharge || 0;
  var dcDisplay = dc > 0 ? formatPrice(dc)+" (Fast)" : "FREE";
  var status    = order.status || "Paid";
  var stClass   = status.toLowerCase() === "paid" ? "ao-badge--paid" : "ao-badge--pending";
  var waURL     = _aoGetWhatsAppURL(order);

  var items = (order.items||[]).map(function(item){
    return '<div class="ao-product-row">'
      + '<img class="ao-product-img" src="'+item.image+'" alt="'+item.name+'" onerror="this.src=\'https://via.placeholder.com/44\'"/>'
      + '<div class="ao-product-info">'
      + '<span class="ao-product-name">'+item.name+'</span>'
      + '<span class="ao-product-meta">Qty: '+item.quantity+' x '+formatPrice(item.price)+'</span>'
      + '</div>'
      + '<span class="ao-product-sub">'+formatPrice(item.price*item.quantity)+'</span>'
      + '</div>';
  }).join("");

  var timeStr = "";
  try {
    timeStr = new Date(order.date).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
  } catch(e) {}

  return '<div class="ao-card" id="aoCard-'+order.orderId+'">'
    + '<div class="ao-card-header">'
    + '<div class="ao-card-meta">'
    + '<span class="ao-order-id"><i class="fa-solid fa-receipt"></i> '+order.orderId+'</span>'
    + '<span class="ao-order-date"><i class="fa-regular fa-calendar"></i> '+formatDate(order.date)+' - '+timeStr+'</span>'
    + '</div>'
    + '<div class="ao-card-actions">'
    + '<span class="ao-badge '+stClass+'"><i class="fa-solid fa-circle-check"></i> '+status+'</span>'
    + '<a class="ao-wa-btn" href="'+waURL+'" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Notify</a>'
    + '</div></div>'
    + '<div class="ao-customer-grid">'
    + '<div class="ao-customer-field"><i class="fa-solid fa-building"></i><div><span class="ao-field-label">Company</span><span class="ao-field-val">'+company+'</span></div></div>'
    + '<div class="ao-customer-field"><i class="fa-solid fa-user"></i><div><span class="ao-field-label">Customer</span><span class="ao-field-val">'+name+'</span></div></div>'
    + '<div class="ao-customer-field"><i class="fa-solid fa-phone"></i><div><span class="ao-field-label">Phone</span><span class="ao-field-val">'+phone+'</span></div></div>'
    + '<div class="ao-customer-field"><i class="fa-solid fa-envelope"></i><div><span class="ao-field-label">Email</span><span class="ao-field-val">'+(order.userEmail||"-")+'</span></div></div>'
    + '<div class="ao-customer-field ao-customer-field--full"><i class="fa-solid fa-location-dot"></i><div><span class="ao-field-label">Address</span><span class="ao-field-val">'+address+'</span></div></div>'
    + '<div class="ao-customer-field"><i class="fa-solid fa-clock"></i><div><span class="ao-field-label">Slot</span><span class="ao-field-val">'+(order.deliverySlot||"-")+'</span></div></div>'
    + '<div class="ao-customer-field"><i class="fa-solid fa-wallet"></i><div><span class="ao-field-label">Payment</span><span class="ao-field-val">'+(order.paymentMethod||"-")+'</span></div></div>'
    + '<div class="ao-customer-field"><i class="fa-solid fa-bolt"></i><div><span class="ao-field-label">Delivery</span><span class="ao-field-val">'+dcDisplay+'</span></div></div>'
    + '</div>'
    + '<div class="ao-products"><p class="ao-products-label"><i class="fa-solid fa-box"></i> Items ('+(order.items||[]).length+')</p>'
    + '<div class="ao-products-list">'+items+'</div></div>'
    + '<div class="ao-price-summary">'
    + '<span class="ao-price-item">Subtotal: <strong>'+formatPrice(order.subtotal||0)+'</strong></span>'
    + '<span class="ao-price-item ao-price-discount">Discount: <strong>-'+formatPrice(order.discount||0)+'</strong></span>'
    + '<span class="ao-price-item">Delivery: <strong>'+dcDisplay+'</strong></span>'
    + '<span class="ao-price-total">Total: <strong>'+formatPrice(order.total||order.totalAmount||0)+'</strong></span>'
    + '</div></div>';
}

function _aoWhatsAppText(order, name, company, address, phone) {
  var dc = order.deliveryCharge || 0;
  var lines = [
    "SHOP EASY - New Order", "",
    "Order ID: "+order.orderId,
    "Date: "+formatDate(order.date), "",
    "Customer Details:",
    "Company: "+company,
    "Name: "+name,
    "Phone: "+phone,
    "Address: "+address,
    "Slot: "+(order.deliverySlot||"-"), "",
    "Ordered Items:"
  ];
  (order.items||[]).forEach(function(item){
    lines.push("  - "+item.name+" x"+item.quantity+" @ Rs."+item.price+" = Rs."+(item.price*item.quantity));
  });
  lines.push("", "Price:",
    "  Subtotal: Rs."+(order.subtotal||0),
    "  Discount: -Rs."+(order.discount||0),
    "  Delivery: "+(dc>0?"Rs."+dc+" (Fast)":"FREE"),
    "  TOTAL: Rs."+(order.total||order.totalAmount||0),
    "  Payment: "+(order.paymentMethod||"-"),
    "  Status: "+( order.status||"Paid")
  );
  return lines.join("\n");
}

function _aoGetWhatsAppURL(order) {
  var addr    = order.selectedAddress || {};
  var name    = addr.fullName    || order.userName    || "Customer";
  var company = addr.companyName || order.companyName || "-";
  var address = addr.address     || order.address     || "-";
  var phone   = addr.phone       || order.phone       || "-";
  var text    = _aoWhatsAppText(order, name, company, address, phone);
  /* Replace 91XXXXXXXXXX with your WhatsApp business number */
  return "https://wa.me/91XXXXXXXXXX?text=" + encodeURIComponent(text);
}

function sendWhatsAppNotification(orderId) {
  var order = loadOrders().find(function(o){ return o.orderId === orderId; });
  if (!order) { showToast("Order not found.", "error"); return; }
  window.open(_aoGetWhatsAppURL(order), "_blank");
}


/* ================================================================
   §15  PAGE PROTECTION
   ================================================================ */
function protectPage() {
  if (!isLoggedIn()) {
    localStorage.setItem("se_redirect", window.location.pathname + window.location.search);
    window.location.href = "login.html";
  }
}

function protectAdminPage() {
  /* Not logged in at all – send to login */
  if (!isLoggedIn()) {
    localStorage.setItem("se_redirect", "admin.html");
    window.location.href = "login.html";
    return;
  }
  /* Logged in but NOT admin – deny and send home */
  var user = getCurrentUser();
  if (!user || !user.isAdmin) {
    localStorage.setItem("se_access_denied", "1");
    window.location.href = "index.html";
  }
  /* If we reach here the user IS admin – allow page to render */
}


/* ================================================================
   §16  ADDRESS CRUD
   ================================================================ */
function getUserAddresses() {
  var u = getCurrentUser();
  return u ? (u.addresses || []) : [];
}

function getDefaultAddress() {
  var a = getUserAddresses();
  return a.find(function(x){ return x.isDefault; }) || a[0] || null;
}

function addAddress(companyName, addressText, fullName, phone) {
  var user = getCurrentUser(); if (!user) return null;
  if (!user.addresses) user.addresses = [];
  var newAddr = {
    id:          "addr-"+Date.now(),
    companyName: (companyName||"").trim(),
    fullName:    (fullName||"").trim(),
    address:     (addressText||"").trim(),
    phone:       (phone||"").trim(),
    isDefault:   user.addresses.length === 0
  };
  user.addresses.push(newAddr);
  saveOneUser(user);
  return newAddr;
}

function editAddress(id, data) {
  var user = getCurrentUser(); if (!user||!user.addresses) return;
  var idx  = user.addresses.findIndex(function(a){ return a.id===id; }); if (idx===-1) return;
  var addr = user.addresses[idx];
  addr.companyName = (data.companyName||"").trim();
  addr.fullName    = (data.fullName||"").trim();
  addr.address     = (data.address||"").trim();
  addr.phone       = (data.phone||"").trim();
  saveOneUser(user);
}

function deleteAddress(id) {
  var user = getCurrentUser(); if (!user||!user.addresses) return;
  var wasDefault = (user.addresses.find(function(a){ return a.id===id; })||{}).isDefault||false;
  user.addresses = user.addresses.filter(function(a){ return a.id!==id; });
  if (wasDefault && user.addresses.length > 0) user.addresses[0].isDefault = true;
  saveOneUser(user);
}

function setDefaultAddress(id) {
  var user = getCurrentUser(); if (!user||!user.addresses) return;
  user.addresses.forEach(function(a){ a.isDefault = (a.id===id); });
  saveOneUser(user);
}


/* ================================================================
   §17  ORDER.HTML CHECKOUT PAGE
   ================================================================ */

var _opSelectedAddrId = "";  /* tracks the selected address */

function renderOrderPage() {
  if (!isLoggedIn()) {
    localStorage.setItem("se_redirect", "Order.html");
    window.location.href = "login.html";
    return;
  }
  var cart = getCart();
  if (!cart.length) {
    var body = document.getElementById("orderPageBody");
    if (body) body.innerHTML = '<div class="op-empty">'
      + '<i class="fa-solid fa-cart-shopping op-empty-icon"></i>'
      + '<h2>Your cart is empty</h2>'
      + '<p>Add some products before checking out.</p>'
      + '<a href="index.html" class="op-btn op-btn--primary"><i class="fa-solid fa-arrow-left"></i> Browse Products</a>'
      + '</div>';
    return;
  }
  renderNavAuth();
  updateCartBadge();
  _opRenderCartSummary();
  loadAddresses();
  var def = getDefaultAddress();
  if (def) { _opSelectedAddrId = def.id; _opFillFormFromAddress(def); }
  _opSetDefaultDeliveryTime();
  _opPopulateSlots();
  var timeInput = document.getElementById("opDeliveryTime");
  if (timeInput) timeInput.addEventListener("change", _opHandleDeliveryChange);
  var fastChk = document.getElementById("opFastDelivery");
  if (fastChk) fastChk.addEventListener("change", function(){
    var msg = document.getElementById("opFastMsg");
    if (msg) msg.style.display = this.checked ? "flex" : "none";
    _opUpdateTotal();
  });
  _opHandleDeliveryChange();
}

function loadAddresses() {
  var dropdown = document.getElementById("opAddrDropdown");
  if (!dropdown) return;
  var addrs = getUserAddresses();
  dropdown.innerHTML = '<option value="">- Select a saved address -</option>';
  addrs.forEach(function(addr){
    var opt   = document.createElement("option");
    opt.value = addr.id;
    var label = (addr.fullName||addr.companyName) + " - " + addr.address;
    opt.textContent = (label.length > 60 ? label.slice(0,57)+"..." : label)
                    + (addr.isDefault ? " *" : "");
    dropdown.appendChild(opt);
  });
  var def = getDefaultAddress();
  if (def) { dropdown.value = def.id; _opSelectedAddrId = def.id; }
  var badge = document.getElementById("opAddrCount");
  if (badge) badge.textContent = addrs.length + " / 5";
}

function loadSelectedAddress() {
  var dropdown = document.getElementById("opAddrDropdown");
  if (!dropdown || !dropdown.value) {
    _opShowBanner("error", "Please select an address from the dropdown first.");
    return;
  }
  var addr = getUserAddresses().find(function(a){ return a.id === dropdown.value; });
  if (!addr) { _opShowBanner("error", "Address not found."); return; }
  _opSelectedAddrId = addr.id;
  _opFillFormFromAddress(addr);
  _opShowBanner("success", "Address loaded into the form.");
}

function saveAddress() {
  if (!isLoggedIn()) { _opShowBanner("error","Please log in to save addresses."); return; }
  var saveChk = document.getElementById("opSaveAddress");
  if (saveChk && !saveChk.checked) return;

  var companyName = (document.getElementById("opCompany")  ? document.getElementById("opCompany").value  : "").trim();
  var fullName    = (document.getElementById("opFullName") ? document.getElementById("opFullName").value : "").trim();
  var address     = (document.getElementById("opAddress")  ? document.getElementById("opAddress").value  : "").trim();
  var phone       = (document.getElementById("opPhone")    ? document.getElementById("opPhone").value    : "").trim();

  if (!companyName||!fullName||!address||!phone) {
    _opShowBanner("error","Please fill all address fields before saving."); return;
  }
  var user = getCurrentUser();
  if (!user.addresses) user.addresses = [];
  if (user.addresses.length >= 5) {
    _opShowBanner("error","Maximum 5 addresses reached. Delete one first."); return;
  }
  var isDuplicate = user.addresses.some(function(a){
    return a.companyName.toLowerCase()===companyName.toLowerCase() &&
           a.address.toLowerCase()===address.toLowerCase() &&
           (a.phone||"")===phone;
  });
  if (isDuplicate) { _opShowBanner("info","This address is already saved."); return; }

  var newAddr = addAddress(companyName, address, fullName, phone);
  _opSelectedAddrId = newAddr.id;
  loadAddresses();
  _opShowBanner("success",'Address for "'+fullName+'" saved!');
  if (saveChk) saveChk.checked = false;
}

function deleteAddress_OP() {
  var dropdown = document.getElementById("opAddrDropdown");
  if (!dropdown||!dropdown.value) { _opShowBanner("error","Please select an address to delete."); return; }
  var addr = getUserAddresses().find(function(a){ return a.id===dropdown.value; });
  if (!addr) return;
  if (!confirm('Delete address for "'+(addr.fullName||addr.companyName)+'"?')) return;
  deleteAddress(dropdown.value);
  _opSelectedAddrId = "";
  loadAddresses();
  clearForm();
  _opShowBanner("success","Address deleted.");
}

function clearForm() {
  ["opCompany","opFullName","opAddress","opPhone"].forEach(function(id){
    var el = document.getElementById(id);
    if (el) { el.value = ""; el.classList.remove("op-input-error"); }
  });
  var chk = document.getElementById("opSaveAddress"); if (chk) chk.checked = false;
  var dd  = document.getElementById("opAddrDropdown"); if (dd) dd.value = "";
  _opSelectedAddrId = "";
  _opShowBanner("info","Form cleared. Fill in a new address.");
}

function submitOrder() {
  if (!isLoggedIn()) { alert("Please log in to place an order."); window.location.href="login.html"; return; }

  var companyName  = ((document.getElementById("opCompany")      || {}).value||"").trim();
  var fullName     = ((document.getElementById("opFullName")     || {}).value||"").trim();
  var address      = ((document.getElementById("opAddress")      || {}).value||"").trim();
  var phone        = ((document.getElementById("opPhone")        || {}).value||"").trim();
  var deliveryTime = ((document.getElementById("opDeliveryTime") || {}).value||"").trim();
  var deliverySlot = ((document.getElementById("opSlot")         || {}).value||"").trim();
  var fastChecked  = (document.getElementById("opFastDelivery")  || {}).checked || false;
  var payMethodEl  = document.querySelector('input[name="opPayMethod"]:checked');
  var payMethod    = payMethodEl ? payMethodEl.value : "";

  /* Clear previous errors */
  ["opCompany","opFullName","opAddress","opPhone","opDeliveryTime"].forEach(function(id){
    var el = document.getElementById(id); if (el) el.classList.remove("op-input-error");
  });
  var errBanner = document.getElementById("opValidErr");
  if (errBanner) errBanner.style.display = "none";

  /* Validate required fields */
  var required = [
    {id:"opCompany",      val:companyName,  label:"Company / Office Name"},
    {id:"opFullName",     val:fullName,     label:"Full Name"},
    {id:"opAddress",      val:address,      label:"Delivery Address"},
    {id:"opPhone",        val:phone,        label:"Phone Number"},
    {id:"opDeliveryTime", val:deliveryTime, label:"Delivery Date & Time"}
  ];
  var missing = required.filter(function(f){ return !f.val; });
  if (missing.length) {
    missing.forEach(function(f){ var el=document.getElementById(f.id); if(el) el.classList.add("op-input-error"); });
    if (errBanner) {
      errBanner.textContent = "Please fill in: " + missing.map(function(f){ return f.label; }).join(", ");
      errBanner.style.display = "flex";
    }
    return;
  }
  if (!payMethod) { _opShowBanner("error","Please select a payment method."); return; }
  if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g,""))) {
    _opShowBanner("error","Please enter a valid 10-digit Indian phone number.");
    var phEl = document.getElementById("opPhone"); if (phEl) phEl.classList.add("op-input-error");
    return;
  }

  saveAddress();  /* save if checkbox checked */

  var autoCharge     = calculateExtraCharge(deliveryTime);
  var deliveryCharge = (autoCharge > 0 || fastChecked) ? 100 : 0;
  var subtotal       = getCartTotal();
  var discount       = Math.round(subtotal * 0.05);
  var grandTotal     = subtotal - discount + deliveryCharge;
  var cart           = getCart();

  /* Stock re-check */
  for (var si = 0; si < cart.length; si++) {
    var cartItem = cart[si];
    var prod = getProductById(cartItem.productId);
    if (!prod || cartItem.quantity > prod.stock) {
      _opShowBanner("error",'"'+cartItem.name+'" stock changed. Please review your cart.');
      return;
    }
  }

  if (!window.confirm(
    "Confirm order of "+formatPrice(grandTotal)+" via "+payMethod+"?\n\n"+
    "Deliver to: "+fullName+" at "+address+"\n"+
    "Slot: "+deliverySlot+"\n\nClick OK to place your order."
  )) return;

  var btn = document.getElementById("opSubmitBtn");
  if (btn) { btn.disabled=true; btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Placing order...'; }

  var order = {
    orderId:  "ORD-"+Date.now(),
    date:     new Date().toISOString(),
    items:    [].concat(cart),
    subtotal: subtotal, discount: discount, deliveryCharge: deliveryCharge,
    total:    grandTotal, totalAmount: grandTotal,
    selectedAddress: { companyName:companyName, fullName:fullName, address:address, phone:phone },
    deliveryTime: deliveryTime, deliverySlot: deliverySlot,
    fastDelivery:  fastChecked || autoCharge > 0,
    paymentMethod: payMethod, status: "Paid"
  };

  var user = getCurrentUser();
  cart.forEach(function(item){ reduceStock(item.productId, item.quantity); });
  user.orders.unshift(order);
  user.cart = [];
  saveOneUser(user);
  updateCartBadge();

  /* Write to global admin-visible orders store */
  placeOrder(order, user);

  _opShowSuccessScreen(order);
}

/* Private helpers */
function _opFillFormFromAddress(addr) {
  var fields = [
    {id:"opCompany",  val:addr.companyName||""},
    {id:"opFullName", val:addr.fullName||""},
    {id:"opAddress",  val:addr.address||""},
    {id:"opPhone",    val:addr.phone||""}
  ];
  fields.forEach(function(f){
    var el = document.getElementById(f.id);
    if (el) { el.value = f.val; el.classList.remove("op-input-error"); }
  });
}

function _opRenderCartSummary() {
  var container = document.getElementById("opCartItems"); if (!container) return;
  var cart = getCart();
  container.innerHTML = cart.map(function(item){
    return '<div class="op-cart-item">'
      + '<img class="op-cart-img" src="'+item.image+'" alt="'+item.name+'" onerror="this.src=\'https://via.placeholder.com/56\'"/>'
      + '<div class="op-cart-info"><p class="op-cart-name">'+item.name+'</p>'
      + '<p class="op-cart-meta">Qty: '+item.quantity+' x '+formatPrice(item.price)+'</p></div>'
      + '<span class="op-cart-sub">'+formatPrice(item.price*item.quantity)+'</span>'
      + '</div>';
  }).join("");
  _opUpdateTotal();
}

function _opUpdateTotal() {
  var subtotal    = getCartTotal();
  var discount    = Math.round(subtotal * 0.05);
  var fastChecked = (document.getElementById("opFastDelivery")||{}).checked || false;
  var timeVal     = ((document.getElementById("opDeliveryTime")||{}).value)||"";
  var autoCharge  = calculateExtraCharge(timeVal);
  var charge      = (autoCharge > 0 || fastChecked) ? 100 : 0;
  var grand       = subtotal - discount + charge;
  var setTxt = function(id,val){ var el=document.getElementById(id); if(el)el.textContent=val; };
  setTxt("opSubtotal",     formatPrice(subtotal));
  setTxt("opDiscount",     "- "+formatPrice(discount));
  setTxt("opDeliveryCost", charge > 0 ? formatPrice(charge)+(fastChecked||autoCharge>0?" (Fast)":"") : "FREE");
  setTxt("opGrandTotal",   formatPrice(grand));
  var dcEl = document.getElementById("opDeliveryCost");
  if (dcEl) dcEl.className = charge > 0 ? "op-price-fast" : "op-price-free";
}

function _opHandleDeliveryChange() {
  var val    = ((document.getElementById("opDeliveryTime")||{}).value)||"";
  var charge = calculateExtraCharge(val);
  var badge  = document.getElementById("opChargeBadge");
  var text   = document.getElementById("opChargeText");
  if (charge > 0) {
    if (badge) badge.classList.add("co-charge-badge--fast");
    if (text)  text.innerHTML = '<i class="fa-solid fa-bolt"></i> Fast delivery: <strong>Rs.100</strong> (within 24 hrs)';
  } else {
    if (badge) badge.classList.remove("co-charge-badge--fast");
    if (text)  text.textContent = "Standard delivery - FREE";
  }
  _opUpdateTotal();
}

function _opSetDefaultDeliveryTime() {
  var input = document.getElementById("opDeliveryTime"); if (!input) return;
  var pad   = function(n){ return String(n).padStart(2,"0"); };
  var def   = new Date(Date.now() + 24*60*60*1000);
  var now   = new Date();
  input.value = def.getFullYear()+"-"+pad(def.getMonth()+1)+"-"+pad(def.getDate())
              +"T"+pad(def.getHours())+":"+pad(def.getMinutes());
  input.min   = now.getFullYear()+"-"+pad(now.getMonth()+1)+"-"+pad(now.getDate())
              +"T"+pad(now.getHours())+":"+pad(now.getMinutes());
}

function _opPopulateSlots() {
  var sel = document.getElementById("opSlot"); if (!sel) return;
  var slots = generateDeliverySlots();
  sel.innerHTML = slots.map(function(s){ return '<option value="'+s+'">'+s+'</option>'; }).join("");
}

function _opShowBanner(type, msg) {
  var b = document.getElementById("opBanner"); if (!b) return;
  b.className = "op-banner op-banner--"+type;
  b.textContent = msg;
  b.style.display = "flex";
  clearTimeout(b._t);
  b._t = setTimeout(function(){ b.style.display="none"; }, 4000);
}

function _opShowSuccessScreen(order) {
  var page = document.getElementById("orderPageBody"); if (!page) return;
  var addr  = order.selectedAddress || {};
  var waURL = _aoGetWhatsAppURL(order);
  var dcTxt = order.deliveryCharge > 0
    ? formatPrice(order.deliveryCharge)+" (Fast)" : "FREE";

  page.innerHTML =
    '<div class="op-success-page">'
    + '<div class="op-success-anim">'
    + '<div class="co-success-ring"></div>'
    + '<i class="fa-solid fa-circle-check co-success-icon"></i>'
    + '</div>'
    + '<h2 class="op-success-title">Order Placed Successfully!</h2>'
    + '<p class="op-success-sub">Your order <strong>'+order.orderId+'</strong> has been confirmed.</p>'
    + '<div class="op-success-card">'
    + '<div class="op-success-row"><span>Amount Paid</span><strong>'+formatPrice(order.total)+'</strong></div>'
    + '<div class="op-success-row"><span>Payment Method</span><strong>'+order.paymentMethod+'</strong></div>'
    + '<div class="op-success-row"><span>Company</span><strong>'+(addr.companyName||"-")+'</strong></div>'
    + '<div class="op-success-row"><span>Deliver to</span><strong>'+addr.fullName+', '+addr.address+'</strong></div>'
    + '<div class="op-success-row"><span>Phone</span><strong>'+addr.phone+'</strong></div>'
    + '<div class="op-success-row"><span>Delivery Slot</span><strong>'+order.deliverySlot+'</strong></div>'
    + '<div class="op-success-row"><span>Delivery Charge</span><strong>'+dcTxt+'</strong></div>'
    + '<div class="op-success-row"><span>Status</span><strong class="op-success-status"><i class="fa-solid fa-circle-check"></i> '+order.status+'</strong></div>'
    + '</div>'
    + '<a class="op-btn op-btn--whatsapp" href="'+waURL+'" target="_blank" rel="noopener">'
    + '<i class="fa-brands fa-whatsapp"></i> Share on WhatsApp</a>'
    + '<div class="op-success-actions">'
    + '<a href="orders.html" class="op-btn op-btn--primary"><i class="fa-solid fa-box-open"></i> View My Orders</a>'
    + '<a href="index.html" class="op-btn op-btn--secondary"><i class="fa-solid fa-bag-shopping"></i> Continue Shopping</a>'
    + '</div></div>';

  window.scrollTo({top:0, behavior:"smooth"});
}


/* ================================================================
   §18  FORM VALIDATION
   ================================================================ */
function setFieldError(fieldId, errorId, message) {
  var field = document.getElementById(fieldId);
  var error = document.getElementById(errorId);
  if (error) error.textContent = message;
  if (field) {
    if (message) field.classList.add("input-error");
    else         field.classList.remove("input-error");
  }
}

function clearAllErrors(ids) {
  ids.forEach(function(id){
    var el = document.getElementById(id); if (el) el.textContent = "";
  });
  var errEls = document.querySelectorAll(".input-error");
  for (var i=0; i<errEls.length; i++) errEls[i].classList.remove("input-error");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
