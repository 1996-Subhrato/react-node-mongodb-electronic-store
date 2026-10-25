import React, { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Printer, Download, Package, CreditCard, MapPin } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const { showToast } = useToast();
    const orderData = location.state?.order;

    const [fullOrder, setFullOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderData?.id) {
            fetchOrderDetails();
        } else {
            setLoading(false);
        }
    }, [orderData]);

    const fetchOrderDetails = async () => {
        try {
            const data = await api.get(`/orders/${orderData.id}`);
            setFullOrder(data);
        } catch (err) {
            showToast('Failed to load full order details', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!orderData) {
        return <Navigate to="/" />;
    }

    return (
        <div className="order-success-page container animate-fade">
            <div className="success-content glass">
                <div className="success-icon-wrapper">
                    <CheckCircle size={80} className="success-icon" />
                </div>

                <h1>Thank You for Your Order!</h1>
                <p className="order-tagline">Your order is being prepared and will be shipped soon. You'll receive a tracking update via email.</p>

                <div className="order-main-summary">
                    <div className="order-info-card">
                        <div className="info-row">
                            <span>Order Number</span>
                            <strong>#{orderData.orderNumber}</strong>
                        </div>
                        <div className="info-row">
                            <span>Status</span>
                            <span className={`status-badge-dynamic ${(fullOrder?.order_status || 'Pending').toLowerCase()}`}>
                                {fullOrder?.order_status || 'Pending'}
                            </span>
                        </div>
                    </div>

                    {fullOrder?.order_status === 'Cancelled' && (
                        <div className="cancelled-message glass animate-fade">
                            <h3>Order Cancelled</h3>
                            <p>This order has been cancelled. If you have any questions, please contact support.</p>
                        </div>
                    )}

                    {fullOrder && (
                        <div className="order-details-section animate-slide-up">
                            <h3>Items in your Order</h3>
                            <div className="success-items-list">
                                {fullOrder.items.map(item => (
                                    <div key={item.id} className="success-item-row">
                                        <div className="item-img-wrapper">
                                            <img src={`http://localhost:5000${item.image_url}`} alt={item.name} />
                                        </div>
                                        <div className="item-info">
                                            <h4>{item.name}</h4>
                                            <span>Qty: {item.quantity}</span>
                                        </div>
                                        <div className="item-price">
                                            ₹{item.subtotal}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-financial-breakdown">
                                <div className="breakdown-row">
                                    <span>Subtotal</span>
                                    <span>₹{(fullOrder.total_amount / 1.23).toFixed(2)}</span>
                                </div>
                                <div className="breakdown-row">
                                    <span>Tax (GST 18%) + Shipping</span>
                                    <span>₹{(fullOrder.total_amount - (fullOrder.total_amount / 1.23)).toFixed(2)}</span>
                                </div>
                                <div className="breakdown-row total">
                                    <span>Total Paid</span>
                                    <span>₹{fullOrder.total_amount}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="success-actions">
                    {/* <Link to="/profile" className="btn btn-secondary">
                        <ShoppingBag size={20} /> View Order History
                    </Link> */}
                    <Link to="/products" className="btn btn-primary">
                        Continue Shopping <ArrowRight size={20} />
                    </Link>
                </div>

                {/* <div className="success-footer">
                    <button className="text-btn" onClick={() => window.print()}>
                        <Printer size={16} /> Print Receipt
                    </button>
                    <div className="divider"></div>
                    <button className="text-btn">
                        <Download size={16} /> Download Invoice
                    </button>
                </div> */}
            </div>

            {fullOrder?.order_status !== 'Cancelled' && (
                <div className="delivery-infographic animate-slide-up">
                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map((level, index, arr) => {
                        const levels = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                        const currentStatus = fullOrder?.order_status || 'Pending';
                        const currentIdx = levels.indexOf(currentStatus);
                        const isCompleted = index <= currentIdx;
                        
                        return (
                            <React.Fragment key={level}>
                                <div className="info-step">
                                    <div className={`dot ${isCompleted ? 'active' : ''}`}></div>
                                    <span className={isCompleted ? 'active-text' : ''}>{level}</span>
                                </div>
                                {index < arr.length - 1 && (
                                    <div className={`line ${index < currentIdx ? 'active' : ''}`}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderSuccess;
