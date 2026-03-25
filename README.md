# 🛍️ SHOP EASY — Mini E-Commerce Frontend

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat&logo=github&logoColor=white)

A beginner-friendly, fully responsive e-commerce frontend built with **pure HTML, CSS, and Vanilla JavaScript** — no frameworks, no backend required.

---

## 📸 Pages

| Page | File | Description |
|---|---|---|
| 🏠 Home | `index.html` | Product grid, search, category filters |
| 🛒 Cart | `cart.html` | Cart items, quantity controls, order summary |
| 📦 Product | `product.html` | Single product detail with related items |
| 🔐 Login | `login.html` | Sign-in form with validation |
| 📝 Register | `register.html` | Account creation with password strength meter |

---

## ✨ Features

### 🏬 Shopping
- **Product Grid** — 8 products with images, ratings, prices, and discount badges
- **Category Filter** — Filter by Electronics, Fashion, Sports, Beauty, Home & Kitchen
- **Live Search** — Instant product search as you type
- **Product Detail Page** — Full description, features, quantity selector, and related products

### 🛒 Cart System
- Add to cart from any page
- Increase / decrease quantity
- Remove individual items
- Order summary with subtotal, free delivery check, and 5% coupon discount
- **Cart data saved in `localStorage`** — persists across pages and browser refreshes

### 🔐 Authentication (Frontend / localStorage)
- **Register** — Name, email, password with real-time validation and password strength indicator
- **Login** — Email & password check against stored users
- **Session management** — Logged-in user shown in navbar; logout clears session
- **Auto-redirect** — Already-logged-in users skip the auth pages

### 🎨 UI / UX
- Fully **responsive** (mobile, tablet, desktop)
- Animated product cards with staggered fade-in
- Toast notifications for cart actions
- Hover effects on all interactive elements
- Password show/hide toggle on all password fields

---

## 📁 Project Structure

```
mini-shop/
│
├── index.html       ← Homepage with product grid
├── cart.html        ← Shopping cart page
├── product.html     ← Single product detail page
├── login.html       ← Login form
├── register.html    ← Registration form
├── style.css        ← All styles (responsive, modern)
├── script.js        ← All JS logic (products, cart, auth)
└── README.md        ← You are here
```

---

## 🚀 How to Run Locally

### Option 1 — VS Code Live Server (Recommended)

1. **Download or clone** the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/mini-shop.git
   cd mini-shop
   ```

2. **Open the folder** in [Visual Studio Code](https://code.visualstudio.com/)

3. **Install Live Server** extension:
   - Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
   - Search for **"Live Server"** by Ritwick Dey
   - Click **Install**

4. **Right-click** on `index.html` in the file explorer → **"Open with Live Server"**

5. Your browser opens at `http://127.0.0.1:5500` 🎉

> ⚠️ **Important:** Always use Live Server — don't just double-click the HTML file.  
> The `?id=` URL parameter on `product.html` won't work without a local server.

### Option 2 — Python Simple Server

```bash
# Python 3
python -m http.server 5500

# Then open: http://localhost:5500
```

---

## 🌐 Deploy to GitHub Pages (Make it Live!)

### Step 1 — Push to GitHub (see Git setup below)

### Step 2 — Enable GitHub Pages

1. Go to your repository on **github.com**
2. Click **Settings** (top tab)
3. In the left sidebar, click **Pages**
4. Under **"Branch"**, select `main` and folder `/ (root)`
5. Click **Save**
6. Wait ~60 seconds, then visit:
   ```
   https://YOUR-USERNAME.github.io/mini-shop/
   ```

That's it — your site is live on the internet! 🌍

---

## 🔧 Git & GitHub Setup Guide

### First Time Setup (do this once)

#### 1. Install Git
Download from [git-scm.com](https://git-scm.com) and install.

#### 2. Configure your identity
```bash
git config --global user.name  "Your Name"
git config --global user.email "your@email.com"
```

---

### Push Your Project to GitHub

#### Step 1 — Initialise a local Git repository
```bash
# Navigate to your project folder first
cd path/to/mini-shop

# Initialise Git
git init
```

#### Step 2 — Stage all files
```bash
# Add ALL files to the staging area
git add .

# Or add a specific file:
git add index.html
```

#### Step 3 — Make your first commit
```bash
git commit -m "Initial commit: ShopEasy Phase 3"
```

#### Step 4 — Create a repo on GitHub
1. Go to [github.com](https://github.com) → click **"New"** (green button)
2. Name it `mini-shop`
3. Keep it **Public**
4. Do **NOT** add README or .gitignore (you already have files)
5. Click **"Create repository"**

#### Step 5 — Link local repo to GitHub
```bash
# Replace YOUR-USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR-USERNAME/mini-shop.git

# Rename branch to "main"
git branch -M main
```

#### Step 6 — Push to GitHub
```bash
git push -u origin main
```
Enter your GitHub username and password (or Personal Access Token) when prompted.

---

### Updating Your Project After Changes

Every time you make changes:

```bash
# 1. Stage changed files
git add .

# 2. Commit with a message describing what you changed
git commit -m "Add login page and auth logic"

# 3. Push to GitHub
git push
```

That's it! GitHub Pages will auto-update within ~60 seconds.

---

### Quick Reference — Git Commands

| Command | What it does |
|---|---|
| `git init` | Start tracking a folder with Git |
| `git status` | See which files changed |
| `git add .` | Stage all changes |
| `git add filename` | Stage one file |
| `git commit -m "message"` | Save a snapshot with a label |
| `git push` | Upload commits to GitHub |
| `git pull` | Download latest changes from GitHub |
| `git log --oneline` | See commit history |
| `git diff` | See exact line changes |

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure and semantics |
| CSS3 | Styling, Flexbox, Grid, animations |
| Vanilla JavaScript (ES6+) | Cart logic, auth, DOM manipulation |
| `localStorage` | Persist cart and user data in browser |
| Font Awesome 6 | Icons |
| Google Fonts (Syne + DM Sans) | Typography |
| Unsplash | Product placeholder images |

---

## 📌 Limitations (Frontend Only)

Since this is a **frontend-only** project with no backend:

- Passwords are stored in `localStorage` in plain text — **do not use real passwords**
- User data only exists in **your browser** — it won't sync across devices
- The "Checkout" button is a UI demo only — no real payment processing

To make this production-ready, you would connect it to a backend (Node.js, Firebase, Supabase, etc.).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- Product images from [Unsplash](https://unsplash.com)
- Icons from [Font Awesome](https://fontawesome.com)
- Fonts from [Google Fonts](https://fonts.google.com)

---

*Built with ❤️ — SHOP EASY Phase 3*
