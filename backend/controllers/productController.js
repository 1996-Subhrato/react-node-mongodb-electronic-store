import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProducts = async (req, res, next) => {
    try {
        const { category, search, sort } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort(sortOption);

        res.json(products.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            stock_quantity: p.stock_quantity,
            weight: p.weight,
            image_url: p.image_url,
            category_id: p.category?._id,
            category_name: p.category?.name,
            health_benefits: p.health_benefits,
            nutrition_info: p.nutrition_info,
            recommended_intake: p.recommended_intake,
            ai_context_notes: p.ai_context_notes
        })));
    } catch (error) {
        next(error);
    }
};

export const getProductDetail = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock_quantity: product.stock_quantity,
            weight: product.weight,
            image_url: product.image_url,
            category_id: product.category?._id,
            category_name: product.category?.name,
            health_benefits: product.health_benefits,
            nutrition_info: product.nutrition_info,
            recommended_intake: product.recommended_intake,
            ai_context_notes: product.ai_context_notes,
            images: product.images
        });
    } catch (error) {
        next(error);
    }
};

export const getRelatedProducts = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const related = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(4);

        res.json(related.map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            image_url: p.image_url
        })));
    } catch (error) {
        next(error);
    }
};

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.json(categories.map(c => ({
            id: c._id,
            name: c.name,
            description: c.description,
            image_url: c.image_url
        })));
    } catch (error) {
        next(error);
    }
};

