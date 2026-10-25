import express from 'express';
import { createRazorpayOrder, handleTestSuccess } from '../controllers/paymentController.js';
import { verifyUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', verifyUserToken, createRazorpayOrder);
router.post('/test-success', verifyUserToken, handleTestSuccess);

export default router;
