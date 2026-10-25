# TechZone — UI Components Inventory & Analysis

This document catalogs all reusable UI components located under `frontend/src/components/`, detailing their props, internal state, and layout behaviors.

---

## 📦 Component Inventory Table

| Component Path | Category | Purpose | Key Props |
|---|---|---|---|
| `components/Layout/Navbar.jsx` | Layout | Primary navigation bar with search, cart badge, and auth links | None (Uses `useAuth`) |
| `components/Layout/Footer.jsx` | Layout | Page footer with categories, customer care, and legal links | None |
| `components/Layout/Layout.jsx` | Layout | Master storefront layout wrapper (`Navbar` + children + `Footer`) | `children` |
| `components/Admin/AdminLayout.jsx` | Admin | Administrative shell providing fixed sidebar and content pane | `children` |
| `components/Admin/AdminSidebar.jsx`| Admin | Collapsible vertical navigation drawer for admin features | None (Uses `useAuth`, `useLocation`) |
| `components/Products/ProductCard.jsx`| Products | Showcase card for catalog grids with price, stock, and cart actions | `product`, `onAddToCart`, `onWishlistToggle` |
| `components/Products/StockStatus.jsx`| Products | Visual status badge (`In Stock`, `Low Stock`, `Out of Stock`) | `stock` (number) |
| `components/Products/StarRating.jsx` | Products | Visual 5-star rating renderer supporting fractional ratings | `rating` (number), `size` (number) |
| `components/Products/RecentlyViewed.jsx`| Products| Horizontal carousel of recently inspected electronics | None (Queries `/api/recently-viewed`) |
| `components/Products/RelatedProducts.jsx`| Products| Recommendation grid for products in the same category | `productId` (string) |
| `components/Reviews/ReviewSection.jsx` | Reviews | Customer reviews feed with verified purchase review trigger | `productId` (string) |
| `components/AI/ProductAISheet.jsx` | AI | Right-anchored slide-in drawer for contextual AI product advice | `isOpen`, `onClose`, `product` |
| `components/UI/ConfirmationModal.jsx`| UI | Accessible confirmation dialog for deletions and cancellations | `isOpen`, `title`, `message`, `onConfirm`, `onCancel` |
| `components/UI/ReviewModal.jsx` | UI | Modal dialog for rating selection and textual review submission | `isOpen`, `onClose`, `productId`, `onReviewSubmitted` |
| `components/UI/Toast.jsx` | UI | Floating notification badge rendered in `ToastProvider` | `toasts`, `onDismiss` |
| `components/ProtectedRoute.jsx` | Security | Route guard redirecting unauthorized visitors | `children`, `adminOnly` (boolean) |

---

## 🔍 Detailed Component Breakdowns

### 1. `ProductCard.jsx` (`components/Products/ProductCard.jsx`)
- **Visual Elements**:
  - Image thumbnail with fallback image resolver (`getImageUrl`).
  - Category badge pill.
  - Product title with text truncation.
  - Formatted price in INR (`₹{product.price}`).
  - `<StockStatus>` badge.
  - Interactive "Add to Cart" button (disabled if `stock_quantity === 0`).
  - Interactive Wishlist heart button.
- **Interactions**: Clicking the card body invokes `navigate('/products/' + product.id)`.

---

### 2. `ProductAISheet.jsx` (`components/AI/ProductAISheet.jsx`)
- **Visual Elements**:
  - Fixed-position slide-in drawer (`position: fixed; right: 0; top: 0; width: 420px`).
  - Header with product name and close (`<X>`) icon.
  - Quick question prompt pills (e.g., *"How is the camera?"*, *"Battery backup?"*, *"Is it good for gaming?"*).
  - Chronological chat bubbles separating user questions and AI responses.
  - Fixed bottom input bar with send button.
- **Interactions**: Submits to `POST /api/ai/ask-product` with `{ productId, question }`.

---

### 3. `Navbar.jsx` (`components/Layout/Navbar.jsx`)
- **Key Features**:
  - Brand logo with gradient text.
  - Search input with submit trigger to `/products?search=...`.
  - Category navigation pills.
  - Cart icon badge with animated counter reflecting `cartCount` from `AuthContext`.
  - Conditional authentication dropdown:
    - If user logged in: Displays user name, "Profile", "My Orders", "Logout".
    - If admin logged in: Displays "Admin Dashboard" shortcut.
    - If guest: Displays "Login" and "Register" buttons.

---

### 4. `AdminSidebar.jsx` (`components/Admin/AdminSidebar.jsx`)
- **Navigation Links**:
  - `<LayoutDashboard>` -> Dashboard (`/admin/dashboard`)
  - `<Package>` -> Products (`/admin/products`)
  - `<FolderTree>` -> Categories (`/admin/categories`)
  - `<ShoppingCart>` -> Orders (`/admin/orders`)
  - `<Users>` -> Users (`/admin/users`)
  - `<Boxes>` -> Inventory (`/admin/inventory`)
  - `<LogOut>` -> Logout handler
- **Active State**: Highlights active tab using `location.pathname.startsWith(route)`.

---

### 5. `ReviewSection.jsx` (`components/Reviews/ReviewSection.jsx`)
- **Key Features**:
  - Overall aggregate star rating calculation.
  - Rating distribution breakdown bars (5 stars down to 1 star).
  - "Write Review" button: Calls `GET /api/reviews/check/:productId` to confirm customer purchase eligibility before opening `<ReviewModal>`.
  - List of customer reviews with reviewer name, formatted date, star rating, and review text.
