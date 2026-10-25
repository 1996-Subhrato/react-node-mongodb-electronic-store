import RecentlyViewed from '../models/RecentlyViewed.js';
import Inventory from '../models/Inventory.js';

export const trackView = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user_id = req.user.id;

        // Upsert logic: Update timestamp if exists, else create
        await RecentlyViewed.findOneAndUpdate(
            { user: user_id, product: productId },
            { user: user_id, product: productId, viewedAt: new Date() },
            { upsert: true, new: true }
        );
        
        res.status(200).json({ message: 'Product view tracked' });
    } catch (error) {
        next(error);
    }
};

export const getRecentlyViewed = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const views = await RecentlyViewed.find({ user: userId })
            .populate({
                path: 'product',
                populate: { path: 'category', select: 'name' }
            })
            .sort({ viewedAt: -1 })
            .limit(5);

        const productIds = views.map(v => v.product?._id);
        const inventories = await Inventory.find({ product: { $in: productIds } });

        res.json(views.map(v => {
            const product = v.product;
            const inventory = inventories.find(i => i.product.toString() === product?._id.toString());
            return {
                viewed_at: v.viewedAt,
                id: product?._id,
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

