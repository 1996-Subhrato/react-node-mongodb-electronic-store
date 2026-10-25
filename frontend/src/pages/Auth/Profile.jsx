import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import ConfirmationModal from '../../components/UI/ConfirmationModal';
import { 
    User, 
    Package, 
    MapPin, 
    Heart, 
    Shield, 
    LogOut, 
    Camera, 
    Mail, 
    Phone, 
    Calendar,
    ChevronRight,
    Edit3,
    CheckCircle,
    ShoppingBag,
    History,
    AlertCircle,
    Star,
    MessageSquare
} from 'lucide-react';
import ReviewModal from '../../components/UI/ReviewModal';
import './Profile.css';

const Profile = () => {
    const { user, updateUserAccount, logoutUser } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('account');
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [existingReview, setExistingReview] = useState(null);

    const { 
        register, 
        handleSubmit, 
        watch, 
        reset, 
        formState: { errors } 
    } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const newPassword = watch('newPassword');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || ''
            });
            if (user.profile_image) {
                setPreview(`http://localhost:5000${user.profile_image}`);
            } else {
                setPreview(null);
            }
        }
    }, [user]);

    // Fetch orders whenever orders tab is selected
    useEffect(() => {
        if (activeTab === 'orders') {
            fetchUserOrders();
        }
    }, [activeTab]);

    const fetchUserOrders = async () => {
        setOrdersLoading(true);
        try {
            const data = await api.get('/orders/my-orders');
            setOrders(data);
        } catch (err) {
            showToast('Failed to load order history', 'error');
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleCancelClick = (orderId) => {
        setCancellingOrderId(orderId);
        setShowCancelModal(true);
    };

    const handleReviewClick = (product, reviewData = null) => {
        setSelectedProduct(product);
        setExistingReview(reviewData);
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmit = async (data) => {
        setLoading(true);
        try {
            if (data.isUpdate) {
                await api.put(`/reviews/${data.review_id}`, {
                    rating: data.rating,
                    review_text: data.review_text
                });
                showToast('Review updated successfully!', 'success');
            } else {
                await api.post('/reviews', {
                    product_id: data.product_id,
                    rating: data.rating,
                    review_text: data.review_text
                });
                showToast('Review submitted! Thank you for your feedback.', 'success');
            }
            fetchUserOrders(); // Refresh to update review status
            setIsReviewModalOpen(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to submit review', 'error');
        } finally {
            setLoading(false);
        }
    };

    const confirmCancelOrder = async () => {
        if (!cancellingOrderId) return;
        setLoading(true);
        try {
            await api.post(`/orders/${cancellingOrderId}/cancel`);
            showToast('Order cancelled successfully', 'success');
            setOrders(prevOrders => 
                prevOrders.map(o => o.id === cancellingOrderId ? { ...o, order_status: 'Cancelled' } : o)
            );
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
        } finally {
            setLoading(false);
            setShowCancelModal(false);
            setCancellingOrderId(null);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('phone', formData.phone);
        if (image) {
            data.append('profile_image', image);
        }

        try {
            await updateUserAccount(data);
            showToast('Profile updated successfully!', 'success');
            setLoading(false);
            setImage(null);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update profile', 'error');
            setLoading(false);
        }
    };

    const onPasswordSubmit = async (data) => {
        setLoading(true);
        try {
            await api.put('/auth/change-password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            showToast('Password changed successfully!', 'success');
            reset();
            setLoading(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to change password', 'error');
            setLoading(false);
        }
    };

    const renderAccountTab = () => (
        <div className="tab-pane animate-fade">
            <div className="pane-header">
                <h3>Personal Information</h3>
                <p>Update your details and how we can reach you</p>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="profile-form-premium">
                <div className="avatar-upload-premium">
                    <div className="avatar-wrapper">
                        {preview ? (
                            <img src={preview} alt="Profile" className="profile-img-large" />
                        ) : (
                            <div className="profile-placeholder-large">
                                <User size={60} />
                            </div>
                        )}
                        <label htmlFor="avatar-input" className="camera-badge">
                            <Camera size={18} />
                            <input 
                                type="file" 
                                id="avatar-input" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                hidden 
                            />
                        </label>
                    </div>
                    <div className="upload-info">
                        <h4>Profile Picture</h4>
                        <p>PNG, JPG or WebP (Max 5MB)</p>
                    </div>
                </div>

                <div className="form-sections-grid">
                    <div className="input-group-premium">
                        <label><User size={16} /> Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            placeholder="Your Name"
                            required 
                        />
                    </div>
                    <div className="input-group-premium">
                        <label><Mail size={16} /> Email Address</label>
                        <input 
                            type="email" 
                            value={user?.email || ''} 
                            className="readonly-field" 
                            readOnly 
                        />
                        <span className="field-hint">Email cannot be changed</span>
                    </div>
                    <div className="input-group-premium">
                        <label><Phone size={16} /> Phone Number</label>
                        <input 
                            type="text" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            placeholder="Your Phone Number"
                            required 
                        />
                    </div>
                </div>

                <button type="submit" className="save-btn-premium" disabled={loading}>
                    {loading ? 'Processing...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );

    const renderOrdersTab = () => (
        <div className="tab-pane animate-fade">
            <div className="pane-header">
                <h3>Order History</h3>
                <p>View and track your recent premium purchases</p>
            </div>
            
            {ordersLoading ? (
                <div className="orders-loader"><div className="loader"></div></div>
            ) : orders.length > 0 ? (
                <div className="order-history-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card-premium glass">
                            <div className="order-card-header">
                                <div className="order-main-info">
                                    <span className="order-id">#{order.order_number}</span>
                                    <span className="order-date">
                                        <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={`status-badge ${order.payment_status.toLowerCase()}`}>
                                    {order.payment_status}
                                </div>
                            </div>
                            
                            <div className="order-card-body-wrapper">
                                {/* Order Status Bar */}
                                <div className="order-status-summary">
                                    <div className="order-stat">
                                        <span>Total Price</span>
                                        <strong>₹{order.total_amount}</strong>
                                    </div>
                                    <div className="order-stat">
                                        <span>Tracking Status</span>
                                        <strong className="tracking-status"><Package size={14} /> {order.order_status}</strong>
                                    </div>
                                </div>

                                {/* Product Items List */}
                                <div className="order-items-list-premium">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="order-item-row">
                                            <div className="item-main">
                                                <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="item-img-mini" />
                                                <div className="item-info">
                                                    <h5>{item.name}</h5>
                                                    <p>Qty: {item.quantity} × ₹{item.unit_price}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Review Action Section */}
                                            {order.order_status === 'Delivered' && (
                                                <div className="item-review-action">
                                                    {item.review_id ? (
                                                        <button 
                                                            className="review-btn edit"
                                                            onClick={() => handleReviewClick(item, {
                                                                review_id: item.review_id,
                                                                rating: item.review_rating,
                                                                review_text: item.review_text
                                                            })}
                                                        >
                                                            <Edit3 size={14} /> Edit Review
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="review-btn write"
                                                            onClick={() => handleReviewClick(item)}
                                                        >
                                                            <Star size={14} /> Write Review
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="order-actions-premium">
                                    <Link to={`/order-success`} state={{ order: { id: order.id, orderNumber: order.order_number } }} className="view-order-btn-premium">
                                        View Invoice <ChevronRight size={16} />
                                    </Link>
                                    {order.order_status === 'Pending' && (
                                        <button 
                                            className="cancel-order-btn-premium"
                                            onClick={() => handleCancelClick(order.id)}
                                            disabled={loading}
                                        >
                                            <AlertCircle size={14} /> Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state-premium">
                    <Package size={48} />
                    <h4>No orders yet</h4>
                    <p>When you buy items, they will appear here!</p>
                    <Link to="/products" className="shop-now-btn">Start Shopping</Link>
                </div>
            )}
        </div>
    );

    const renderSecurityTab = () => (
        <div className="tab-pane animate-fade">
            <div className="pane-header">
                <h3>Security Settings</h3>
                <p>Manage your password and account security</p>
            </div>
            
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="security-form-premium">
                <div className="input-group-premium">
                    <label>Current Password</label>
                    <input 
                        type="password" 
                        {...register('currentPassword', { required: 'Current password is required' })}
                        placeholder="••••••••"
                    />
                    {errors.currentPassword && <span className="error-text">{errors.currentPassword.message}</span>}
                </div>
                <div className="form-sections-grid">
                    <div className="input-group-premium">
                        <label>New Password</label>
                        <input 
                            type="password" 
                            {...register('newPassword', { 
                                required: 'New password is required',
                                minLength: { value: 6, message: 'Minimum 6 characters' }
                            })}
                            placeholder="••••••••"
                        />
                        {errors.newPassword && <span className="error-text">{errors.newPassword.message}</span>}
                    </div>
                    <div className="input-group-premium">
                        <label>Confirm New Password</label>
                        <input 
                            type="password" 
                            {...register('confirmPassword', { 
                                required: 'Please confirm your password',
                                validate: value => value === newPassword || 'Passwords do not match'
                            })}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
                    </div>
                </div>
                <button type="submit" className="save-btn-premium secondary-btn" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );

    const menuItems = [
        { id: 'account', label: 'My Account', icon: <User size={20} /> },
        { id: 'orders', label: 'Order History', icon: <Package size={20} /> },
        { id: 'security', label: 'Security', icon: <Shield size={20} /> },
    ];

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        showToast('Logging out... See you soon!', 'success');
        setShowLogoutModal(false);
        setTimeout(() => {
            logoutUser();
        }, 800);
    };

    const handleCloseModal = () => {
        setShowLogoutModal(false);
    };

    if (!user) return <div className="loading-screen">Loading your profile...</div>;

    return (
        <div className="dashboard-container">
            {/* Background Decorations */}
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>

            <div className="dashboard-wrapper container">
                {/* Sidebar */}
                <aside className="dashboard-sidebar glass">
                    <div className="user-brief">
                        <div className="user-avatar-mini">
                            {preview ? <img src={preview} alt="User" /> : <User size={24} />}
                        </div>
                        <div className="user-info-mini">
                            <h3>{user.name}</h3>
                            <span>Customer Since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}</span>
                        </div>
                    </div>

                    <nav className="dashboard-menu">
                        {menuItems.map(item => (
                            <button 
                                key={item.id}
                                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                <ChevronRight size={16} className="arrow" />
                            </button>
                        ))}
                        <button className="menu-item logout" onClick={handleLogoutClick}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="dashboard-main glass">
                    {activeTab === 'account' && renderAccountTab()}
                    {activeTab === 'orders' && renderOrdersTab()}
                    {activeTab === 'security' && renderSecurityTab()}
                </main>
            </div>

            <ConfirmationModal 
                isOpen={showLogoutModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to end your premium shopping session?"
                confirmText="Yes, Logout"
            />

            <ConfirmationModal 
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={confirmCancelOrder}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This action will restore items to our inventory and cannot be undone."
                confirmText="Yes, Cancel Order"
                confirmColor="#ef4444"
            />

            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                product={selectedProduct}
                existingReview={existingReview}
            />
        </div>
    );
};

export default Profile;
