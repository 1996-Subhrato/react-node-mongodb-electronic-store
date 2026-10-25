# TechZone — Role-Based Access Control (RBAC)

This document outlines the permission matrices, authorization guards, and security enforcement mechanisms that govern access across TechZone.

---

## 👥 Role Definitions

1. **Guest (Unauthenticated User)**:
   - Any visitor accessing the public storefront without logging in.
   - Allowed to browse products, read descriptions, view image galleries, use the general AI advisor, and read public reviews.
2. **Customer (Authenticated User)**:
   - Customer authenticated via `user_token`.
   - Access to personal shopping cart, checkout, order placement, order cancellation, personal order history, wishlist, profile management, verified reviews, and product-specific AI advisor.
3. **Administrator (`Admin`)**:
   - Privileged account authenticated via `admin_token` containing `isAdmin: true`.
   - Complete operational control: product CRUD, category CRUD, inventory adjustment, order status transitions, user registry inspection, and review moderation.

---

## 📊 RBAC Permission Matrix

| Feature / Resource | Public Guest | Customer (`User`) | Administrator (`Admin`) |
|---|:---:|:---:|:---:|
| **Browse Products & Categories** | ✅ Read | ✅ Read | ✅ Read |
| **Search & Filter Catalog** | ✅ Read | ✅ Read | ✅ Read |
| **View Product Specs & Gallery** | ✅ Read | ✅ Read | ✅ Read |
| **General AI Chatbot (`/api/ai/ask-general`)** | ✅ Execute | ✅ Execute | ✅ Execute |
| **Product-Specific AI (`/api/ai/ask-product`)**| ❌ No | ✅ Execute | ✅ Execute |
| **Manage Shopping Cart** | ❌ No | ✅ Full CRUD | ❌ No (User context) |
| **Place Order & Pay (Razorpay)** | ❌ No | ✅ Create | ❌ No |
| **View Personal Orders & Status** | ❌ No | ✅ Read (Own) | ✅ Read (All) |
| **Cancel Personal Order** | ❌ No | ✅ Update (Pending only) | ✅ Update (All) |
| **Submit Verified Product Review** | ❌ No | ✅ Create (Paid orders only) | ❌ No |
| **Delete / Moderate Reviews** | ❌ No | ❌ No | ✅ Delete |
| **Manage Wishlist & History** | ❌ No | ✅ Full CRUD | ❌ No |
| **Manage Catalog (Add/Edit/Delete Products)**| ❌ No | ❌ No | ✅ Full CRUD |
| **Manage Categories (Add/Edit/Delete)** | ❌ No | ❌ No | ✅ Full CRUD |
| **Adjust Real-Time Inventory Stock** | ❌ No | ❌ No | ✅ Update |
| **Update Order Fulfillment Status** | ❌ No | ❌ No | ✅ Update |
| **Inspect Customer Database & Orders** | ❌ No | ❌ No | ✅ Read |
| **Executive Analytics Dashboard** | ❌ No | ❌ No | ✅ Read |

---

## 🛡️ Backend Middleware Enforcement

### 1. Customer Guard (`middleware/authMiddleware.js` -> `verifyUserToken`)
```javascript
export const verifyUserToken = (req, res, next) => {
    let token = req.cookies.user_token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. Please login.' });

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
```

### 2. Admin Guard (`middleware/authMiddleware.js` -> `verifyAdminToken`)
Prevents privilege escalation by explicitly requiring the `isAdmin: true` claim:
```javascript
export const verifyAdminToken = (req, res, next) => {
    let token = req.cookies.admin_token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Admin login required.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Forbidden. Admin access required.' });
        }
        req.admin = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired admin token.' });
    }
};
```

---

## 🖥️ Frontend Route Guards (`components/ProtectedRoute.jsx`)

The client side employs a unified declarative route guard wrapping sensitive pages:

```jsx
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, admin, loading } = useAuth();

    if (loading) return <div className="spinner">Loading...</div>;

    if (adminOnly) {
        if (!admin) return <Navigate to="/admin/login" replace />;
        return children;
    }

    if (!user) return <Navigate to="/login" replace />;
    return children;
};
```

### Routing Integration in `App.jsx`:
- **Admin Section**: All `/admin/*` routes are encapsulated in `<ProtectedRoute adminOnly={true}>`.
- **Customer Section**: `/cart`, `/checkout`, `/order-success`, `/wishlist`, and `/profile` are encapsulated in `<ProtectedRoute>`.
- **Storefront**: `/`, `/products`, `/products/:id`, `/ai-assistant` remain open to all visitors.
