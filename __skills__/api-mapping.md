# TechZone — API Contract & Endpoint Mapping

This document provides explicit interface definitions for all REST API endpoints exposed by the TechZone backend.

---

## 🔐 1. Customer Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a new customer account.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securePassword123",
    "phone": "+919876543210"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "message": "Registration successful!",
    "userId": "660c2b1e4f9b8c0012345678"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Email missing or already registered.

---

### `POST /api/auth/login`
Authenticates a customer and issues an HttpOnly cookie.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response (`200 OK`)**:
  - Sets Cookie: `user_token=<JWT>; HttpOnly; SameSite=Lax; Max-Age=604800`
  ```json
  {
    "message": "Login successful!",
    "user": {
      "id": "660c2b1e4f9b8c0012345678",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+919876543210",
      "profile_image": "/uploads/profile_images/avatar.jpg",
      "createdAt": "2026-03-01T10:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email or password.

---

### `GET /api/auth/session`
Validates existing cookie session without throwing errors.
- **Access**: Public (Cookie optional)
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": "660c2b1e4f9b8c0012345678",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
  *(Returns `null` if unauthenticated).*

---

## 🛍️ 2. Products Catalog (`/api/products`)

### `GET /api/products`
Retrieves filtered and sorted product catalog.
- **Access**: Public
- **Query Parameters**:
  - `category` (string, optional): MongoDB Category ID
  - `search` (string, optional): Keyword for regex search on product name
  - `sort` (string, optional): `'price_asc'` or `'price_desc'`
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": "660c3d9a4f9b8c0098765432",
      "name": "iPhone 15 Pro",
      "description": "Titanium build, A17 Pro chip.",
      "price": 134900,
      "stock_quantity": 50,
      "weight": "128GB",
      "image_url": "/images/products/iphone15pro.jpg",
      "category_id": "660c1a2b3c4d5e6f7a8b9c0d",
      "category_name": "Mobiles",
      "health_benefits": "Dynamic Island, Always-On display, Titanium build",
      "nutrition_info": "Chip: A17 Pro, Camera: 48MP, Display: 6.1-inch",
      "recommended_intake": "iOS 17, USB-C support",
      "ai_context_notes": "Flagship Apple smartphone"
    }
  ]
  ```

---

### `GET /api/products/:id`
Retrieves product details with image gallery.
- **Access**: Public
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": "660c3d9a4f9b8c0098765432",
    "name": "iPhone 15 Pro",
    "price": 134900,
    "images": [
      "/images/products/iphone15pro-front.jpg",
      "/images/products/iphone15pro-back.jpg"
    ]
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Product not found.

---

## 🛒 3. Cart & Checkout (`/api/cart`, `/api/checkout`)

### `GET /api/cart`
- **Access**: `verifyUserToken`
- **Success Response (`200 OK`)**:
  ```json
  {
    "items": [
      {
        "item_id": "660c4e1a4f9b8c0055555555",
        "product_id": "660c3d9a4f9b8c0098765432",
        "name": "iPhone 15 Pro",
        "price": 134900,
        "weight": "128GB",
        "image_url": "/images/products/iphone15pro.jpg",
        "quantity": 1,
        "subtotal": 134900
      }
    ],
    "total": 134900
  }
  ```

---

### `POST /api/cart/add`
- **Access**: `verifyUserToken`
- **Request Body**:
  ```json
  {
    "productId": "660c3d9a4f9b8c0098765432",
    "quantity": 1
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Product added to cart",
    "cart": { ... }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Insufficient stock available.

---

### `GET /api/checkout/summary`
- **Access**: `verifyUserToken`
- **Success Response (`200 OK`)**:
  ```json
  {
    "subtotal": 134900,
    "shippingCharge": 0,
    "taxAmount": 24282,
    "finalTotal": 159182
  }
  ```

---

## 💳 4. Payments & Order Placement (`/api/payment`)

### `POST /api/payment/create-order`
Initiates test payment order.
- **Access**: `verifyUserToken`
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": "ord_mock_1718900000000",
    "amount": 15918200,
    "currency": "INR",
    "receipt": "receipt_order_1718900000000",
    "key_id": "rzp_test_dRWiKHS7zr2Gki",
    "isMock": true
  }
  ```

---

### `POST /api/payment/test-success`
Finalizes transaction, updates inventory, creates order, and clears cart.
- **Access**: `verifyUserToken`
- **Request Body**:
  ```json
  {
    "razorpay_order_id": "ord_mock_1718900000000",
    "razorpay_payment_id": "pay_mock_1718900000000",
    "razorpay_signature": "signature_string",
    "billingDetails": {
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+919876543210",
      "addressLine1": "123 Tech Lane",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560001"
    }
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "message": "Order placed successfully!",
    "orderId": "660c5a3b4f9b8c0044444444",
    "orderNumber": "RYZ-1718900000000-4321"
  }
  ```

---

## 📦 5. Orders & Cancellation (`/api/orders`)

### `GET /api/orders/my-orders`
- **Access**: `verifyUserToken`
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": "660c5a3b4f9b8c0044444444",
      "order_number": "RYZ-1718900000000-4321",
      "total_amount": 159182,
      "order_status": "Pending",
      "payment_status": "Paid",
      "created_at": "2026-03-01T11:00:00.000Z",
      "items": [ ... ]
    }
  ]
  ```

---

### `POST /api/orders/:id/cancel`
Cancels pending order and restores stock back to inventory.
- **Access**: `verifyUserToken`
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Order cancelled successfully and stock restored."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Order already shipped/delivered or cannot be cancelled.

---

## 🤖 6. AI Shopping Assistants (`/api/ai`)

### `POST /api/ai/ask-product`
Contextual technical questions about a specific product.
- **Access**: `verifyUserToken`
- **Request Body**:
  ```json
  {
    "productId": "660c3d9a4f9b8c0098765432",
    "question": "Is the camera suitable for 4K video recording?"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "productId": "660c3d9a4f9b8c0098765432",
    "productName": "iPhone 15 Pro",
    "answer": "Yes, the iPhone 15 Pro features a 48MP main camera supporting 4K recording up to 60 fps in ProRes."
  }
  ```

---

## 📊 7. Admin Dashboard & Inventory (`/api/admin`)

### `GET /api/admin/stats`
- **Access**: `verifyAdminToken`
- **Success Response (`200 OK`)**:
  ```json
  {
    "stats": {
      "totalOrders": 142,
      "totalRevenue": 2489000,
      "lowStockCount": 3,
      "recentOrders": [ ... ]
    }
  }
  ```
