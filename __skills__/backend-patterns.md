# TechZone — Backend Architectural Patterns

This guide establishes the standardized patterns for authoring new routes, controllers, and services across the TechZone backend.

---

## 1. Route Layer Pattern (`routes/<module>Routes.js`)

Keep route files focused strictly on URL definitions, HTTP verb mapping, and middleware binding.

```javascript
import express from 'express';
import * as itemController from '../controllers/itemController.js';
import { verifyUserToken, verifyAdminToken } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// Public route
router.get('/', itemController.getItems);

// Customer protected route
router.post('/', verifyUserToken, itemController.createItem);

// Admin protected route with file upload
router.post(
    '/admin/create', 
    verifyAdminToken, 
    upload.single('image'), 
    itemController.adminCreateItem
);

export default router;
```

---

## 2. Controller Layer Pattern (`controllers/<module>Controller.js`)

Every controller method follows standard conventions:
1. Wrap all asynchronous operations in `try-catch`.
2. Extract and sanitize inputs from `req.body`, `req.params`, or `req.query`.
3. Verify permissions (via `req.user` or `req.admin` populated by auth middleware).
4. Perform atomic or validated Mongoose operations.
5. Return clean JSON with explicit HTTP status codes (200, 201, 400, 404, 500).
6. Delegate unhandled errors to `next(error)` to invoke the centralized error handler.

```javascript
import Item from '../models/Item.js';

export const createItem = async (req, res, next) => {
    try {
        const { name, price, category } = req.body;
        const userId = req.user.id;

        // 1. Validation
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required.' });
        }

        // 2. Database Operation
        const newItem = await Item.create({
            name: name.trim(),
            price: Number(price),
            category,
            user: userId
        });

        // 3. Normalized Success Response
        res.status(201).json({
            message: 'Item created successfully.',
            item: newItem
        });
    } catch (error) {
        next(error);
    }
};
```

---

## 3. Concurrency-Safe Inventory Pattern

Never perform read-then-write stock updates in separate queries. Always use MongoDB atomic operators (`$inc` with `$gte`) to prevent overselling under high concurrency.

```javascript
import Inventory from '../models/Inventory.js';

export const deductStockSafely = async (productId, quantityToDeduct) => {
    const result = await Inventory.findOneAndUpdate(
        { 
            product: productId, 
            available_stock: { $gte: quantityToDeduct } 
        },
        { 
            $inc: { available_stock: -quantityToDeduct } 
        },
        { new: true }
    );

    if (!result) {
        throw new Error('Insufficient stock available.');
    }

    return result;
};
```

---

## 4. File Upload & Asset Cleanup Pattern

When handling uploads via `multer`:
1. Use `req.file` for single images, or `req.files` for multiple fields.
2. Store the relative web-accessible URL in the database (e.g., `/uploads/image.png`).
3. If replacing an existing image or deleting a record, unlink the old file from disk.

```javascript
import fs from 'fs';
import path from 'path';

export const deleteProductWithMedia = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Clean up primary image if stored locally
        if (product.image_url && product.image_url.startsWith('/uploads/')) {
            const diskPath = path.join(process.cwd(), product.image_url);
            if (fs.existsSync(diskPath)) {
                fs.unlinkSync(diskPath);
            }
        }

        await product.deleteOne();

        res.json({ message: 'Product and associated media deleted successfully.' });
    } catch (error) {
        next(error);
    }
};
```

---

## 5. Global Error Handling Pattern (`app.js`)

Centralized middleware format ensures consistent error shapes for all unexpected exceptions:

```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
```
