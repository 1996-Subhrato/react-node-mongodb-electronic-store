# TechZone — Reusable Business Logic & Domain Rules

This document details core business rules, financial calculation logic, stock synchronization algorithms, and payment verification workflows across TechZone.

---

## 📦 1. Real-Time Inventory Control & Concurrency

### Stock States
- **`available_stock`**: Units physically available for immediate purchase.
- **`reserved_stock`**: Units temporarily held during in-flight payments.

### Concurrency-Safe Order Deduction (`paymentController.js`)
When a customer completes payment:
1. Loop through all cart line items.
2. Execute an atomic MongoDB update:
   ```javascript
   const inventory = await Inventory.findOneAndUpdate(
       { 
           product: item.product, 
           available_stock: { $gte: item.quantity } 
       },
       { 
           $inc: { available_stock: -item.quantity } 
       },
       { new: true }
   );

   if (!inventory) {
       throw new Error(`Insufficient stock for "${item.name}".`);
   }
   ```
3. If any item fails the stock condition, an exception is thrown, preventing partial or over-subscribed orders.

### Automated Stock Restoration on Cancellation (`orderController.js`)
When an order in `'Pending'` status is cancelled:
1. Confirm `order.order_status === 'Pending'`.
2. Mark `order.order_status = 'Cancelled'`.
3. Loop through `order.items` and atomically return quantities back to `available_stock`:
   ```javascript
   for (const item of order.items) {
       await Inventory.findOneAndUpdate(
           { product: item.product._id },
           { $inc: { available_stock: item.quantity } }
       );
   }
   ```

---

## 💰 2. Checkout Financial Calculations

Both the client and server enforce identical calculation rules to prevent total discrepancies:

### Financial Rules
1. **Subtotal**: Sum of `(item.price * item.quantity)` for all items in the cart.
2. **Shipping Tier**:
   - If `subtotal >= ₹1,000` -> **Free Shipping** (`₹0`).
   - If `subtotal < ₹1,000` -> **Flat Delivery Fee** (`₹50`).
3. **Goods & Services Tax (GST)**:
   - 18% standard GST applied to the subtotal (`subtotal * 0.18`).
4. **Final Total**:
   - `subtotal + shippingCharge + taxAmount`.

### Razorpay Paise Conversion
Razorpay requires transaction amounts in **paise** (1 INR = 100 paise):
```javascript
const razorpayAmount = Math.round(finalTotal * 100);
```

---

## 🔒 3. Razorpay Payment Signature Verification

To prevent forged client payment confirmations, transactions are validated against the merchant secret:

```javascript
import crypto from 'crypto';

export const verifyRazorpaySignature = (orderId, paymentId, clientSignature, secret) => {
    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    return expectedSignature === clientSignature;
};
```
- If the signature does not match, the order is rejected with `400 Bad Request: Invalid signature`, and no inventory is deducted.

---

## 🤖 4. Contextual AI Prompt Engineering (`services/aiService.js`)

When a customer queries the AI Product Assistant on a product page, the backend dynamically constructs a system prompt injecting the exact hardware specifications from MongoDB:

```javascript
const systemPrompt = `
You are a Senior Electronics Specialist and Tech Advisor at "TechZone".
You are providing advice specifically about ${product.name} (Category: ${product.category_name}).

Product Description: ${product.description}
${product.health_benefits ? `Key Hardware Features: ${product.health_benefits}` : ''}
${product.nutrition_info ? `Technical Specifications: ${product.nutrition_info}` : ''}
${product.recommended_intake ? `OS & Connectivity: ${product.recommended_intake}` : ''}
${product.ai_context_notes ? `Additional Context: ${product.ai_context_notes}` : ''}

RULES:
1. ONLY answer questions related to this product, its specifications, capabilities, and comparisons.
2. If asked about competing devices, highlight this product's strengths objectively.
3. Be professional, concise, and helpful.
`;
```

### Deterministic Mock Fallback
If `OPENAI_API_KEY` is not present in the environment, the service seamlessly falls back to a deterministic keyword matching engine that parses specs, battery life, camera capabilities, and warranty terms directly from the product object, ensuring 100% uptime in development and testing environments.
