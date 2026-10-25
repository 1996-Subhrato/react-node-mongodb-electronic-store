# TechZone — Forms & Validations Architecture

This document maps all user and administrative forms across the TechZone application, detailing input validation schemas, error presentation, and multipart file upload handling.

---

## 📋 Comprehensive Form Inventory

| Form Name | Component | Client Engine | Server Controller | Multipart Upload |
|---|---|---|---|:---:|
| **Customer Registration** | `pages/Auth/Register.jsx` | React Hook Form | `userAuthController.register` | No |
| **Customer Login** | `pages/Auth/Login.jsx` | React Hook Form | `userAuthController.login` | No |
| **Customer Profile Update** | `pages/Auth/Profile.jsx` | Controlled State | `userAuthController.updateProfile` | Yes (`profile_image`) |
| **Change Password** | `pages/Auth/Profile.jsx` | Controlled State | `userAuthController.changePassword`| No |
| **Admin Login** | `pages/Admin/AdminLogin.jsx`| Controlled State | `adminAuthController.login` | No |
| **Admin Product Form** | `pages/Admin/ProductForm.jsx`| React Hook Form | `adminProductController.addProduct` / `editProduct` | Yes (`image`, `additional_images`) |
| **Admin Category Form** | `pages/Admin/CategoryManagement.jsx`| Controlled State | `adminCategoryController.createAdminCategory` | Yes (`image`) |
| **Checkout Shipping Form** | `pages/Checkout/Checkout.jsx`| Controlled State | `paymentController.handleTestSuccess` | No |
| **Verified Review Form** | `components/UI/ReviewModal.jsx`| Controlled State | `reviewController.addReview` | No |
| **AI Assistant Query** | `pages/AIAssistant/AIAssistant.jsx`| Controlled State | `aiController.askGeneralAI` | No |
| **Product AI Sheet** | `components/AI/ProductAISheet.jsx`| Controlled State | `aiController.askProductAI` | No |

---

## 🔍 Validation Schemas & Rules

### 1. Customer Registration (`Register.jsx`)
- **`name`**: Required. Min length 2 characters.
- **`email`**: Required. Must match standard email regex `^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i`. Normalized with `.trim().toLowerCase()`.
- **`password`**: Required. Min length 6 characters.
- **`confirmPassword`**: Must match `password` exactly.
- **`phone`**: Optional. 10-digit numeric pattern.

---

### 2. Admin Product Form (`ProductForm.jsx`)
Utilizes `react-hook-form` with inline `<AlertCircle>` error warnings:
- **`name`**: Required string.
- **`category`**: Required selection (valid MongoDB Category ID).
- **`price`**: Required positive number (> 0). Input scroll wheel locked via `formUtils.js`.
- **`stock_quantity`**: Required integer (>= 0).
- **`weight` / Spec**: Optional (e.g., `'128GB'`, `'256GB'`, `'Standard'`).
- **`description`**: Required text description.
- **`health_benefits` (Hardware Features)**: Optional string detailing camera, processor, display specs.
- **`nutrition_info` (Technical Details)**: Optional string detailing battery, dimensions, connectivity.
- **`recommended_intake` (OS & Software)**: Optional string detailing OS and charging protocol.
- **`ai_context_notes`**: Injected notes for OpenAI shopping advisor.
- **`image` (Primary File)**: Required on initial creation. Allowed formats: `.jpg`, `.jpeg`, `.png`, `.webp`. Max size: 5MB.
- **`additional_images`**: Up to 4 supplementary gallery images.

---

### 3. Checkout Shipping & Billing Form (`Checkout.jsx`)
Validates delivery information before payment order initiation:
- **`fullName`**: Required recipient name.
- **`email`**: Required receipt email.
- **`phone`**: Required delivery contact phone number (10 digits).
- **`addressLine1`**: Required street address and building number.
- **`addressLine2`**: Optional apartment or unit.
- **`city`**: Required delivery city.
- **`state`**: Required delivery state / province.
- **`pincode`**: Required 6-digit postal code.
- **`landmark`**: Optional nearby geographic identifier.

---

### 4. Verified Purchase Review Modal (`ReviewModal.jsx`)
- **`rating`**: Required integer between 1 and 5. Selected via interactive SVG star selector.
- **`review_text`**: Required string. Min length 10 characters, max length 500 characters.
- **Server Guard**: Before accepting, the backend verifies that the user has a completed order for the item with `payment_status: 'Paid'`.

---

## 🛠️ Input Scroll Wheel Prevention Helper (`utils/formUtils.js`)

When users scroll through a form, hovering over focused numeric fields (like price or stock) can inadvertently mutate values. TechZone prevents this behavior with a dedicated helper:

```javascript
/**
 * Prevents numeric inputs from changing value when scrolled over while focused.
 * Usage: <input type="number" onWheel={disableNumberInputScroll} />
 */
export const disableNumberInputScroll = (e) => {
    e.target.blur();
};
```
