# TechZone — Dependencies Analysis

This document provides a deep architectural inspection of all third-party libraries and runtime dependencies integrated into the TechZone application.

---

## 📦 Backend Dependencies (`backend/package.json`)

```json
{
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.5.0",
    "morgan": "^1.10.1",
    "multer": "^2.1.1",
    "nodemon": "^3.1.14",
    "openai": "^6.34.0",
    "razorpay": "^2.9.6"
  }
}
```

### 1. `express` (v5.2.1)
- **Role**: Core HTTP application server.
- **Why Express 5?**: Express 5 natively handles rejected promises in route handlers and middleware without requiring third-party wrappers like `express-async-errors`.
- **Security Check**: Configured with CORS, Helmet, and express.json body parser limits.

### 2. `mongoose` (v9.5.0)
- **Role**: MongoDB Object Data Modeling (ODM).
- **Features Used**: Schema definitions, strict type enforcement, pre-save hooks (password hashing), population of foreign references (`category`, `product`), and atomic operators (`$inc`, `$gte`).
- **Connection**: Managed with pooled connections via `config/db.js`.

### 3. `bcrypt` (v6.0.0)
- **Role**: Key derivation and password salting.
- **Implementation**: 10-round salt generation. Plaintext passwords never touch database storage.
- **Method**: Asynchronous hashing in Mongoose pre-save middleware; verification in `matchPassword`.

### 4. `jsonwebtoken` (v9.0.3)
- **Role**: Stateless token-based authorization.
- **Algorithm**: HMAC-SHA256.
- **Payloads**: User (`{ id, email, name }`), Admin (`{ id, email, name, isAdmin: true }`).
- **Storage**: Dispatched via HttpOnly, SameSite cookies (`user_token`, `admin_token`).

### 5. `cookie-parser` (v1.4.7)
- **Role**: HTTP Cookie deserialization.
- **Purpose**: Reads incoming `Cookie` header strings and binds them to `req.cookies`, allowing clean extraction of auth tokens without string parsing.

### 6. `cors` (v2.8.6)
- **Role**: Cross-Origin Resource Sharing.
- **Configuration**:
  - `origin: 'http://localhost:5173'` (Vite dev server)
  - `credentials: true` (Permits transmitting cookies across origins)

### 7. `helmet` (v8.1.0)
- **Role**: HTTP Security Headers.
- **Configuration**:
  - Configured with `crossOriginResourcePolicy: false` and `crossOriginEmbedderPolicy: false` to allow serving uploaded media assets to the React SPA without CORS blocking.

### 8. `multer` (v2.1.1)
- **Role**: Multi-part streaming file uploads.
- **Storage**: DiskStorage configured in `backend/config/multer.js` and `backend/middleware/uploadMiddleware.js`.
- **Target Directories**: `backend/uploads/`, `backend/uploads/categories/`, `backend/uploads/profile_images/`.

### 9. `razorpay` (v2.9.6)
- **Role**: Payment gateway integration.
- **Usage**: Creates test orders (`orders.create`), converts amounts to paise (`Math.round(total * 100)`), and validates HMAC-SHA256 signatures (`crypto.createHmac('sha256', secret)`).

### 10. `openai` (v6.34.0)
- **Role**: Large Language Model API SDK.
- **Usage**: Powers the AI Product Assistant and General Shopping Advisor. Injects database product specs into system prompts. Includes an internal mock engine fallback.

### 11. `morgan` (v1.10.1)
- **Role**: HTTP request logging in development.

---

## 🎨 Frontend Dependencies (`frontend/package.json`)

```json
{
  "dependencies": {
    "axios": "^1.15.0",
    "lucide-react": "^1.8.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-hook-form": "^7.72.1",
    "react-router-dom": "^7.14.1"
  }
}
```

### 1. `react` & `react-dom` (v19.2.4)
- **Role**: User interface rendering engine.
- **Key Features**: React 19 concurrent features, action hooks, and functional component lifecycle.

### 2. `react-router-dom` (v7.14.1)
- **Role**: Client-side declarative routing and navigation.
- **Architecture**:
  - Top-level routing in `App.jsx`.
  - Nested routes for Admin (`/admin/*`) and Storefront (`/*`).
  - Route guards via `<ProtectedRoute>`.

### 3. `axios` (v1.15.0)
- **Role**: HTTP client.
- **Configuration (`frontend/src/services/api.js`)**:
  - Base URL: `http://localhost:5000/api`
  - `withCredentials: true` ensures HttpOnly auth cookies are forwarded automatically.
  - Global response interceptor extracts `response.data` and handles expected 401 session checks silently.

### 4. `lucide-react` (v1.8.0)
- **Role**: Lightweight, tree-shakable SVG icon library.
- **Usage**: Replaces bulky icon fonts with inline SVGs for shopping carts, search, user profiles, star ratings, and admin metrics.

### 5. `react-hook-form` (v7.72.1)
- **Role**: High-performance form state and validation.
- **Benefits**: Uncontrolled form inputs minimize re-rendering while enforcing validation rules (email regex, required fields, price minimums).
