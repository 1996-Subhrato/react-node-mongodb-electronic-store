import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Inventory from '../models/Inventory.js';

/**
 * Fetch high-level statistics for the Admin Dashboard Home.
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        // 1. Total Orders
        const totalOrders = await Order.countDocuments();

        // 2. Revenue (Calculated from paid orders)
        const revenueResult = await Order.aggregate([
            { $match: { payment_status: { $in: ['Paid', 'paid', 'completed', 'success'] } } },
            { $group: { _id: null, total_revenue: { $sum: "$total_amount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total_revenue : 0;

        // 3. Best Selling Products (by quantity sold)
        const bestSellersResult = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { 
                _id: "$items.product", 
                units_sold: { $sum: "$items.quantity" } 
            }},
            { $sort: { units_sold: -1 } },
            { $limit: 5 },
            { $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productInfo'
            }},
            { $unwind: "$productInfo" },
            { $project: {
                id: "$_id",
                name: "$productInfo.name",
                image_url: "$productInfo.image_url",
                units_sold: 1
            }}
        ]);

        // 4. Low Stock Alerts (threshold < 10)
        const lowStockItems = await Inventory.find({ available_stock: { $lt: 10 } })
            .populate('product', 'name')
            .sort({ available_stock: 1 });

        const formattedLowStockItems = lowStockItems.map(i => ({
            id: i.product?._id,
            name: i.product?.name,
            available_stock: i.available_stock
        }));

        // 5. Total Products and Categories
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();

        res.json({
            stats: {
                totalOrders,
                totalRevenue: parseFloat(totalRevenue).toFixed(2),
                lowStockCount: formattedLowStockItems.length,
                totalProducts,
                totalCategories
            },
            bestSellers: bestSellersResult,
            lowStockItems: formattedLowStockItems
        });
    } catch (error) {
        next(error);
    }
};

