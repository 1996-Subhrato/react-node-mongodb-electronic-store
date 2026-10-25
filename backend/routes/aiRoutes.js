import express from 'express';
import * as AIController from '../controllers/aiController.js';
import { verifyUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// General AI Assistant (Public for engagement)
router.post('/ask-general', AIController.askGeneralAI);

// Product Specific AI (Public & logged in users)
router.post('/ask-product', AIController.askProductAI);

export default router;
