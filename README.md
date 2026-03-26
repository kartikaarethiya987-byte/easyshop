# 🛍️ SHOP EASY — Full-Stack E-Commerce (Phase 5)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

A complete full-stack e-commerce application. The frontend talks to a real
**Node.js + Express + MongoDB** backend via REST APIs. JWT authentication,
bcrypt password hashing, per-user cart, and persistent order history.

---

## 📁 Project Structure

```
ShopEasy/
│
├── backend/                     ← Node.js + Express server
│   ├── config/
│   │   └── seed.js              ← Seed script to populate products
│   ├── controllers/
│   │   ├── authController.js    ← Register, login, get profile
│   │   ├── cartController.js    ← Add, update, remove, clear cart
│   │   ├── orderController.js   ← Checkout, get orders
│   │   └── productController.js ← Fetch all / single product
│   ├── middleware/
│   │   └── authMiddleware.js    ← JWT token verification
│   ├── models/
│   │   ├── User.js              ← User schema (cart + orders embedded)
│   │   ├── Product.js           ← Product schema
│   │   └── Order.js             ← Order schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── .env.example             ← Copy to .env and fill in values
│   ├── package.json
│   └── server.js                ← Entry point
│
└── frontend/                    ← HTML/CSS/JS (open with Live Server)
    ├── index.html
    ├── cart.html
    ├── product.html
    ├── login.html
    ├── register.html
    ├── orders.html
    ├── style.css
    └── script.js                ← All API calls via fetch()
```

---

## ✨ Features

| Feature | How it works |
|---|---|
| User Registration | `POST /api/auth/register` → bcrypt hashes password → JWT returned |
| User Login | `POST /api/auth/login` → password compared → JWT returned |
| Auth Sessions | JWT stored in `localStorage`; sent as `Authorization: Bearer <token>` |
| Products | Seeded into MongoDB; fetched via `GET /api/products` |
| Search & Filter | `GET /api/products?search=X&category=Y` |
| Product Detail | `GET /api/products/:id` using MongoDB `_id` |
| Cart (per user) | Cart stored inside User document; CRUD via `/api/cart/*` |
| Checkout | `POST /api/orders` snapshots cart → creates Order → clears cart |
| Order History | `GET /api/orders` returns all orders for logged-in user |
| Protected Routes | Cart & order routes require valid JWT via `protect` middleware |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or newer
- [MongoDB](https://www.mongodb.com/) — local install **or** free Atlas cloud cluster
- [VS Code](https://code.visualstudio.com/) + Live Server extension

---

### Step 1 — Set Up MongoDB

**Option A: Local MongoDB**
1. Download and install from [mongodb.com/try/download](https://www.mongodb.com/try/download/community)
2. Start the service: `mongod` (or it runs automatically as a service)
3. Your connection string: `mongodb://localhost:27017/shopeasy`

**Option B: MongoDB Atlas (free cloud)**
1. Create a free account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Under "Database Access" → add a user with password
4. Under "Network Access" → add `0.0.0.0/0` (allow all IPs for dev)
5. Click "Connect" → "Drivers" → copy the connection string
6. It looks like: `mongodb+srv://username:password@cluster.mongodb.net/shopeasy`

---

### Step 2 — Configure the Backend

```bash
cd backend

# Copy the example env file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopeasy   # or your Atlas string
JWT_SECRET=pick_any_long_random_string_here
NODE_ENV=development
```

---

### Step 3 — Install Dependencies

```bash
cd backend
npm install
```

This installs: `express`, `mongoose`, `cors`, `dotenv`, `bcryptjs`, `jsonwebtoken`

---

### Step 4 — Seed the Database

Populate MongoDB with 8 sample products:

```bash
npm run seed
```

Expected output:
```
✅  MongoDB connected
🗑️   Cleared existing products
🌱  Seeded 8 products successfully
   • Wireless Noise-Cancelling Headphones → _id: 64f3...
   • Men's Classic White Sneakers → _id: 64f3...
   ...
📡  MongoDB disconnected
```

---

### Step 5 — Start the Backend Server

```bash
npm start          # Production: node server.js
# or
npm run dev        # Development: nodemon (auto-restarts on file changes)
```

You should see:
```
✅  MongoDB connected successfully
🚀  Server running at http://localhost:5000
📋  API base URL: http://localhost:5000/api
```

Test it in your browser: [http://localhost:5000/api/health](http://localhost:5000/api/health)
Should return: `{ "status": "OK", "message": "ShopEasy API is running!" }`

---

### Step 6 — Start the Frontend

1. Open the `frontend/` folder in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. Browser opens at `http://127.0.0.1:5500`

> The frontend's `script.js` is pre-configured to call `http://localhost:5000/api`.
> If your backend runs on a different port, update `API_BASE` at the top of `script.js`.

---

## 📡 API Reference

### Auth Routes

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | ❌ | Create account |
| POST | `/api/auth/login` | `{ email, password }` | ❌ | Get JWT token |
| GET | `/api/auth/me` | — | ✅ | Get current user |

### Product Routes

| Method | Endpoint | Query Params | Auth | Description |
|---|---|---|---|---|
| GET | `/api/products` | `?category=X&search=Y` | ❌ | All products |
| GET | `/api/products/:id` | — | ❌ | Single product |

### Cart Routes (all require JWT)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/cart` | — | Get cart |
| POST | `/api/cart/add` | `{ productId, quantity }` | Add item |
| PUT | `/api/cart/update` | `{ productId, quantity }` | Update qty |
| DELETE | `/api/cart/remove/:productId` | — | Remove item |
| DELETE | `/api/cart/clear` | — | Empty cart |

### Order Routes (all require JWT)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Checkout (cart → order) |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get single order |

---

## 🔐 Security

| Feature | Implementation |
|---|---|
| Password hashing | `bcryptjs` with 12 salt rounds (pre-save hook on User model) |
| Authentication | JWT tokens, 7-day expiry, stored in `localStorage` |
| Protected routes | `protect` middleware verifies token on every cart/order request |
| No password in responses | `toJSON()` override strips password from all User objects |
| Token auto-invalidation | 401 responses clear token and redirect to login |

> ⚠️ This is a learning project. For production: use HTTPS, httpOnly cookies instead of localStorage, rate limiting, and input sanitization.

---

## 🔧 Git & GitHub Setup

### First time

```bash
git init
git add .
git commit -m "Phase 5: Full-stack Node + MongoDB backend"
git remote add origin https://github.com/YOUR-USERNAME/mini-shop.git
git branch -M main
git push -u origin main
```

### After every change

```bash
git add .
git commit -m "describe your change"
git push
```

### Important: add `.env` to `.gitignore`

Create `backend/.gitignore`:
```
node_modules/
.env
```

Never push your `.env` file — it contains secrets!

---

## 🌐 Deploy to GitHub Pages (Frontend only)

The frontend can be deployed to GitHub Pages as-is. Just update `API_BASE` in
`script.js` to point to your deployed backend URL instead of `localhost:5000`.

For the backend, free options include:
- [Render](https://render.com) — free Node.js hosting
- [Railway](https://railway.app) — free tier with MongoDB plugin
- [Cyclic](https://cyclic.sh) — free serverless Node

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS (ES6+) |
| HTTP Client | `fetch()` API (built into browsers) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JSON Web Tokens (JWT) |
| Password security | bcryptjs (12 salt rounds) |
| Cross-origin | CORS middleware |
| Config | dotenv |

---

## 📄 License

MIT — free to use and modify.

---

*Built with ❤️ — SHOP EASY Phase 5*
