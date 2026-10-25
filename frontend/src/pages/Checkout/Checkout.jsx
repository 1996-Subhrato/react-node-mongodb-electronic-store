import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import './Checkout.css';
import { ShieldCheck, Truck, CreditCard, ChevronRight, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Checkout = () => {
    const { user, fetchCartCount } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [summary, setSummary] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            pincode: '',
            landmark: ''
        }
    });

    // Patterns Alignment: Dynamic Script Injection
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchCheckoutData();
        loadRazorpay(); // Load SDK on mount
    }, [user]);

    const fetchCheckoutData = async () => {
        try {
            const data = await api.get('/checkout/summary');
            setSummary(data.summary);
            setUserInfo(data.user);
            setLoading(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Error loading checkout', 'error');
            navigate('/cart');
        }
    };

    const handlePayment = async (data) => {
        setProcessing(true);

        try {
            // 1. Ensure Razorpay is loaded
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                showToast('Razorpay SDK failed to load. Check your internet connection.', 'error');
                setProcessing(false);
                return;
            }

            // 2. Create Razorpay Order
            const orderData = await api.post('/payment/create-order');
            
            // Patterns Alignment: Use Client-Side Key ID
            const clientKey = import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key_id;

            const options = {
                key: clientKey,
                amount: orderData.amount,
                currency: "INR",
                name: "TechZone",
                description: "Electronics Purchase",
                // order_id: orderData.id, // Removed to bypass order creation requirement
                handler: async (response) => {
                    try {
                        // 3. Finalize payment & order on success (Include Signature)
                        const finalResponse = await api.post('/payment/test-success', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature, // Standard pattern
                            billingDetails: {
                                ...data,
                                full_name: userInfo.name,
                                email: userInfo.email,
                                phone: userInfo.phone
                            }
                        });
                        
                        await fetchCartCount(); // Clear local cart count
                        showToast('Payment Successful! Order Placed.', 'success');
                        navigate('/order-success', { state: { order: finalResponse } });
                    } catch (err) {
                        showToast(err.response?.data?.message || 'Error finalizing order', 'error');
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                    contact: userInfo.phone
                },
                theme: {
                    color: "#2563EB"
                },
                modal: {
                    ondismiss: function() {
                        setProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            showToast(err.response?.data?.message || 'Payment initiation failed', 'error');
            setProcessing(false);
        }
    };

    if (loading) return <div className="checkout-loading"><div className="loader"></div></div>;

    return (
        <div className="checkout-page container animate-fade">
            <div className="checkout-header">
                <h1>Secure Checkout</h1>
                <div className="checkout-steps">
                    <span>Cart</span> <ChevronRight size={16} />
                    <span className="active">Shipping & Payment</span> <ChevronRight size={16} />
                    <span>Confirmation</span>
                </div>
            </div>

            <div className="checkout-grid">
                {/* Form Section */}
                <div className="checkout-form-section">
                    <div className="form-card glass">
                        <h3><ShieldCheck size={20} /> Personal Information</h3>
                        <div className="form-grid readonly">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" value={userInfo.name} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" value={userInfo.email} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" value={userInfo.phone} readOnly />
                            </div>
                        </div>
                    </div>

                    <form id="checkout-form" onSubmit={handleSubmit(handlePayment)}>
                        <div className="form-card glass">
                            <h3><Truck size={20} /> Shipping Address</h3>
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Address Line 1 *</label>
                                    <input 
                                        type="text" 
                                        placeholder="House No / Street / Area"
                                        {...register('address_line1', { required: 'Address is required' })}
                                        className={errors.address_line1 ? 'input-error' : ''}
                                    />
                                    {errors.address_line1 && <span className="error-msg"><AlertCircle size={14} /> {errors.address_line1.message}</span>}
                                </div>
                                <div className="form-group full">
                                    <label>Address Line 2 (Optional)</label>
                                    <input 
                                        type="text" 
                                        placeholder="Apartment / Suite / Landmark"
                                        {...register('address_line2')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>City *</label>
                                    <input 
                                        type="text" 
                                        {...register('city', { required: 'City is required' })}
                                        className={errors.city ? 'input-error' : ''}
                                    />
                                    {errors.city && <span className="error-msg"><AlertCircle size={14} /> {errors.city.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>State *</label>
                                    <input 
                                        type="text" 
                                        {...register('state', { required: 'State is required' })}
                                        className={errors.state ? 'input-error' : ''}
                                    />
                                    {errors.state && <span className="error-msg"><AlertCircle size={14} /> {errors.state.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Pincode *</label>
                                    <input 
                                        type="text" 
                                        {...register('pincode', { 
                                            required: 'Pincode is required',
                                            pattern: { value: /^[0-9]{6}$/, message: 'Invalid Pincode (6 digits)' }
                                        })}
                                        className={errors.pincode ? 'input-error' : ''}
                                    />
                                    {errors.pincode && <span className="error-msg"><AlertCircle size={14} /> {errors.pincode.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Landmark (Optional)</label>
                                    <input 
                                        type="text" 
                                        {...register('landmark')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-card glass">
                            <h3><CreditCard size={20} /> Payment Method</h3>
                            <div className="payment-options">
                                <div className="payment-option active">
                                    <input type="radio" checked readOnly />
                                    <div className="option-info">
                                        <strong>Online Payment (Razorpay)</strong>
                                        <span>Credit/Debit Cards, UPI, Netbanking</span>
                                    </div>
                                    <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="payment-logo" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Summary Section */}
                <aside className="checkout-summary-section">
                    <div className="summary-card glass sticky-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-items">
                            {summary.items.map(item => (
                                <div key={item.item_id} className="summary-item">
                                    <div className="item-info">
                                        <span className="item-qty">{item.quantity}x</span>
                                        <span className="item-name">{item.name}</span>
                                    </div>
                                    <span className="item-total">₹{item.subtotal}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="summary-divider"></div>
                        
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{summary.subtotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            {parseFloat(summary.shipping) === 0 ? <span className="free">FREE</span> : <span>₹{summary.shipping}</span>}
                        </div>
                        <div className="summary-row">
                            <span>Tax (GST 18%)</span>
                            <span>₹{summary.tax}</span>
                        </div>
                        
                        <div className="summary-divider"></div>
                        
                        <div className="summary-row grand-total">
                            <span>Total Amount</span>
                            <span>₹{summary.total}</span>
                        </div>

                        <button 
                            className="btn btn-primary pay-btn" 
                            type="submit"
                            form="checkout-form"
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : `Pay ₹${summary.total}`}
                        </button>
                        
                        <p className="payment-disclaimer">
                            <Package size={14} /> By placing your order, you agree to our terms and conditions.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Checkout;
