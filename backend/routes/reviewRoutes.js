import express from 'express';
import * as ReviewController from '../controllers/reviewController.js';
import { verifyUserToken, verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:productId', ReviewController.getProductReviews);
router.get('/check/:productId', verifyUserToken, ReviewController.checkReviewEligibility);
router.post('/', verifyUserToken, ReviewController.addReview);
router.put('/:id', verifyUserToken, ReviewController.updateReview);
router.delete('/:id', verifyAdminToken, ReviewController.deleteReview); // Moderation

export default router;
