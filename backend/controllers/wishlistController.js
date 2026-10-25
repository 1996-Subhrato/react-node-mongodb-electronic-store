import Wishlist from '../models/Wishlist.js';
import Inventory from '../models/Inventory.js';

export const getWishlist = async (req, res, next) => {
    try {
        const wishlistItems = await Wishlist.find({ user: req.user.id })
            .populate({
                path: 'product',
                populate: { path: 'category', select: 'name' }
            });

        const productIds = wishlistItems.map(item => item.product?._id);
        const inventories = await Inventory.find({ product: { $in: productIds } });

        res.json(wishlistItems.map(item => {
            const product = item.product;
            const inventory = inventories.find(i => i.product.toString() === product?._id.toString());
            return {
                id: item._id, // This is the wishlist item ID
                product_id: product?._id,
                name: product?.name,
                price: product?.price,
                image_url: product?.image_url,
                category_name: product?.category?.name,
                available_stock: inventory ? inventory.available_stock : 0,
                weight: product?.weight,
                description: product?.description
            };
        }));
    } catch (error) {
        next(error);
    }
};

export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        await Wishlist.findOneAndUpdate(
            { user: req.user.id, product: productId },
            { user: req.user.id, product: productId },
            { upsert: true, new: true }
        );
        res.status(201).json({ message: 'Product added to wishlist' });
    } catch (error) {
        next(error);
    }
};

export const removeFromWishlist = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Wishlist.findOneAndDelete({ _id: id, user: req.user.id });
        res.json({ message: 'Product removed from wishlist' });
    } catch (error) {
        next(error);
    }
};

