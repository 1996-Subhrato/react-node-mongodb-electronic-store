import express from 'express';
import * as AdminProductController from '../controllers/adminProductController.js';
import * as AdminAuthController from '../controllers/adminAuthController.js';
import * as AdminDashboardController from '../controllers/adminDashboardController.js';
import * as AdminOrderController from '../controllers/adminOrderController.js';
import * as AdminUserController from '../controllers/adminUserController.js';
import * as InventoryController from '../controllers/inventoryController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Auth
router.post('/login', AdminAuthController.login);
router.post('/logout', AdminAuthController.logout);
router.get('/dashboard', verifyAdminToken, AdminAuthController.getDashboardInfo);
router.get('/session', AdminAuthController.checkSession);

// Dashboard Stats
router.get('/stats', verifyAdminToken, AdminDashboardController.getDashboardStats);

// Product Management (Protected)
import upload from '../config/multer.js';
router.get('/products', verifyAdminToken, AdminProductController.getAdminProducts);
router.post('/products', verifyAdminToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'additional_images', maxCount: 4 }]), AdminProductController.addProduct);
router.put('/products/:id', verifyAdminToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'additional_images', maxCount: 4 }]), AdminProductController.editProduct);
router.delete('/products/:id', verifyAdminToken, AdminProductController.removeProduct);

// Category Management (Protected)
import * as AdminCategoryController from '../controllers/adminCategoryController.js';
import { uploadCategory } from '../middleware/uploadMiddleware.js';

router.get('/categories', verifyAdminToken, AdminCategoryController.getAdminCategories);
router.post('/categories', verifyAdminToken, uploadCategory.single('image'), AdminCategoryController.createAdminCategory);
router.put('/categories/:id', verifyAdminToken, uploadCategory.single('image'), AdminCategoryController.updateAdminCategory);
router.delete('/categories/:id', verifyAdminToken, AdminCategoryController.deleteAdminCategory);

// Order Management
router.get('/orders', verifyAdminToken, AdminOrderController.getAllOrders);
router.get('/orders/:id/items', verifyAdminToken, AdminOrderController.getOrderItems);
router.put('/orders/:id/status', verifyAdminToken, AdminOrderController.updateOrderStatus);

// User Management
router.get('/users', verifyAdminToken, AdminUserController.getAllUsers);
router.get('/users/:id/orders', verifyAdminToken, AdminUserController.getUserOrderHistory);

// Inventory Management
router.get('/inventory', verifyAdminToken, InventoryController.getInventory);
router.put('/inventory/:productId', verifyAdminToken, InventoryController.updateStock);

export default router;
