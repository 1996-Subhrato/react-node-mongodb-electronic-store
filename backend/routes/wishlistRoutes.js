import express from 'express';
import * as WishlistController from '../controllers/wishlistController.js';
import { verifyUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyUserToken);

router.get('/', WishlistController.getWishlist);
router.post('/add', WishlistController.addToWishlist);
router.delete('/:id', WishlistController.removeFromWishlist);

export default router;
