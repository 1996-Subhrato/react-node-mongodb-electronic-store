import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';

export const getInventory = async (req, res, next) => {
    try {
        const inventory = await Inventory.find()
            .populate({
                path: 'product',
                populate: { path: 'category', select: 'name' }
            })
            .sort({ available_stock: 1 });

        res.json(inventory.map(i => ({
            id: i._id,
            product_id: i.product?._id,
            name: i.product?.name,
            image_url: i.product?.image_url,
            weight: i.product?.weight,
            category_name: i.product?.category?.name,
            available_stock: i.available_stock,
            reserved_stock: i.reserved_stock
        })));
    } catch (error) {
        next(error);
    }
};

export const updateStock = async (req, res, next) => {
    try {
        const { product_id: productId, available_stock } = req.body;
        
        await Inventory.findOneAndUpdate(
            { product: productId },
            { available_stock },
            { upsert: true }
        );
        
        // Also sync back to products model
        await Product.findByIdAndUpdate(productId, { stock_quantity: available_stock });

        res.json({ message: 'Stock updated successfully.' });
    } catch (error) {
        next(error);
    }
};

