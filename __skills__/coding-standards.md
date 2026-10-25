# TechZone — Coding Standards & Engineering Conventions

To maintain a clean, maintainable, and enterprise-grade codebase, all contributors and AI agents must adhere to the conventions documented below.

---

## 🏷️ Naming Conventions

### 1. Source Files & Folders
| Target | Convention | Example |
|---|---|---|
| **Frontend Components** | `PascalCase.jsx` | `ProductCard.jsx`, `AdminSidebar.jsx` |
| **Frontend Stylesheets**| `PascalCase.css` | `ProductCard.css`, `Navbar.css` |
| **Frontend Contexts**   | `PascalCase.jsx` | `AuthContext.jsx`, `ToastContext.jsx` |
| **Backend Controllers** | `camelCaseController.js` | `productController.js`, `userAuthController.js` |
| **Backend Routes**      | `camelCaseRoutes.js` | `productRoutes.js`, `orderRoutes.js` |
| **Backend Models**      | `PascalCase.js` (Singular) | `User.js`, `Product.js`, `Inventory.js` |
| **Middleware / Config** | `camelCase.js` | `authMiddleware.js`, `uploadMiddleware.js`, `db.js` |

### 2. Code Identifiers
- **Functions & Methods**: `camelCase` (e.g., `calculateCartTotal`, `verifyAdminToken`).
- **Variables & State**: `camelCase` (e.g., `cartCount`, `isProcessing`).
- **Constants & Enums**: `UPPER_SNAKE_CASE` (e.g., `JWT_SECRET`, `MONGO_URI`).
- **Database Fields**:
  - Metadata & Identifiers: `snake_case` (e.g., `order_number`, `available_stock`, `payment_status`).
  - Technical / AI Specs: `snake_case` (e.g., `health_benefits`, `nutrition_info`, `ai_context_notes`).

---

## 📡 API Response & Error Standards

### Standard Success Response
Every API endpoint returns a clear, structured JSON payload:
```json
{
  "message": "Human readable success message",
  "data": { ... } // or named entity: "product", "order", "items"
}
```

### Standard Error Response
Error payloads emitted by controllers and the global error handler:
```json
{
  "message": "Concise, user-facing error description",
  "error": { ... } // Stack trace or error object (only in development)
}
```

---

## 🏗️ Backend Engineering Rules

1. **Async / Await Safety**: Every asynchronous controller method must be wrapped in a `try-catch` block, with unexpected exceptions passed to `next(error)`.
2. **Explicit HTTP Status Codes**:
   - `200 OK`: Successful fetch, update, or action.
   - `201 Created`: Successfully created resource (User registration, Order placement).
   - `400 Bad Request`: Validation failure, missing required fields, insufficient stock.
   - `401 Unauthorized`: Missing, expired, or invalid JWT token.
   - `403 Forbidden`: Authenticated user lacks permission (e.g., non-admin accessing `/admin/*`).
   - `404 Not Found`: Target resource does not exist.
   - `500 Internal Server Error`: Unhandled server exception.
3. **Atomic Stock Modifications**: Never use `product.stock_quantity = product.stock_quantity - qty; await product.save();`. Always use `Inventory.findOneAndUpdate({ product, available_stock: { $gte: qty } }, { $inc: { available_stock: -qty } })`.
4. **Password Security**: Passwords must be hashed using `bcrypt` via Mongoose pre-save hooks and verified using `matchPassword()`. Plaintext passwords must never be stored, logged, or returned in response payloads.
5. **HttpOnly Cookie Transmission**: Auth tokens must be set with `httpOnly: true`, `sameSite: 'lax'`, and `secure: process.env.NODE_ENV === 'production'`.

---

## 🎨 Frontend Engineering Rules

1. **No Direct Axios Calls in Components**: All HTTP communication should route through `services/api.js` to ensure credentials, base URLs, and interceptors are consistently applied.
2. **Standardized Currency Formatting**: Always format financial amounts using Indian Rupee standards:
   ```javascript
   export const formatPrice = (price) => {
       return new Intl.NumberFormat('en-IN', {
           style: 'currency',
           currency: 'INR',
           maximumFractionDigits: 0
       }).format(price || 0);
   };
   ```
3. **Visual Feedback via Toasts**: Never use native `alert()` or `confirm()`. Use the `useToast()` hook or custom `ConfirmationModal` for user notifications and confirmations.
4. **Asset URL Resolution**: Use a helper or verify protocol before rendering image paths to safely support both local uploads (`/uploads/...`) and external CDN URLs (`https://...`).
5. **Number Input Scroll Protection**: Numeric inputs (e.g., prices, quantities) should attach `onWheel={(e) => e.target.blur()}` to prevent accidental value alterations while scrolling.
