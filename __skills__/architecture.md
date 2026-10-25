# TechZone — System Architecture

This document outlines the high-level architecture of the **TechZone Electronics E-Commerce Platform**, illustrating the system boundaries, communication protocols, and architectural patterns.

---

## 🏗️ High-Level Architectural Diagram

```
+─────────────────────────────────────────────────────────────────────────+
│                       PRESENTATION LAYER (SPA)                          │
│                                                                         │
│  React 19 + Vite 8                                                      │
│  ├─ React Router DOM v7 (Public, Protected, Admin Nested Routes)        │
│  ├─ AuthContext (User & Admin session, cart count state)                │
│  ├─ ToastContext (Action feedback alerts)                               │
│  ├─ Axios Service Layer (credentials: true, global response interceptor)│
│  └─ Modular UI: Lucide Icons, Custom CSS Modules, Responsive Grids      │
+────────────────────────────────────┬────────────────────────────────────+
                                     │
                        HTTPS / JSON REST API
                        Cookies: user_token, admin_token
                                     │
+────────────────────────────────────▼────────────────────────────────────+
│                      APPLICATION & API LAYER                            │
│                                                                         │
│  Node.js (v18+) + Express 5.x                                           │
│  ├─ Security Middleware: Helmet, CORS (origin: 5173), CookieParser      │
│  ├─ Logging: Morgan ('dev')                                             │
│  ├─ Authentication Guards:                                              │
│  │   ├─ verifyUserToken (Extracts JWT, verifies user claim)              │
│  │   └─ verifyAdminToken (Extracts JWT, verifies isAdmin: true claim)    │
│  ├─ Multi-part Uploads: Multer (Disk storage in /uploads)               │
│  ├─ 17 Domain Controllers: Products, Orders, Cart, Payments, AI, etc.  │
│  ├─ AI Service: OpenAI Integration + Mock Knowledge Engine Fallback     │
│  └─ Centralized Error Handler (500/404 normalized JSON formatting)      │
+────────────────────────────────────┬────────────────────────────────────+
                                     │
                        Mongoose ODM (v9.5+)
                        MongoDB Wire Protocol
                                     │
+────────────────────────────────────▼────────────────────────────────────+
│                        PERSISTENCE LAYER                                │
│                                                                         │
│  MongoDB Database Engine                                                │
│  ├─ Core Models: User, Admin, Product, Category                         │
│  ├─ Transactional Models: Cart, Order, Payment, Inventory               │
│  ├─ Engagement Models: Review, Wishlist, RecentlyViewed                 │
│  └─ Guarantees: Unique constraints, atomic field updates, cascading refs│
+─────────────────────────────────────────────────────────────────────────+
```

---

## 층 System Layers Deep Dive

### 1. Presentation Layer (Client-Side SPA)
- **Framework**: React 19 bootstrapped with Vite 8.
- **Routing Engine**: React Router DOM v7 using declarative `<Routes>` and nested layouts (`AdminLayout`, public `Layout`).
- **State Management**:
  - `AuthContext`: Centralized provider tracking `user`, `admin`, `cartCount`, and active session verification.
  - `ToastContext`: Dynamic floating notification provider replacing alerts.
  - Local component state via React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
- **HTTP Client**: Axios instance configured with `withCredentials: true` to seamlessly transmit and receive secure HttpOnly cookies across origins.

### 2. Business Logic Layer (API Server)
- **Runtime**: Node.js utilizing ES Modules (`"type": "module"`).
- **Web Framework**: Express 5.x delivering non-blocking, asynchronous route handling.
- **Architectural Pattern**: Strict Controller-Route-Middleware separation:
  - **Routes**: Exclusively declare endpoint URLs, HTTP verbs, and attach auth/upload middlewares.
  - **Controllers**: Handle HTTP parameter parsing, call Mongoose models, enforce business rules, and formulate JSON responses.
  - **Services**: Encapsulate third-party SDK calls (e.g., `aiService.js` for OpenAI completions and fallbacks).
  - **Middleware**: Intercept requests for authentication validation, token decoding, and multipart binary streaming.

### 3. Persistence Layer (Data Store)
- **Database**: MongoDB (NoSQL document store).
- **ODM**: Mongoose 9.x enforcing strict schemas, type casting, pre-save middleware (e.g., bcrypt password hashing), and instance methods (`matchPassword`).
- **Data Modeling Strategy**: Hybrid embedded and referenced documents:
  - Referenced: `Product` belongs to `Category`, `Order` belongs to `User`.
  - Embedded: `Order.items` embeds product snapshots, quantities, and historical unit prices to preserve financial audit trails even if product details change later.

---

## 🔄 End-to-End Request & Response Lifecycle

```
[ Client Browser ]
        │
        │ 1. User submits checkout / clicks action
        ▼
[ Axios Client (frontend/src/services/api.js) ]
        │
        │ 2. Attaches HttpOnly cookie `user_token`
        ▼
[ Express Server (backend/app.js) ]
        │
        │ 3. Passes Helmet (headers) & CORS (validates localhost:5173)
        ▼
[ Auth Middleware (backend/middleware/authMiddleware.js) ]
        │
        │ 4. verifyUserToken: Validates JWT signature with JWT_SECRET
        │    Appends decoded token payload to `req.user`
        ▼
[ Route Handler (backend/routes/...) ]
        │
        │ 5. Dispatches to target Controller method
        ▼
[ Controller (backend/controllers/...) ]
        │
        │ 6. Validates request body & executes domain logic
        ▼
[ Database Layer (backend/models/...) ]
        │
        │ 7. Mongoose query / atomic update executed on MongoDB
        ▼
[ Controller ]
        │
        │ 8. Formats JSON response: res.json({ ... }) or res.status(201).json(...)
        ▼
[ Axios Client Interceptor ]
        │
        │ 9. Unwraps response.data; catches 401/403/500 errors
        ▼
[ React Component State / UI Update ]
        │
        │ 10. Re-renders UI and shows toast confirmation
        ▼
[ User sees updated view ]
```

---

## 🛡️ Cross-Cutting Concerns

### 1. Cross-Origin Resource Sharing (CORS) & Cookies
The frontend (`localhost:5173`) and backend (`localhost:5000`) run on different ports in development.
- CORS is configured with `credentials: true` and explicit origin `http://localhost:5173`.
- JWT tokens are stored in `HttpOnly`, `SameSite: Lax` cookies (`user_token` and `admin_token`), mitigating XSS token theft.

### 2. Error Handling & Normalization
- All controllers utilize asynchronous `try-catch` blocks and delegate unhandled exceptions to `next(error)`.
- A global Express error handler catches all errors, logs stack traces in development, and returns standardized JSON `{ message, error }`.
- Client-side Axios response interceptors cleanly catch HTTP errors and route friendly notifications through `ToastContext`.

### 3. File Storage & Media Pipeline
- Product and category images are uploaded via `multer` to designated directories in `backend/uploads/`.
- Express exposes this folder publicly via `app.use('/uploads', express.static('uploads'))`.
- Product images can also reference external HTTP/HTTPS CDN URLs directly.
