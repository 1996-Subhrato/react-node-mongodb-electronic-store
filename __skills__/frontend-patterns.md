# TechZone — Frontend Engineering & UI Patterns

This document outlines standard React 19 design patterns, UI/UX conventions, and helper integrations across the TechZone frontend.

---

## 1. Component Architecture Pattern: Component → Service → Context

Keep UI components focused strictly on presentation and user events. Delegate network interactions and global state management:

```
[ User Action (Click 'Add to Cart') ]
                │
                ▼
[ Component: ProductCard.jsx ]
  - Checks local loading state
  - Calls api.post('/cart/add', { productId, quantity })
                │
                ▼
[ Centralized Axios Client: services/api.js ]
  - Automatically appends HttpOnly cookies
  - Handles response unwrapping
                │
                ▼
[ Global State: context/AuthContext.jsx ]
  - fetchCartCount() updates cartCount state across Navbar
                │
                ▼
[ Notification: context/ToastContext.jsx ]
  - addToast('Item added to cart!', 'success') shows alert
```

---

## 2. Indian Price Formatting Standard (`formatPrice`)

All prices across the platform represent Indian Rupees (INR). Always format numeric prices using the standardized helper to display currency symbols, thousand separators, and integer formatting:

```javascript
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price || 0);
};

// Examples:
// formatPrice(134900) -> "₹1,34,900"
// formatPrice(10995)  -> "₹10,995"
```

---

## 3. Dynamic Media Resolution (`getImageUrl`)

To seamlessly support both locally uploaded disk images (served via `/uploads/`) and external CDN URLs:

```javascript
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.png';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    const backendBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${backendBase}${cleanPath}`;
};
```

---

## 4. Modal Dialog Pattern (`ConfirmationModal.jsx` & `ReviewModal.jsx`)

Modals render an overlay and intercept keyboard and click events:

```jsx
import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm' }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    <button className="btn-danger" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
```

---

## 5. Slide-In AI Assistant Drawer (`ProductAISheet.jsx`)

Provides an engaging, non-intrusive chat sheet on product pages:
- Anchored to the right viewport edge (`position: fixed; right: 0; top: 0; height: 100vh`).
- Translates smoothly on open (`transform: translateX(0)`) and close (`transform: translateX(100%)`).
- Pre-populates with quick suggestion pills (e.g., *"How is the camera in low light?"*, *"Does it support fast charging?"*).

---

## 6. UI/UX Standards & Micro-Interactions

- **Loading Spinners & Skeletons**: Avoid sudden layout jumps. Render spinner components during catalog filtering and checkout processing.
- **Form Scroll Safety**: Attach `onWheel={disableNumberInputScroll}` to all numeric inputs to prevent accidental mutations.
- **Stock Indicators**:
  - `In Stock` (> 10 items): Emerald green badge.
  - `Low Stock` (1 - 10 items): Amber warning badge.
  - `Out of Stock` (0 items): Red badge; disables "Add to Cart" button.
