import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import Payment from '../models/Payment.js';

dotenv.config({ override: true });


/**
 * Initialize Razorpay ONLY if keys are present.
 */
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

/**
 * Create a Razorpay Order for Phase 9 (Test Mode).
 */
export const createRazorpayOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const subtotal = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
        const shippingCharge = subtotal >= 1000 ? 0 : 50;
        const taxAmount = subtotal * 0.18;
        const finalTotal = subtotal + shippingCharge + taxAmount;

        const options = {
            amount: Math.round(finalTotal * 100), // convert to paise
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
            id: `ord_mock_${Date.now()}`, 
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key'
        };

        res.json({
            ...options,
            isMock: true
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Finalize Order after Test Payment Success.
 */
export const handleTestSuccess = async (req, res, next) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            billingDetails 
        } = req.body;

        const userId = req.user.id;

        // 1. Signature Verification
        if (razorpay && razorpay_signature) {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return res.status(400).json({ message: 'Payment verification failed: Invalid signature.' });
            }
        }

        // 2. Fetch Cart and Calculate Totals
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            unit_price: item.product.price,
            subtotal: item.product.price * item.quantity,
            // Temporary storage for inventory deduction
            weight: item.product.weight,
            name: item.product.name
        }));

        const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
        const shippingCharge = subtotal >= 1000 ? 0 : 50;
        const taxAmount = subtotal * 0.18;
        const finalTotal = subtotal + shippingCharge + taxAmount;

        const orderNumber = `RYZ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // 3. Update Inventory
        for (const item of orderItems) {
            const totalDeduction = item.quantity;

            const inventory = await Inventory.findOneAndUpdate(
                { product: item.product, available_stock: { $gte: totalDeduction } },
                { $inc: { available_stock: -totalDeduction } },
                { new: true }
            );

            if (!inventory) {
                throw new Error(`Insufficient stock for "${item.name}".`);
            }
        }

        // 4. Create Order
        const order = await Order.create({
            user: userId,
            order_number: orderNumber,
            full_name: billingDetails?.full_name || billingDetails?.fullName || req.user.name || 'Valued Customer',
            email: billingDetails?.email || req.user.email,
            phone: billingDetails?.phone || '9999999999',
            address_line1: billingDetails?.address_line1 || billingDetails?.addressLine1 || 'Default Address',
            address_line2: billingDetails?.address_line2 || billingDetails?.addressLine2 || '',
            city: billingDetails?.city || 'City',
            state: billingDetails?.state || 'State',
            pincode: billingDetails?.pincode || '000000',
            landmark: billingDetails?.landmark || '',
            total_amount: finalTotal,
            payment_status: 'Paid',
            razorpay_order_id,
            razorpay_payment_id,
            items: orderItems.map(({ product, quantity, unit_price, subtotal }) => ({
                product, quantity, unit_price, subtotal
            }))
        });

        const orderId = order._id;

        // 5. Create Payment Record
        await Payment.create({
            order: orderId,
            razorpay_order_id: razorpay_order_id || 'mock_order_no_id',
            razorpay_payment_id: razorpay_payment_id || 'mock_payment_id',
            payment_status: 'Paid',
            amount: finalTotal
        });

        // 6. Clear Cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ 
            message: 'Order placed successfully!', 
            orderId,
            orderNumber 
        });
    } catch (error) {
        next(error);
    }
};

