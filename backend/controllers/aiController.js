import * as AIService from '../services/aiService.js';
import Product from '../models/Product.js';

export const askProductAI = async (req, res, next) => {
    try {
        const { productId, question } = req.body;

        if (!productId || !question) {
            return res.status(400).json({ message: 'Product ID and question are required.' });
        }

        // 1. Fetch Product with Category Context
        const product = await Product.findById(productId).populate('category', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const productData = {
            name: product.name,
            category_name: product.category?.name,
            description: product.description,
            health_benefits: product.health_benefits,
            nutrition_info: product.nutrition_info,
            recommended_intake: product.recommended_intake,
            ai_context_notes: product.ai_context_notes
        };

        // 2. Get contextual AI response
        const response = await AIService.getProductAIResponse(productData, question);

        res.json({
            productId,
            productName: product.name,
            answer: response
        });
    } catch (error) {
        next(error);
    }
};

export const askGeneralAI = async (req, res, next) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: 'A question is required.' });
        }

        // Fetch products for context
        const products = await Product.find().populate('category', 'name');

        const productContexts = products.map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            health_benefits: p.health_benefits,
            description: p.description,
            category_name: p.category?.name
        }));

        const response = await AIService.getGeneralAIResponse(question, productContexts);

        res.json({
            answer: response
        });
    } catch (error) {
        next(error);
    }
};

