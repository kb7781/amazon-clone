# 🛒 Amazon Clone – Full-Stack E-Commerce Web Application

A pixel-perfect Amazon clone built with React.js, Node.js/Express, and SQLite. Features product browsing, search & filtering, shopping cart, checkout, and order management. All prices in **₹ (INR)**.

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![Express](https://img.shields.io/badge/Express-5-green) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-purple) ![SQLite](https://img.shields.io/badge/SQLite-3-orange)

---

## 🚀 Tech Stack

| Layer      | Technology                         |
|------------|-----------------------------------|
| Frontend   | React 19 + Vite + Tailwind CSS    |
| Backend    | Node.js + Express 5               |
| Database   | SQLite (via better-sqlite3)        |
| State      | React Context API                  |
| Routing    | React Router v7                    |
| HTTP       | Axios                              |
| Icons      | React Icons (Feather + FontAwesome)|

---

## 📁 Project Structure

```
amazon/
├── server/                     # Express backend
│   ├── controllers/            # Business logic
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/                 # API route definitions
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── auth.js
│   ├── db.js                   # Database schema & connection
│   ├── seed.js                 # Seed script (categories, products)
│   └── index.js                # Express entry point
├── src/                        # React frontend
│   ├── components/             # Reusable UI components
│   │   ├── Navbar/
│   │   ├── HeroBanner/
│   │   ├── CategoryGrid/
│   │   ├── ProductCard/
│   │   ├── ProductGrid/
│   │   ├── StarRating/
│   │   ├── DealsSection/
│   │   ├── Footer/
│   │   └── LoadingSkeleton/
│   ├── pages/                  # Page components
│   │   ├── Home/
│   │   ├── ProductListing/
│   │   ├── ProductDetail/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── OrderConfirmation/
│   │   ├── OrderHistory/
│   │   ├── Wishlist/
│   │   └── Auth/
│   ├── context/                # React Context providers
│   │   ├── CartContext.jsx
│   │   └── WishlistContext.jsx
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

```
┌────────────┐     ┌──────────────┐     ┌────────────────┐
│   users     │     │  categories  │     │  product_images │
├────────────┤     ├──────────────┤     ├────────────────┤
│ id (PK)    │     │ id (PK)      │     │ id (PK)        │
│ name       │     │ name         │     │ product_id (FK)│
│ email      │     │ image_url    │     │ image_url      │
│ password   │     └──────────────┘     └────────────────┘
│ created_at │            │                      │
└────────────┘            │                      │
      │            ┌──────┴──────┐               │
      │            │  products   │───────────────┘
      │            ├─────────────┤
      │            │ id (PK)     │
      │            │ name        │
      │            │ description │
      │            │ price       │
      │            │ stock       │
      │            │ category_id │
      │            │ rating      │
      │            │ review_count│
      │            │ image_url   │
      │            └─────────────┘
      │                   │
┌─────┴──────┐    ┌──────┴──────┐
│ cart_items  │    │   orders    │
├────────────┤    ├─────────────┤
│ id (PK)    │    │ id (PK)     │
│ user_id(FK)│    │ user_id(FK) │
│ product_id │    │ total_amount│
│ quantity   │    │ ship_address│
└────────────┘    │ status      │
                  │ created_at  │
                  └─────────────┘
                        │
                  ┌─────┴──────┐
                  │ order_items│
                  ├────────────┤
                  │ id (PK)    │
                  │ order_id   │
                  │ product_id │
                  │ quantity   │
                  │ price      │
                  └────────────┘
```

---

## 🔗 REST API Endpoints

| Method | Endpoint                  | Description                    |
|--------|---------------------------|-------------------------------|
| GET    | `/api/health`             | Health check                   |
| GET    | `/api/products`           | List products (?search, ?category, ?sort) |
| GET    | `/api/products/:id`       | Product detail with images     |
| GET    | `/api/categories`         | List all categories            |
| GET    | `/api/cart/:userId`       | Get user's cart                |
| POST   | `/api/cart`               | Add item to cart               |
| PUT    | `/api/cart/:itemId`       | Update cart item quantity      |
| DELETE | `/api/cart/:itemId`       | Remove item from cart          |
| POST   | `/api/orders`             | Place a new order              |
| GET    | `/api/orders/user/:userId`| Get user's order history       |
| GET    | `/api/orders/:id`         | Get single order details       |

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd amazon
```

### 2. Install dependencies
```bash
npm install
```

### 3. Seed the database
```bash
npm run seed
```
This creates the SQLite database and populates it with:
- 1 default user (John Doe, id: 1)
- 6 categories (Electronics, Books, Clothing, Home & Kitchen, Sports, Beauty)
- 31 products with realistic INR pricing (₹199 – ₹1,09,999) and images
- 4 gallery images per product
- All prices in Indian Rupees (₹)

### 4. Start the application
```bash
# Start both frontend and backend concurrently
npm run dev:all
```

Or start them separately:
```bash
# Terminal 1 - Backend (port 3001)
npm run dev:server

# Terminal 2 - Frontend (port 5173)
npm run dev
```

### 5. Open in browser
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api/health

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero carousel, categories, deals, featured products |
| Products | `/products` | Search, filter by category & price, sort, pagination |
| Product Detail | `/products/:id` | Image gallery, specs, Add to Cart, Buy Now |
| Cart | `/cart` | Cart items, qty controls, order summary |
| Checkout | `/checkout` | 3-step: shipping → review → payment |
| Order Confirmation | `/order-confirmation/:id` | Success page with order ID |
| Order History | `/orders` | All past orders |
| Wishlist | `/wishlist` | Saved items with Move to Cart / Remove |

---

## ⭐ Bonus Features

| Feature | Status | Details |
|---------|--------|----------|
| Responsive Design | ✅ Done | Mobile, tablet, desktop support via Tailwind responsive classes |
| User Authentication | ✅ Done | Login/Signup page at `/auth`, backend routes at `/api/auth` |
| Order History | ✅ Done | Full order history page at `/orders` |
| Wishlist | ✅ Done | Heart toggle (♡/♥) on product cards & detail page, dedicated `/wishlist` page |
| Email Notification | ❌ Not Done | Requires external email service (Nodemailer) |

---

## 🎨 Design Decisions

- **Amazon UI Colors**: Header `#131921`, sub-nav `#232F3E`, accent `#FF9900`
- **Server-side cart**: Cart persists in database, not localStorage
- **Default user**: Assumes user id=1 (John Doe) is always logged in
- **Currency**: Indian Rupee (₹) — all prices in INR
- **Responsive**: Fully responsive across mobile, tablet, and desktop

---

## 🏗️ Assumptions

1. No authentication required — default user (id: 1, "John Doe") is always logged in
2. Payment is simulated (Cash on Delivery by default)
3. SQLite is used for simplicity (zero external dependencies)
4. Product images come from picsum.photos (seeded URLs)
5. Auth and Wishlist features are included as bonus features

---

## 🌐 Deployment

| Service | Role | URL |
|---------|------|-----|
| **Vercel** | Frontend (React/Vite) | [https://amazon-two-taupe.vercel.app](https://amazon-two-taupe.vercel.app) |
| **Render** | Backend + Database (Express + SQLite) | [https://amazon-clone-q230.onrender.com/api/health](https://amazon-clone-q230.onrender.com/api/health) |

### Deploy Backend → Render.com (Free)

1. Push code to a **public GitHub repository**
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: _(leave blank)_
   - **Build Command**: `npm install`
   - **Start Command**: `node server/seed.js && node server/index.js`
   - **Environment**: Node
5. Deploy → Copy the URL (e.g. `https://amazon-clone-api-xxx.onrender.com`)

### Deploy Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo
2. Framework Preset: **Vite**
3. Add Environment Variable:
   - `VITE_API_URL` = `https://your-render-url.onrender.com/api`
4. Deploy

> **Note**: Render's free tier sleeps after 15 min of inactivity. The first request after sleep takes ~30s to wake up.
