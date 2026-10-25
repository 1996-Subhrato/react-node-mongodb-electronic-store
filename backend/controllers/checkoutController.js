import User from '../models/User.js';
import Cart from '../models/Cart.js';

/**
 * Fetches user profile for prefilling and cart totals for summary.
 */
export const getCheckoutSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // 1. Fetch User Data for prefill
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // 2. Fetch Cart Details for summary
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }
        
        const items = cart.items.map(item => ({
            product_id: item.product?._id,
            name: item.product?.name,
            price: item.product?.price,
            quantity: item.quantity,
            subtotal: (item.product?.price || 0) * item.quantity
        }));

        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const shippingCharge = subtotal >= 1000 ? 0 : 50;
        const taxAmount = subtotal * 0.18;
        const finalTotal = subtotal + shippingCharge + taxAmount;

        res.json({
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone || ''
            },
            summary: {
                items,
                subtotal: subtotal.toFixed(2),
                shipping: shippingCharge.toFixed(2),
                tax: taxAmount.toFixed(2),
                total: finalTotal.toFixed(2)
            }
        });
    } catch (error) {
        next(error);
    }
};

