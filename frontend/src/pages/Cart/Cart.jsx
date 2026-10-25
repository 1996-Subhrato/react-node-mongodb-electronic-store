import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Cart.css';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BACKEND_URL}${url}`;
};

const Cart = () => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const data = await api.get('/cart');
            setCart(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setLoading(false);
        }
    };

    const updateQty = async (itemId, newQty) => {
        try {
            await api.put(`/cart/item/${itemId}`, { quantity: newQty });
            fetchCart();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error updating quantity';
            showToast(errorMsg, 'error');
            console.error('Error updating quantity:', err);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/item/${itemId}`);
            fetchCart();
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    if (loading) return <div className="cart-loading"><div className="loader"></div></div>;

    if (cart.items.length === 0) {
        return (
            <div className="container empty-cart-container animate-fade">
                <div className="empty-cart-card glass">
                    <ShoppingBag size={80} className="empty-icon" />
                    <h1>Your cart is empty</h1>
                    <p>Looks like you haven't added any products to your cart yet.</p>
                    <Link to="/" className="btn btn-primary shop-now-btn">
                        Start Shopping <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    const subtotal = parseFloat(cart.total);
    const shippingThreshold = 1000;
    const shippingCharge = subtotal >= shippingThreshold ? 0 : 50;
    const taxRate = 0.18;
    const taxAmount = subtotal * taxRate;
    const finalTotal = subtotal + shippingCharge + taxAmount;

    return (
        <div className="cart-page container animate-fade">
            <h1 className="cart-title">Your Shopping Cart</h1>
            
            <div className="cart-grid">
                {/* Cart Items List */}
                <div className="cart-items-section">
                    {cart.items.map(item => (
                        <div key={item.item_id} className="cart-item glass">
                            <div className="item-image">
                                <img src={getFullImageUrl(item.image_url)} alt={item.name} />
                            </div>
                            <div className="item-details">
                                <div className="item-header">
                                    <h3>{item.name}</h3>
                                    <button className="remove-btn" onClick={() => removeItem(item.item_id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="item-meta">
                                    <span className="unit-price">₹{item.price}</span>
                                    <span className="item-weight">{item.weight || 'Standard'}</span>
                                </div>
                                <div className="item-actions">
                                    <div className="qty-controls glass">
                                        <button onClick={() => updateQty(item.item_id, item.quantity - 1)}>
                                            <Minus size={16} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQty(item.item_id, item.quantity + 1)}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="item-subtotal">₹{item.subtotal}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary Summary */}
                <div className="cart-summary-section">
                    <div className="summary-card glass">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            {shippingCharge === 0 ? (
                                <span className="free-shipping">FREE</span>
                            ) : (
                                <span>₹{shippingCharge.toFixed(2)}</span>
                            )}
                        </div>
                        <div className="summary-row">
                            <span>Tax (GST 18%)</span>
                            <span>₹{taxAmount.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="summary-row total-row">
                            <span>Total Amount</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </button>
                        <div className="secure-badge">
                            <span>🔒 Secure Transaction Guaranteed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
