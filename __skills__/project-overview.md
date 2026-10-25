# TechZone Electronics Store — Project Overview

## 📱 Application Identity
- **Application Name**: TechZone — AI-Powered Electronics E-Commerce Platform
- **Domain**: Modern Consumer Electronics Retail (Smartphones, Laptops, Audio, Wearables, Accessories)
- **Architecture**: Decoupled MERN (React 19 SPA + Express 5 Node.js API + MongoDB Database)
- **Frontend Entry**: `frontend/src/main.jsx` (Vite dev server: `http://localhost:5173`)
- **Backend Entry**: `backend/server.js` (Express API server: `http://localhost:5000`)
- **Database**: MongoDB (Mongoose connection: `mongodb://localhost:27017/dryfruit_hub_db` / `techzone_db`)

---

## 💼 Business Summary

TechZone is an enterprise-grade electronics retail platform engineered to simulate a full commercial online shopping lifecycle:

1. **Customer Web Store**:
   - **Catalog & Discovery**: Search by keyword, filter by categories (Mobiles, Laptops, Headphones, Smart Watches, Accessories), sort by price ascending/descending.
   - **Product Details & Gallery**: Multi-image viewing, technical specifications, real-time stock indicator (`In Stock`, `Low Stock`, `Out of Stock`), customer reviews with star ratings, and related products recommendations.
   - **Shopping Cart**: Real-time quantity manipulation, stock ceiling validation, and dynamic subtotal calculations.
   - **Checkout & Payments**: Multi-field shipping address capture, GST (18%) and shipping tier calculation, Razorpay Test Mode checkout with HMAC-SHA256 signature verification.
   - **Order Lifecycle**: Order tracking dashboard, printable order summaries, and cancellation with immediate automated stock restoration.
   - **Social & Personalization**: Product wishlist, recently viewed products tracker, and verified purchase review submissions.

2. **AI Shopping Assistant**:
   - **Product-Specific Advisor**: Embedded sheet on product detail pages answering technical queries, spec comparisons, and feature explanations using OpenAI GPT with contextual product injection.
   - **General Store Advisor**: Standalone shopping chatbot helping users choose devices based on budget, use-case, and battery/performance needs.
   - **Mock Fallback Engine**: Deterministic fallback engine providing instant responses if no external OpenAI API key is configured.

3. **Admin Management Suite**:
   - **Executive Dashboard**: Real-time KPI analytics (Total Orders, Gross Revenue, Low Stock Alerts, Best-Sellers).
   - **Product Catalog Management**: Full CRUD with multi-image file uploads via Multer.
   - **Category Management**: Category hierarchy with cover image uploads.
   - **Inventory Control**: Live stock adjustments and reserved stock tracking.
   - **Order Fulfillment Pipeline**: Multi-stage order status progression (`Pending` -> `Processing` -> `Shipped` -> `Delivered` / `Cancelled`).
   - **User Registry**: Customer accounts monitoring and individual user order histories.

---

## 👥 Dual-Role Security Model

| Attribute | Customer (User) | Administrator |
|---|---|---|
| **Identity Entity** | `models/User.js` | `models/Admin.js` |
| **Auth Strategy** | Email + Password (bcrypt) | Email + Password (bcrypt) |
| **Cookie Storage** | `user_token` (HttpOnly, SameSite: Lax) | `admin_token` (HttpOnly, SameSite: Lax) |
| **Alternative Header** | `Authorization: Bearer <token>` | `Authorization: Bearer <token>` |
| **Token Payload** | `{ id, email, name }` | `{ id, email, name, isAdmin: true }` |
| **Auth Guard** | `verifyUserToken` | `verifyAdminToken` |
| **Session API** | `GET /api/auth/session` | `GET /api/admin/session` |

---

## 📁 Project Directory Inventory

### Root Structure
```
react_node_mongodb/
├── backend/                  # Express REST API & Database Models
├── frontend/                 # React 19 Vite Single Page Application
├── __skills__/               # Architecture Blueprints & Technical Guides
├── dryfruit_hub_db.admins.json # Pre-seeded Admin Credentials Export
├── readme.md                 # Public Documentation & Setup Guide
└── .gitignore                # Source control exclusions
```

