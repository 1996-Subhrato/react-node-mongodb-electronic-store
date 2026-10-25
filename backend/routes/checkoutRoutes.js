import express from 'express';
import { getCheckoutSummary } from '../controllers/checkoutController.js';
import { verifyUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', verifyUserToken, getCheckoutSummary);

export default router;
