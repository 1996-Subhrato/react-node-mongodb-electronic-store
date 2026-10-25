import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import Review from '../models/Review.js';


export const getOrderDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ _id: id, user: req.user.id })
            .populate('items.product', 'name image_url');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json({
            id: order._id,
            order_number: order.order_number,
            total_amount: order.total_amount,
            order_status: order.order_status,
            payment_status: order.payment_status,
            created_at: order.createdAt,
            items: order.items.map(item => ({
                product_id: item.product?._id,
                name: item.product?.name,
                image_url: item.product?.image_url,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal
            }))
        });
    } catch (error) {
        next(error);
    }
};

export const getUserOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .populate('items.product', 'name image_url')
            .sort({ createdAt: -1 });

        // For each order item, check if a review exists
        const reviews = await Review.find({ user: userId });

        const ordersWithReviewCheck = orders.map(order => {
            const items = order.items.map(item => {
                const review = reviews.find(r => r.product.toString() === item.product?._id.toString());
                return {
                    order_id: order._id,
                    product_id: item.product?._id,
                    name: item.product?.name,
                    image_url: item.product?.image_url,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    subtotal: item.subtotal,
                    review_id: review?._id,
                    review_rating: review?.rating,
                    review_text: review?.review_text
                };
            });

            return {
                id: order._id,
                order_number: order.order_number,
                total_amount: order.total_amount,
                order_status: order.order_status,
                payment_status: order.payment_status,
                created_at: order.createdAt,
                items
            };
        });

        res.json(ordersWithReviewCheck);
    } catch (error) {
        next(error);
    }
};

export const cancelOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ _id: id, user: userId }).populate('items.product');
        if (!order) {
            return res.status(400).json({ message: 'Order not found or access denied.' });
        }

        if (order.order_status !== 'Pending') {
            return res.status(400).json({ message: `Order cannot be cancelled. Current status: ${order.order_status}` });
        }

        order.order_status = 'Cancelled';
        await order.save();

        // Restore Inventory
        for (const item of order.items) {
            const product = item.product;
            if (product) {
                const totalRestoration = item.quantity;

                await Inventory.findOneAndUpdate(
                    { product: product._id },
                    { $inc: { available_stock: totalRestoration } }
                );
            }
        }

        res.json({ message: 'Order cancelled successfully and stock restored.' });
    } catch (error) {
        next(error);
    }
};