### Backend Structure (`backend/`)
```
backend/
├── config/
│   ├── db.js                 # Mongoose connection initialization
│   └── multer.js             # Multer diskStorage for product images
├── controllers/              # 17 Controller modules handling domain logic
│   ├── adminAuthController.js
│   ├── adminCategoryController.js
│   ├── adminDashboardController.js
│   ├── adminOrderController.js
│   ├── adminProductController.js
│   ├── adminUserController.js
│   ├── aiController.js
│   ├── cartController.js
│   ├── checkoutController.js
│   ├── inventoryController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── recentlyViewedController.js
│   ├── reviewController.js
│   ├── userAuthController.js
│   └── wishlistController.js
├── middleware/
│   ├── authMiddleware.js     # verifyUserToken & verifyAdminToken guards
│   └── uploadMiddleware.js   # Multer instances for avatars & categories
├── models/                   # 11 Mongoose Schemas & Models
│   ├── Admin.js
│   ├── Cart.js
│   ├── Category.js
│   ├── Inventory.js
│   ├── Order.js
│   ├── Payment.js
│   ├── Product.js
│   ├── RecentlyViewed.js
│   ├── Review.js
│   ├── User.js
│   └── Wishlist.js
├── routes/                   # 12 Express Route definitions
├── scripts/
│   └── seedElectronicsData.js # Seeding script with modern electronics catalog
├── services/
│   └── aiService.js          # OpenAI client & fallback knowledge engine
├── uploads/                  # Uploaded media (products, categories, avatars)
├── app.js                    # Express application configuration & middleware
├── server.js                 # HTTP listener & DB bootstrap
└── package.json
```

### Frontend Structure (`frontend/`)
```
frontend/
├── src/
│   ├── components/
│   │   ├── AI/               # ProductAISheet drawer
│   │   ├── Admin/            # AdminLayout, AdminSidebar
│   │   ├── Layout/           # Navbar, Footer, Main Layout
│   │   ├── Products/         # ProductCard, RecentlyViewed, RelatedProducts, StarRating
│   │   ├── Reviews/          # ReviewSection
│   │   ├── UI/               # ConfirmationModal, ReviewModal, Toast notification
│   │   └── ProtectedRoute.jsx # Client-side route authorization guard
│   ├── context/
│   │   ├── AuthContext.jsx   # Global User/Admin session state & cart count
│   │   └── ToastContext.jsx  # Notification alert dispatcher
│   ├── pages/
│   │   ├── AIAssistant/      # Standalone AI Store Assistant
│   │   ├── Admin/            # 8 Admin pages (Dashboard, Products, Orders, etc.)
│   │   ├── Auth/             # Login, Register, Customer Profile
│   │   ├── Cart/             # Interactive Cart with quantity selectors
│   │   ├── Catalog/          # Category filter, search, sorting
│   │   ├── Checkout/         # Multi-step checkout & OrderSuccess
│   │   ├── Home/             # Hero banners, featured products, categories
│   │   ├── NotFound/         # 404 Error page
│   │   ├── ProductDetail/    # Gallery, specs, AI sheet, reviews
│   │   └── Wishlist/         # Customer saved items
│   ├── services/
│   │   └── api.js            # Axios client with interceptors
│   ├── utils/
│   │   └── formUtils.js      # Input scroll prevention helpers
│   ├── App.jsx               # React Router DOM configuration
│   ├── main.jsx              # DOM rendering & provider mounting
│   └── index.css             # Global styling tokens
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔄 Core Business Workflows

### 1. Purchase & Stock Deduction Lifecycle
```
User Adds Product to Cart
       │
       ▼
Cart Validation (Stock check vs Inventory.available_stock)
       │
       ▼
User Proceeds to Checkout (/checkout)
       │
       ▼
Calculate Totals: Subtotal + (Subtotal >= ₹1000 ? Free : ₹50) + 18% GST
       │
       ▼
POST /api/payment/create-order (Generate Razorpay Test Order)
       │
       ▼
Client Razorpay Checkout Modal (or Mock Trigger)
       │
       ▼
POST /api/payment/test-success (Verify HMAC signature)
       ├── 1. Atomic decrement of Inventory.available_stock
       ├── 2. Create Order record (status: 'Pending', payment_status: 'Paid')
       ├── 3. Create Payment audit record
       └── 4. Empty User's Cart
       │
       ▼
Redirect to /order-success?orderId=...
```

### 2. Order Cancellation & Stock Restoration Flow
```
User accesses Order Details (/profile or /orders/:id)
       │
       ▼
User clicks "Cancel Order"
       │
       ▼
Backend Guard: Verify order_status === 'Pending'
       │
       ├── Set order_status = 'Cancelled'
       └── Loop order.items:
             Restore item.quantity back to Inventory.available_stock
       │
       ▼
Return success response and reflect updated status in UI
```

---

## 🔑 Environment Variables Specification

| Variable Name | Required | Default / Example | Purpose |
|---|---|---|---|
| `MONGO_URI` | Yes | `mongodb://localhost:27017/dryfruit_hub_db` | MongoDB connection string |
| `PORT` | No | `5000` | Port for Express API server |
| `JWT_SECRET` | Yes | `123456789@$%&ABCDEFGH` | Signing key for User & Admin JWT tokens |
| `NODE_ENV` | No | `development` | Environment mode (`development` / `production`) |
| `RAZORPAY_KEY_ID` | Yes | `rzp_test_...` | Razorpay public test key |
| `RAZORPAY_KEY_SECRET` | Yes | `...` | Razorpay private secret for webhook & HMAC check |
| `OPENAI_API_KEY` | Optional | `sk-...` | OpenAI API key for live GPT shopping assistance |
| `VITE_API_URL` (Frontend) | No | `http://localhost:5000/api` | Base URL for Axios client |
