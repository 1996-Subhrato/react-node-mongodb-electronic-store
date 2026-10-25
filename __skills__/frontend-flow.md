# TechZone — Frontend Flow & Page Routing

This document details the React 19 component hierarchy, React Router DOM v7 layout structure, and end-to-end user navigation flows across the storefront and admin panels.

---

## 🌳 Application Component Tree

```
main.jsx (Mounts StrictMode)
  │
  ▼
ToastProvider (Floating alert provider)
  │
  ▼
AuthProvider (Session rehydration & cart counter)
  │
  ▼
Router (BrowserRouter)
  │
  ├── Route: /admin/login ──► <AdminLogin /> (Standalone unauthenticated screen)
  │
  ├── Route: /admin/* (Admin Layout Hierarchy)
  │     │
  │     ▼
  │   <ProtectedRoute adminOnly={true}>
  │     │
  │     ▼
  │   <AdminLayout> (AdminSidebar + Header + Page Outlet)
  │     ├── /admin/dashboard ─────► <AdminDashboardHome />
  │     ├── /admin/products ──────► <ProductManagement />
  │     ├── /admin/products/add ──► <ProductForm mode="add" />
  │     ├── /admin/products/edit/:id ► <ProductForm mode="edit" />
  │     ├── /admin/categories ────► <CategoryManagement />
  │     ├── /admin/orders ────────► <OrderManagement />
  │     ├── /admin/users ─────────► <UserManagement />
  │     └── /admin/inventory ─────► <InventoryManagement />
  │
  └── Route: /* (Storefront Layout Hierarchy)
        │
        ▼
      <Layout> (Navbar + Main Content + Footer)
        │
        ├── Public Routes:
        │     ├── / ──────────────► <Home />
        │     ├── /products ──────► <Catalog />
        │     ├── /products/:id ──► <ProductDetail />
        │     ├── /ai-assistant ──► <AIAssistant />
        │     ├── /login ─────────► <Login />
        │     ├── /register ──────► <Register />
        │     └── * ──────────────► <NotFound />
        │
        └── Customer Protected Routes (<ProtectedRoute>):
              ├── /cart ──────────► <Cart />
              ├── /checkout ──────► <Checkout />
              ├── /order-success ─► <OrderSuccess />
              ├── /wishlist ──────► <Wishlist />
              └── /profile ───────► <Profile />
```

---

## 🧭 Page-by-Page User Journeys

### 1. Storefront Discovery (`Home.jsx` -> `Catalog.jsx`)
1. **Home Page (`/`)**: Displays hero promotion banner, category shortcut pills (Mobiles, Laptops, Audio, Watches, Accessories), featured gadgets grid, and trust badges (Fast Delivery, 1-Year Warranty).
2. **Catalog Page (`/products`)**:
   - Left Sidebar: Category radio list and price sort selector (`Price: Low to High`, `Price: High to Low`).
   - Top Bar: Search query input with instant debounced backend querying.
   - Main Grid: Responsive grid of `<ProductCard>` components. Clicking anywhere on the card navigates to `/products/:id`.

---

### 2. Product Detail Journey (`ProductDetail.jsx`)
1. **Media Gallery**: Displays primary high-resolution product image and clickable thumbnail carousel for supplementary shots.
2. **Product Details & Stock Badge**: Renders price in INR (`formatPrice`), weight/capacity specs, and real-time inventory badge (`In Stock`, `Low Stock`, `Out of Stock`).
3. **Cart & Wishlist Actions**: "Add to Cart" button checks active stock; "Save to Wishlist" bookmarks item.
4. **AI Assistant Drawer Trigger**: A floating button opens the `<ProductAISheet>` drawer, allowing the customer to ask questions specifically regarding this device's specs, battery life, and comparisons.
5. **Customer Reviews Section**: Lists verified reviews, star breakdown, and displays the "Write Review" button if the customer has an eligible paid order.

---

### 3. Cart & Checkout Journey (`Cart.jsx` -> `Checkout.jsx` -> `OrderSuccess.jsx`)
1. **Cart Review (`/cart`)**: Displays line items with unit price, item subtotal, and increment/decrement buttons (capped by `Inventory.available_stock`).
2. **Financial Summary**: Updates live as quantities change: Subtotal + Shipping (Free over ₹1,000) + 18% GST = Final Total.
3. **Checkout (`/checkout`)**: Multi-field delivery address input.
4. **Payment Finalization**:
   - Triggers `POST /api/payment/create-order` to fetch a Razorpay order ID.
   - Opens Razorpay modal (or mock handler in test mode).
   - On completion, posts transaction credentials to `POST /api/payment/test-success`.
   - Backend deducts inventory, creates the order, and clears the cart.
5. **Success Confirmation (`/order-success`)**: Displays generated Order Number, itemized invoice, and order tracking link.

---

### 4. Admin Management Flow (`AdminLayout.jsx`)
1. **Dashboard Home (`/admin/dashboard`)**: KPI metric cards (Total Orders, Total Revenue, Low Stock Alerts) and recent orders table.
2. **Product CRUD (`/admin/products`)**: Searchable table of all products with stock counts, edit buttons, and deletion modals.
3. **Product Creation/Editing (`/admin/products/add`, `/admin/products/edit/:id`)**: Dual-pane form with image file pickers, category dropdown, price inputs, hardware specs, and AI notes.
4. **Order Fulfillment (`/admin/orders`)**: Comprehensive orders table with status dropdown (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
5. **Inventory Monitoring (`/admin/inventory`)**: Table showing live `available_stock` and `reserved_stock` with inline stock adjustment buttons.
