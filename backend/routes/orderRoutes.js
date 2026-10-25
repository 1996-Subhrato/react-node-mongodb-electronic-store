import express from 'express';
import * as OrderController from '../controllers/orderController.js';
import { verifyUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyUserToken);

router.get('/my-orders', OrderController.getUserOrders);
router.get('/:id', OrderController.getOrderDetails);
router.post('/:id/cancel', OrderController.cancelOrder);

export default router;
