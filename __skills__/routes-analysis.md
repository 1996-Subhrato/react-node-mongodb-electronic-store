# TechZone — Express Routes Catalog & Endpoint Analysis

This document provides a comprehensive inventory of all 12 route modules registered under `/api` in `backend/app.js`.

---

## 🧭 Routes Summary Table

| Base Path | Module File | Primary Purpose | Auth Guard Required |
|---|---|---|---|
| `/api/auth` | `routes/authRoutes.js` | Customer registration, login, profile, password change | Mixed (Public + `verifyUserToken`) |
| `/api/admin` | `routes/adminRoutes.js` | Admin authentication, analytics, CRUD, and orders | Mixed (Public + `verifyAdminToken`) |
| `/api/products` | `routes/productRoutes.js` | Public product catalog, filters, details, categories | Public |
| `/api/cart` | `routes/cartRoutes.js` | Persistent shopping cart operations | `verifyUserToken` |
| `/api/checkout` | `routes/checkoutRoutes.js` | Pre-purchase calculation summary | `verifyUserToken` |
| `/api/payment` | `routes/paymentRoutes.js` | Razorpay test order creation & verification | `verifyUserToken` |
| `/api/orders` | `routes/orderRoutes.js` | Customer order history, details, cancellation | `verifyUserToken` |
| `/api/ai` | `routes/aiRoutes.js` | Contextual OpenAI store & product advisors | Mixed (Public + `verifyUserToken`) |
| `/api/inventory` | `routes/inventoryRoutes.js` | Stock level monitoring & manual adjustment | `verifyAdminToken` |
| `/api/reviews` | `routes/reviewRoutes.js` | Customer reviews, ratings, and admin moderation | Mixed (Public + User + Admin) |
| `/api/wishlist` | `routes/wishlistRoutes.js` | Saved products list management | `verifyUserToken` |
| `/api/recently-viewed` | `routes/recentlyViewedRoutes.js`| Browsing history tracking | `verifyUserToken` |

---

## 🔎 Detailed Route Endpoint Specifications

### 1. Customer Authentication (`/api/auth`)
| Method | Endpoint | Auth | Handler | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | None | `AuthController.register` | Registers customer account with bcrypt password |
| `POST` | `/api/auth/login` | None | `AuthController.login` | Authenticates customer, sets `user_token` cookie |
| `POST` | `/api/auth/logout` | None | `AuthController.logout` | Clears `user_token` cookie |
| `GET` | `/api/auth/profile` | `verifyUserToken` | `AuthController.getProfile` | Returns user details and order summary |
| `PUT` | `/api/auth/profile` | `verifyUserToken` | `AuthController.updateProfile` | Updates name, phone, or avatar image via Multer |
| `PUT` | `/api/auth/change-password` | `verifyUserToken` | `AuthController.changePassword` | Verifies current password and updates to new |
| `GET` | `/api/auth/session` | None | `AuthController.checkSession` | Silent initial load session verification |

---

### 2. Admin Operations (`/api/admin`)
| Method | Endpoint | Auth | Handler | Description |
|---|---|---|---|---|
| `POST` | `/api/admin/login` | None | `AdminAuthController.login` | Authenticates admin, sets `admin_token` cookie |
| `POST` | `/api/admin/logout` | None | `AdminAuthController.logout` | Clears `admin_token` cookie |
| `GET` | `/api/admin/dashboard` | `verifyAdminToken` | `AdminAuthController.getDashboardInfo` | Confirms valid admin session |
| `GET` | `/api/admin/session` | None | `AdminAuthController.checkSession` | Silent initial load admin session check |
| `GET` | `/api/admin/stats` | `verifyAdminToken` | `AdminDashboardController.getDashboardStats` | Aggregates revenue, order count, and low stock |
| `GET` | `/api/admin/products` | `verifyAdminToken` | `AdminProductController.getAdminProducts` | Retrieves product table with stock counts |
| `POST` | `/api/admin/products` | `verifyAdminToken` | `AdminProductController.addProduct` | Creates product with primary & gallery uploads |
| `PUT` | `/api/admin/products/:id` | `verifyAdminToken` | `AdminProductController.editProduct` | Updates product specifications and images |
| `DELETE`| `/api/admin/products/:id` | `verifyAdminToken` | `AdminProductController.removeProduct` | Removes product and unlinks disk media |
| `GET` | `/api/admin/categories`| `verifyAdminToken` | `AdminCategoryController.getAdminCategories` | Lists all categories |
| `POST` | `/api/admin/categories`| `verifyAdminToken` | `AdminCategoryController.createAdminCategory`| Creates category with cover image upload |
| `PUT` | `/api/admin/categories/:id`| `verifyAdminToken`| `AdminCategoryController.updateAdminCategory`| Updates category title, description, or image |
| `DELETE`| `/api/admin/categories/:id`| `verifyAdminToken`| `AdminCategoryController.deleteAdminCategory`| Deletes category |
| `GET` | `/api/admin/orders` | `verifyAdminToken` | `AdminOrderController.getAllOrders` | Lists all platform customer orders |
| `GET` | `/api/admin/orders/:id/items`| `verifyAdminToken`| `AdminOrderController.getOrderItems` | Inspects order item details |
| `PUT` | `/api/admin/orders/:id/status`| `verifyAdminToken`| `AdminOrderController.updateOrderStatus` | Updates status (`Processing`, `Shipped`, etc.) |
| `GET` | `/api/admin/users` | `verifyAdminToken` | `AdminUserController.getAllUsers` | Customer accounts overview |
| `GET` | `/api/admin/users/:id/orders`| `verifyAdminToken` | `AdminUserController.getUserOrderHistory` | Retrieves purchase history for specific user |
| `GET` | `/api/admin/inventory`| `verifyAdminToken` | `InventoryController.getInventory` | Stock levels across all inventory records |
| `PUT` | `/api/admin/inventory/:productId`| `verifyAdminToken`| `InventoryController.updateStock` | Adjusts available stock quantity |

