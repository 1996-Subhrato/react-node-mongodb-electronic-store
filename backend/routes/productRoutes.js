import express from 'express';
import * as ProductController from '../controllers/productController.js';

const router = express.Router();

router.get('/', ProductController.getProducts);
router.get('/categories', ProductController.getAllCategories);
router.get('/:id', ProductController.getProductDetail);
router.get('/:id/related', ProductController.getRelatedProducts);

export default router;
