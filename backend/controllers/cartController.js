import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';

export const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        const items = cart.items.map(item => ({
            item_id: item._id,
            product_id: item.product?._id,
            name: item.product?.name,
            price: item.product?.price,
            weight: item.product?.weight,
            image_url: item.product?.image_url,
            quantity: item.quantity,
            subtotal: (item.product?.price || 0) * item.quantity
        }));

        const total = items.reduce((sum, item) => sum + item.subtotal, 0);

        res.json({ items, total });
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required.' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            return res.status(400).json({ message: 'Product is already in your cart!' });
        }

        cart.items.push({ product: productId, quantity: quantity || 1 });
        await cart.save();

        res.status(201).json({ message: 'Product added to cart!' });
    } catch (error) {
        next(error);
    }
};

export const updateQuantity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        
        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'Invalid Item ID' });
        }

        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item._id && item._id.toString() === id);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

        if (quantity < 1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();
            return res.json({ message: 'Item removed from cart.' });
        }

        // Stock Validation
        const item = cart.items[itemIndex];
        const product = item.product;
        const inventory = await Inventory.findOne({ product: product._id });
        if (inventory && quantity > inventory.available_stock) {
            return res.status(400).json({ 
                message: `Only ${inventory.available_stock} units available for "${product.name}".` 
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        
        res.json({ message: 'Quantity updated.' });
    } catch (error) {
        next(error);
    }
};

export const removeFromCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'Invalid Item ID' });
        }

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item._id && item._id.toString() !== id);
        await cart.save();

        res.json({ message: 'Item removed from cart.' });
    } catch (error) {
        next(error);
    }
};

