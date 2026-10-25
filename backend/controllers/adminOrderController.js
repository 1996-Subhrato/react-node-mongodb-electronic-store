import Order from '../models/Order.js';

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
            
        res.json(orders.map(o => ({
            id: o._id,
            user_id: o.user?._id,
            customer_name: o.user?.name || o.full_name,
            full_name: o.user?.name || o.full_name,
            email: o.user?.email || o.email,
            order_number: o.order_number,
            total_amount: o.total_amount,
            order_status: o.order_status,
            payment_status: o.payment_status,
            created_at: o.createdAt,
            phone: o.phone,
            address_line1: o.address_line1,
            address_line2: o.address_line2 || '',
            landmark: o.landmark || '',
            city: o.city,
            state: o.state,
            pincode: o.pincode
        })));
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { order_status } = req.body;

        const STATUS_RANKS = {
            'Pending': 1,
            'Processing': 2,
            'Shipped': 3,
            'Delivered': 4,
            'Cancelled': 5
        };

        if (!STATUS_RANKS[order_status]) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const currentStatus = order.order_status;
        const currentRank = STATUS_RANKS[currentStatus] || 0;
        const newRank = STATUS_RANKS[order_status];

        if (currentStatus === 'Delivered' || currentStatus === 'Cancelled') {
            return res.status(400).json({ message: `Cannot change status of a ${currentStatus} order` });
        }

        if (newRank <= currentRank && order_status !== currentStatus) {
            return res.status(400).json({ message: `Cannot move status back from ${currentStatus} to ${order_status}` });
        }

        order.order_status = order_status;
        await order.save();
        
        res.json({ message: `Order status updated to ${order_status}` });
    } catch (error) {
        next(error);
    }
};

export const getOrderItems = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('items.product', 'name image_url');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order.items.map(item => ({
            id: item._id, // This is a subdocument id, but frontend might just need the product details
            product_id: item.product?._id,
            name: item.product?.name,
            image_url: item.product?.image_url,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal
        })));
    } catch (error) {
        next(error);
    }
};