---

### 3. Storefront Catalog (`/api/products`)
| Method | Endpoint | Auth | Handler | Description |
|---|---|---|---|---|
| `GET` | `/api/products` | None | `ProductController.getProducts` | Search (`?search=`), filter (`?category=`), sort (`?sort=`) |
| `GET` | `/api/products/categories` | None | `ProductController.getAllCategories`| Lists categories with product counts |
| `GET` | `/api/products/:id` | None | `ProductController.getProductDetail` | Complete product specs and gallery |
| `GET` | `/api/products/:id/related`| None | `ProductController.getRelatedProducts` | Recommended items in same category |

---

### 4. Shopping Cart (`/api/cart`)
| Method | Endpoint | Auth | Handler | Description |
|---|---|---|---|---|
| `GET` | `/api/cart` | `verifyUserToken` | `CartController.getCart` | Retrieves customer's current cart with line totals |
| `POST` | `/api/cart/add` | `verifyUserToken` | `CartController.addToCart` | Adds item to cart after stock verification |
| `PUT` | `/api/cart/item/:id` | `verifyUserToken` | `CartController.updateQuantity` | Updates quantity within available stock limits |
| `DELETE`| `/api/cart/item/:id` | `verifyUserToken` | `CartController.removeFromCart`| Removes item from cart |

---

### 5. Checkout & Payments (`/api/checkout`, `/api/payment`)
| Method | Endpoint | Auth | Handler | Description |
|---|---|---|---|---|
| `GET` | `/api/checkout/summary` | `verifyUserToken` | `checkoutController.getCheckoutSummary` | Computes subtotal, ₹50/free shipping, 18% GST |
| `POST` | `/api/payment/create-order`| `verifyUserToken` | `paymentController.createRazorpayOrder` | Generates Razorpay test order |
| `POST` | `/api/payment/test-success`| `verifyUserToken` | `paymentController.handleTestSuccess` | Validates HMAC signature, deduces stock, creates order |

---

### 6. Orders & Cancellation (`/api/orders`)
| Method | Endpoint | Auth | Handler | Description |
|---|---|---|---|---|
| `GET` | `/api/orders/my-orders` | `verifyUserToken` | `OrderController.getUserOrders` | Retrieves list of orders placed by customer |
| `GET` | `/api/orders/:id` | `verifyUserToken` | `OrderController.getOrderDetails` | Full order invoice view with review status |
| `POST` | `/api/orders/:id/cancel` | `verifyUserToken` | `OrderController.cancelOrder` | Cancels pending order and restores stock |

---

### 7. AI Assistants (`/api/ai`)
| Method | Endpoint | Auth | Handler | Description |
|---|---|---|---|---|
| `POST` | `/api/ai/ask-general` | None | `AIController.askGeneralAI` | Public store shopping chatbot |
| `POST` | `/api/ai/ask-product` | `verifyUserToken` | `AIController.askProductAI` | Contextual Q&A on specific product specs |

---

### 8. Reviews, Wishlist & Tracking
| Method | Endpoint | Auth | Handler | Description |
|---|---|---|---|---|
| `GET` | `/api/reviews/:productId` | None | `ReviewController.getProductReviews` | Public list of reviews for product |
| `GET` | `/api/reviews/check/:productId`| `verifyUserToken`| `ReviewController.checkReviewEligibility`| Confirms user completed paid purchase |
| `POST` | `/api/reviews` | `verifyUserToken` | `ReviewController.addReview` | Submits verified customer review |
| `PUT` | `/api/reviews/:id` | `verifyUserToken` | `ReviewController.updateReview` | Edits existing review |
| `DELETE`| `/api/reviews/:id` | `verifyAdminToken` | `ReviewController.deleteReview` | Admin moderation review removal |
| `GET` | `/api/wishlist` | `verifyUserToken` | `WishlistController.getWishlist` | Customer saved bookmarks |
| `POST` | `/api/wishlist/add` | `verifyUserToken` | `WishlistController.addToWishlist` | Adds product to wishlist |
| `DELETE`| `/api/wishlist/:id` | `verifyUserToken` | `WishlistController.removeFromWishlist`| Removes from wishlist |
| `GET` | `/api/recently-viewed` | `verifyUserToken` | `RecentlyViewedController.getRecentlyViewed`| Retrieves customer's recent browsing history |
| `POST` | `/api/recently-viewed/track`| `verifyUserToken` | `RecentlyViewedController.trackView` | Records product view timestamp |
