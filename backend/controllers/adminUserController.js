import User from '../models/User.js';
import Order from '../models/Order.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            created_at: u.createdAt
        })));
    } catch (error) {
        next(error);
    }
};

export const getUserOrderHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
        res.json(orders.map(o => ({
            id: o._id,
            total_amount: o.total_amount,
            order_status: o.order_status,
            payment_status: o.payment_status,
            created_at: o.createdAt
        })));
    } catch (error) {
        next(error);
    }
};

