# TechZone — Backend Flow & Logic Distribution

This document details the server-side architectural flow, middleware execution sequence, and controller logic distribution across the TechZone Express application.

---

## 🚀 Server Initialization Flow (`server.js` & `app.js`)

```
server.js
    │
    ├── 1. Loads Environment Configuration (dotenv.config)
    ├── 2. Connects to MongoDB via connectDB()
    └── 3. Starts HTTP listener on process.env.PORT (default: 5000)
            │
            ▼
app.js (Express Middleware Pipeline)
    │
    ├── 1. Helmet (Security Headers, CORP/COEP disabled for media)
    ├── 2. CORS (Origin: http://localhost:5173, credentials: true)
    ├── 3. Morgan ('dev' HTTP request logger)
    ├── 4. express.json() (Parses application/json payloads)
    ├── 5. cookieParser() (Populates req.cookies)
    ├── 6. express.static('uploads') (Serves media at /uploads)
    ├── 7. Mounts 12 API Route Modules under /api/*
    ├── 8. 404 Route Not Found Handler
    └── 9. Global Error Handler Middleware
```

---

## 🛡️ Middleware Execution Pipeline

```
Incoming HTTP Request
       │
       ▼
[ CORS & Origin Check ] ── Fail ──► 403 Forbidden
       │ Pass
       ▼
[ Body & Cookie Parsers ] ── Populates req.body & req.cookies
       │
       ▼
[ Route Match: /api/<module> ]
       │
       ├── Protected Customer Route? ──► [ verifyUserToken ]
       │                                       │
       │                                 Fail ──► 401 Unauthorized
       │                                       │ Pass (req.user = decoded)
       │
       ├── Protected Admin Route? ────► [ verifyAdminToken ]
       │                                       │
       │                                 Fail ──► 401 / 403 Forbidden
       │                                       │ Pass (req.admin = decoded)
       │
       ├── Multipart Upload? ────────► [ multer / upload.fields ]
       │                                       │
       │                                 Fail ──► 400 Invalid File
       │                                       │ Pass (req.file / req.files populated)
       │
       ▼
[ Target Controller Method ]
       │
       ├── Validation & Business Logic
       ├── Mongoose Database Operation
       │
       ├── Success ──► res.status(200/201).json(...)
       └── Error ────► next(error) ──► [ Global Error Handler (500) ]
```

---

## 📂 Controllers Inventory & Logic Distribution

### 1. Customer Authentication (`userAuthController.js`)
- `register`: Validates email uniqueness, creates `User` record with auto-hashed password.
- `login`: Verifies user password via `matchPassword()`, generates JWT, sets `user_token` HttpOnly cookie.
- `logout`: Clears `user_token` cookie with `{ maxAge: 0 }`.
- `getProfile`: Retrieves user details, address, and profile image.
- `updateProfile`: Handles profile image upload via `req.file` and updates name/phone.
- `changePassword`: Confirms current password before updating to new hashed password.
- `checkSession`: Non-throwing endpoint for React initial load session restoration.

### 2. Admin Authentication (`adminAuthController.js`)
- `login`: Authenticates administrator credentials, sets `admin_token` cookie containing `{ isAdmin: true }`.
- `logout`: Clears `admin_token` cookie.
- `getDashboardInfo`: Verifies active admin session.
- `checkSession`: Safe status checker for frontend admin routes.

### 3. Product Catalog (`productController.js`)
- `getProducts`: Public catalog endpoint supporting category filter (`?category=`), keyword search (`?search=`), and price sorting (`?sort=price_asc|price_desc`).
- `getProductDetail`: Retrieves single product populated with category details and image gallery.
- `getAllCategories`: Retrieves list of categories with active product counts.
- `getRelatedProducts`: Recommends other products from the same category.

### 4. Cart Management (`cartController.js`)
- `getCart`: Fetches authenticated user's cart, recalculates unit prices and subtotals.
- `addToCart`: Validates stock availability against `Inventory.available_stock` before inserting or incrementing item.
- `updateQuantity`: Adjusts item quantity, enforcing min 1 and max available stock ceiling.
- `removeFromCart`: Removes specific item from `cart.items` subdocument array.

### 5. Checkout & Calculations (`checkoutController.js`)
- `getCheckoutSummary`: Computes financial breakdown:
  - `subtotal`: Sum of all item subtotals.
  - `shippingCharge`: Free for orders >= ₹1,000; otherwise ₹50.
  - `taxAmount`: 18% GST on subtotal.
  - `finalTotal`: `subtotal + shippingCharge + taxAmount`.

### 6. Payments & Order Finalization (`paymentController.js`)
- `createRazorpayOrder`: Converts total into paise (`Math.round(total * 100)`), requests Razorpay order ID or generates test mock order.
- `handleTestSuccess`:
  1. Validates Razorpay HMAC-SHA256 signature if in production mode.
  2. Atomically decrements `available_stock` in `Inventory` for all line items.
  3. Creates `Order` document with status `'Pending'`, payment status `'Paid'`.
  4. Records `Payment` document.
  5. Clears the user's `Cart`.

### 7. Orders & Cancellations (`orderController.js`)
- `getUserOrders`: Fetches authenticated user's order history sorted by `createdAt: -1`.
- `getOrderDetails`: Fetches specific order and checks for existing reviews.
- `cancelOrder`: Enforces that only orders in `'Pending'` state can be cancelled. Sets status to `'Cancelled'` and restores reserved items back to `Inventory.available_stock`.

### 8. Artificial Intelligence (`aiController.js` & `aiService.js`)
- `askProductAI`: Injects product specs (name, category, description, hardware benefits, connectivity) into prompt and queries OpenAI; falls back to deterministic mock response engine if key is absent.
- `askGeneralAI`: Injects store catalog context for conversational recommendations.

### 9. Reviews & Ratings (`reviewController.js`)
- `getProductReviews`: Fetches public customer reviews for a given product.
- `checkReviewEligibility`: Verifies user has a completed paid order for the item before allowing review.
- `addReview`: Creates review document.
- `updateReview`: Allows customer to edit their review.
- `deleteReview`: Admin moderation endpoint to remove inappropriate reviews.

### 10. Inventory Control (`inventoryController.js`)
- `getInventory`: Admin overview of current available and reserved stock across all products.
- `updateStock`: Manual admin adjustment of available inventory.

### 11. Admin Product & Category CRUD (`adminProductController.js`, `adminCategoryController.js`)
- Full administrative CRUD with Multer file handling, automatic image cleanup on deletion, and category hierarchy management.

### 12. Wishlist & History (`wishlistController.js`, `recentlyViewedController.js`)
- Personalization endpoints tracking saved products and recent browsing history.
