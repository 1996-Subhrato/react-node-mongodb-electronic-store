import express from 'express';
import * as InventoryController from '../controllers/inventoryController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only inventory management
router.use(verifyAdminToken);

router.get('/', InventoryController.getInventory);
router.put('/update', InventoryController.updateStock);

export default router;
