import express from 'express';
import * as RecentlyViewedController from '../controllers/recentlyViewedController.js';
import { verifyUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyUserToken);

router.get('/', RecentlyViewedController.getRecentlyViewed);
router.post('/track', RecentlyViewedController.trackView);

export default router;
