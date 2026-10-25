import express from 'express';
import * as AuthController from '../controllers/userAuthController.js';
import { verifyUserToken } from '../middleware/authMiddleware.js';
import { uploadProfile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// Protected Profile Routes
router.get('/profile', verifyUserToken, AuthController.getProfile);
router.put('/profile', verifyUserToken, uploadProfile.single('profile_image'), AuthController.updateProfile);
router.put('/change-password', verifyUserToken, AuthController.changePassword);

// Safe session check for frontend initial load
router.get('/session', AuthController.checkSession);

export default router;
