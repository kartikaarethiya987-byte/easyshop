# 🛍️ SHOP EASY — Full-Stack Frontend (Phase 4)

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat&logo=github&logoColor=white)

A complete, beginner-friendly e-commerce frontend built with **pure HTML, CSS, and Vanilla JavaScript**.  
No frameworks. No backend. Everything runs in the browser using `localStorage`.

---

## 🗂️ Project Structure

```
mini-shop/
│
├── index.html        ← Homepage — product grid, search, filters
├── cart.html         ← Shopping cart — items, qty, checkout
├── product.html      ← Product detail — description, add to cart
├── login.html        ← User login form
├── register.html     ← User registration form
├── orders.html       ← Order history for logged-in user
├── style.css         ← All styles (responsive, modern)
├── script.js         ← All JS — products, cart, auth, orders
└── README.md         ← This file
```

---

## ✨ Features

### 🏬 Shopping
- 8 products across 5 categories (Electronics, Fashion, Sports, Beauty, Home & Kitchen)
- Live search bar and category filter pills
- Product detail page with quantity selector, description, features, and related products

### 🛒 Cart System (Per-User)
- Cart is **tied to each user account** — different users see different carts
- Guests can also add to cart (stored temporarily)
- Add, remove, increase/decrease quantity
- Order summary: subtotal, free delivery, 5% coupon discount, grand total
- **Checkout** moves cart to orders and clears it

### 🔐 User Authentication (localStorage)
| Feature | Detail |
|---|---|
| Register | Name, email, password with real-time validation |
| Login | Email + password check against stored users |
| Session | Email stored as session token; full user object looked up on demand |
| Logout | Clears session, redirects to homepage |
| Password strength | Live meter (Too short → Weak → Fair → Good → Strong) |
| Auto-redirect | Already logged-in users skip the auth pages |

### 📦 Order History
- Each user has their own `orders[]` array stored in their profile
- Orders show: order ID, date, item thumbnails, status badge, total
- Expandable item detail rows per order
- "No orders yet" empty state for new users

### 🎨 UI / UX
- Sticky navbar with **dropdown user menu** (avatar chip, My Orders link, Logout)
- Responsive at all breakpoints (mobile, tablet, desktop)
- Toast notifications for cart actions (success / info / error)
- Animated product cards with staggered fade-in
- Checkout success panel after placing an order

---

## 🚀 How to Run Locally

### Recommended: VS Code + Live Server

1. **Clone or download** the project:
   ```bash
   git clone https://github.com/YOUR-USERNAME/mini-shop.git
   cd mini-shop
   ```

2. **Open in VS Code:**
   ```bash
   code .
   ```

3. **Install Live Server** (if not already):
   - Press `Ctrl+Shift+X` → search **"Live Server"** by Ritwick Dey → Install

4. **Right-click `index.html`** → **"Open with Live Server"**

5. Browser opens at `http://127.0.0.1:5500` 🎉

> ⚠️ **Always use Live Server** — double-clicking HTML files won't work because `?id=` URL parameters on `product.html` require a local server.

### Alternative: Python server
```bash
python -m http.server 5500
# Open: http://localhost:5500
```

---

## 🔧 How to Use the App

1. **Register** a new account on `register.html`
2. **Login** on `login.html`
3. Browse products on `index.html` — click any product or "View Details"
4. **Add to Cart** from the product card or product detail page
5. Go to **cart.html** → adjust quantities → **Proceed to Checkout**
6. Visit **orders.html** to see your full order history
7. Click the navbar user chip → dropdown shows **My Orders** and **Logout**

---

## 🌐 Deploy to GitHub Pages

### Step 1 — Push to GitHub (see below)

### Step 2 — Enable GitHub Pages
1. Open your repository on **github.com**
2. Click **Settings** tab
3. Left sidebar → **Pages**
4. Under **Branch**, select `main` and folder `/ (root)`
5. Click **Save**
6. Wait ~60 seconds, your site is live at:
   ```
   https://YOUR-USERNAME.github.io/mini-shop/
   ```

> No build step needed — pure HTML/CSS/JS deploys directly.

---

## 🔧 Git & GitHub Setup — Step by Step

### First-Time Setup (do this once)

#### 1. Install Git
Download from [git-scm.com](https://git-scm.com) and install.

#### 2. Set your identity
```bash
git config --global user.name  "Your Name"
git config --global user.email "your@email.com"
```

---

### Push Your Project

#### Step 1 — Initialise a Git repository in your project folder
```bash
cd path/to/mini-shop
git init
```

#### Step 2 — Stage all files
```bash
git add .
```
This tells Git: "Track all these files for the next commit."

#### Step 3 — Create your first commit
```bash
git commit -m "Initial commit: ShopEasy Phase 4"
```
A commit is a saved snapshot of your project.

#### Step 4 — Create a GitHub repository
1. Go to [github.com](https://github.com) → click **"New"** (green button, top left)
2. Repository name: `mini-shop`
3. Visibility: **Public**
4. ❌ Do NOT add README or .gitignore (you already have your files)
5. Click **Create repository**

#### Step 5 — Link your local repo to GitHub
```bash
git remote add origin https://github.com/YOUR-USERNAME/mini-shop.git
git branch -M main
```

#### Step 6 — Push to GitHub
```bash
git push -u origin main
```
Enter your GitHub username and a **Personal Access Token** (PAT) when prompted.
> To create a PAT: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → check `repo` scope.

---

### Updating After Changes

Every time you make changes to your files:

```bash
# 1. Stage all changed files
git add .

# 2. Commit with a description of what changed
git commit -m "Add orders page and checkout logic"

# 3. Push to GitHub (GitHub Pages auto-updates in ~60s)
git push
```

---

### Git Quick Reference

| Command | What it does |
|---|---|
| `git init` | Start a new Git repo in the current folder |
| `git status` | See which files are changed or untracked |
| `git add .` | Stage all changes for the next commit |
| `git add filename` | Stage one specific file |
| `git commit -m "msg"` | Save a snapshot with a label |
| `git push` | Upload commits to GitHub |
| `git pull` | Download latest changes from GitHub |
| `git log --oneline` | View commit history |
| `git diff` | See exact line-by-line changes |
| `git restore filename` | Discard changes to a file |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantics |
| CSS3 (Flexbox + Grid) | Layout, animations, responsive design |
| Vanilla JS (ES6+) | All logic — cart, auth, orders, rendering |
| `localStorage` | Persist users, carts, sessions, and orders |
| Font Awesome 6 | Icons |
| Google Fonts (Syne + DM Sans) | Typography |
| Unsplash | Product placeholder images |

---

## ⚠️ Limitations (Frontend-Only Demo)

| Limitation | Real-world Solution |
|---|---|
| Passwords stored in plain text | Hash with bcrypt on a backend |
| Data only in your browser | Server database (PostgreSQL, MongoDB) |
| No real payment | Stripe, Razorpay API |
| No email confirmation | NodeMailer / SendGrid |
| No server session | JWT tokens / sessions on backend |

This is a **learning project** — do not use real personal data!

---

## 📄 License

MIT — free to use, modify, and share.

---

*Built with ❤️ — SHOP EASY Phase 4*
