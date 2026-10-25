/**
 * TechZone — Production Mongoose Database Patterns
 * 
 * Demonstrates standardized, concurrency-safe query patterns,
 * atomic updates, and aggregation pipelines across the platform.
 */

import Inventory from '../backend/models/Inventory.js';
import Order from '../backend/models/Order.js';
import Product from '../backend/models/Product.js';
import Review from '../backend/models/Review.js';

// ============================================================================
// 1. ATOMIC INVENTORY DEDUCTION (Prevents Race Conditions & Overselling)
// ============================================================================
/**
 * Deducts stock atomically during order finalization.
 * The query condition `{ available_stock: { $gte: quantity } }` ensures
 * stock cannot drop below zero even with concurrent checkout requests.
 */
export const atomicDeductStock = async (productId, quantity) => {
    const updatedInventory = await Inventory.findOneAndUpdate(
        { 
            product: productId, 
            available_stock: { $gte: quantity } 
        },
        { 
            $inc: { available_stock: -quantity } 
        },
        { new: true }
    );

    if (!updatedInventory) {
        throw new Error(`Insufficient stock for product ID: ${productId}`);
    }

    return updatedInventory;
};

// ============================================================================
// 2. ATOMIC STOCK RESTORATION ON CANCELLATION
// ============================================================================
/**
 * Restores inventory when a pending order is cancelled.
 */
export const restoreOrderStock = async (orderItems) => {
    const restorePromises = orderItems.map(item => 
        Inventory.findOneAndUpdate(
            { product: item.product },
            { $inc: { available_stock: item.quantity } },
            { new: true }
        )
    );
    return await Promise.all(restorePromises);
};

// ============================================================================
// 3. VERIFIED PURCHASE VALIDATION PATTERN
// ============================================================================
/**
 * Confirms whether a customer is legally eligible to review a product.
 * Requires at least one order containing the product with payment_status 'Paid'.
 */
export const isUserEligibleForReview = async (userId, productId) => {
    const paidOrder = await Order.findOne({
        user: userId,
        payment_status: 'Paid',
        order_status: { $ne: 'Cancelled' },
        'items.product': productId
    });

    if (!paidOrder) return false;

    // Check if review already exists
    const existingReview = await Review.findOne({
        user: userId,
        product: productId
    });

    return !existingReview;
};

// ============================================================================
// 4. ADMIN DASHBOARD ANALYTICS AGGREGATION PIPELINE
// ============================================================================
/**
 * Computes high-level KPI metrics using MongoDB Aggregation Framework.
 */
export const getAdminAnalyticsPipeline = async () => {
    const [stats] = await Order.aggregate([
        {
            $facet: {
                totalRevenue: [
                    { $match: { payment_status: 'Paid' } },
                    { $group: { _id: null, total: { $sum: '$total_amount' } } }
                ],
                totalOrders: [
                    { $count: 'count' }
                ],
                ordersByStatus: [
                    { $group: { _id: '$order_status', count: { $sum: 1 } } }
                ]
            }
        }
    ]);

    const totalRevenue = stats.totalRevenue[0]?.total || 0;
    const totalOrders = stats.totalOrders[0]?.count || 0;

    return { totalRevenue, totalOrders, breakdown: stats.ordersByStatus };
};

// ============================================================================
// 5. CATALOG SEARCH, FILTER, AND PAGINATION PATTERN
// ============================================================================
/**
 * Dynamic catalog filtering with case-insensitive regex search and sorting.
 */
export const queryCatalogProducts = async ({ categoryId, searchKeyword, sortOrder, page = 1, limit = 12 }) => {
    const filter = {};

    if (categoryId) {
        filter.category = categoryId;
    }

    if (searchKeyword) {
        filter.name = { $regex: searchKeyword, $options: 'i' };
    }

    let sort = { createdAt: -1 };
    if (sortOrder === 'price_asc') sort = { price: 1 };
    if (sortOrder === 'price_desc') sort = { price: -1 };

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
        Product.find(filter)
            .populate('category', 'name')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        Product.countDocuments(filter)
    ]);

    return {
        products,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        }
    };
};
