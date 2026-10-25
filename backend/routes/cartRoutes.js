import express from 'express';
import * as CartController from '../controllers/cartController.js';
import { verifyUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes require a logged-in User
router.use(verifyUserToken);

router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.put('/item/:id', CartController.updateQuantity);
router.delete('/item/:id', CartController.removeFromCart);

export default router;
