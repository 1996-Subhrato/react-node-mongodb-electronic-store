import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './OrderManagement.css';
import {
    CheckCircle, Truck, Clock, X, Package, Search, User, Mail,
    Phone, MapPin, Calendar, FileText, Check, ShoppingBag,
    ArrowRight, Zap, RefreshCw, ChevronDown, Filter, TrendingUp,
    Star, DollarSign, BarChart2, Eye,
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BACKEND_URL}${url}`;
};

const STATUS_CONFIG = {
    Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', glow: '0 0 20px rgba(245,158,11,0.3)', rank: 1 },
    Processing: { color: '#818cf8', bg: 'rgba(129,140,248,0.15)', border: 'rgba(129,140,248,0.35)', glow: '0 0 20px rgba(129,140,248,0.3)', rank: 2 },
    Shipped: { color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.35)', glow: '0 0 20px rgba(56,189,248,0.3)', rank: 3 },
    Delivered: { color: '#34d399', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.35)', glow: '0 0 20px rgba(52,211,153,0.3)', rank: 4 },
    Cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.35)', glow: '0 0 20px rgba(248,113,113,0.3)', rank: 5 },
};

const JOURNEY_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const StatusPill = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
        <span className="om2-pill" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
            <span className="om2-pill-dot" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />
            {status}
        </span>
    );
};

const StatCard = ({ icon: Icon, label, value, color, sublabel }) => (
    <div className="om2-stat" style={{ '--sc': color }}>
        <div className="om2-stat-glow" />
        <div className="om2-stat-icon"><Icon size={18} /></div>
        <div className="om2-stat-info">
            <div className="om2-stat-val">{value}</div>
            <div className="om2-stat-label">{label}</div>
            {sublabel && <div className="om2-stat-sub">{sublabel}</div>}
        </div>
    </div>
);

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [copiedId, setCopiedId] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await api.get('/admin/orders');
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        setActionLoading(true);
        try {
            await api.put(`/admin/orders/${id}/status`, { order_status: status });
            setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: status } : o));
            if (selectedOrder?.id === id) {
                setSelectedOrder(prev => ({ ...prev, order_status: status }));
            }
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const viewOrderDetails = async (order) => {
        if (selectedOrder?.id === order.id) return;
        setCopiedId(null);
        setSelectedOrder(order);
        setOrderItems([]);
        setDetailLoading(true);
        try {
            const items = await api.get(`/admin/orders/${order.id}/items`);
            setOrderItems(items);
        } catch (err) {
            console.error('Error fetching order items:', err);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredOrders = orders.filter(o => {
        const matchSearch =
            o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.id.toString().includes(searchQuery);
        const matchStatus = filterStatus === 'All' || o.order_status === filterStatus;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.order_status === 'Pending').length,
        inTransit: orders.filter(o => o.order_status === 'Shipped').length,
        delivered: orders.filter(o => o.order_status === 'Delivered').length,
    };

    const subtotal = orderItems.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0);
    const shipping = subtotal >= 1000 ? 0 : 50;
    const tax = subtotal * 0.18;
    const currentRank = STATUS_CONFIG[selectedOrder?.order_status]?.rank || 0;
    const isCancelled = selectedOrder?.order_status === 'Cancelled';

    return (
        <div className="om2-root">
            {/* ── Animated BG ── */}
            <div className="om2-bg-orbs">
                <div className="om2-orb om2-orb1" />
                <div className="om2-orb om2-orb2" />
                <div className="om2-orb om2-orb3" />
            </div>

            {/* ── Header ── */}
            <div className="om2-header">
                <div className="om2-header-left">
                    <div className="om2-header-badge">
                        <Package size={20} />
                    </div>
                    <div>
                        <h1 className="om2-title">Order Fulfillment</h1>
                        <p className="om2-subtitle">Track, manage &amp; deliver premium experiences</p>
                    </div>
                </div>
                <div className="om2-header-actions">
                    <div className="om2-live-badge">
                        <span className="om2-live-dot" />
                        Live
                    </div>
                    <button className="om2-refresh-btn" onClick={fetchOrders} disabled={loading}>
                        <RefreshCw size={15} className={loading ? 'spinning' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div className="om2-stats-row">
                <StatCard icon={BarChart2} label="Total Orders" value={stats.total} color="#818cf8" />
                <StatCard icon={Clock} label="Pending" value={stats.pending} color="#f59e0b" />
                <StatCard icon={Truck} label="In Transit" value={stats.inTransit} color="#38bdf8" />
                <StatCard icon={CheckCircle} label="Delivered" value={stats.delivered} color="#34d399" />
            </div>

            {/* ── Layout ── */}
            <div className="om2-layout">

                {/* ── List Panel ── */}
                <div className="om2-list-panel">
                    {/* Controls */}
                    <div className="om2-controls">
                        <div className="om2-search-box">
                            <Search size={15} className="om2-search-icon" />
                            <input
                                className="om2-search-input"
                                type="text"
                                placeholder="Search by name or ID…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="om2-filter-box">
                            <Filter size={13} />
                            <select
                                className="om2-filter-select"
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                {Object.keys(STATUS_CONFIG).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="om2-list-meta">
                        <span className="om2-list-count">{filteredOrders.length}</span> orders
                    </div>

                    {/* Cards */}
                    <div className="om2-list-scroll">
                        {loading ? (
                            <div className="om2-skeleton-wrap">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="om2-skel-card" style={{ animationDelay: `${i * 0.08}s` }} />
                                ))}
                            </div>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order, idx) => {
                                const cfg = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.Pending;
                                const isActive = selectedOrder?.id === order.id;
                                return (
                                    <div
                                        key={order.id}
                                        className={`om2-order-card ${isActive ? 'om2-active' : ''}`}
                                        onClick={() => viewOrderDetails(order)}
                                        style={{ '--cc': cfg.color, '--cb': cfg.bg, animationDelay: `${idx * 0.04}s` }}
                                    >
                                        {/* Left color stripe */}
                                        <div className="om2-card-stripe" style={{ background: cfg.color }} />

                                        {/* Avatar */}
                                        <div className="om2-card-avatar" style={{ background: cfg.bg, color: cfg.color, boxShadow: isActive ? cfg.glow : 'none' }}>
                                            {order.customer_name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Body */}
                                        <div className="om2-card-body">
                                            <div className="om2-card-name">{order.customer_name}</div>
                                            <div className="om2-card-id">#{order.id.toString().slice(-6).toUpperCase()}</div>
                                        </div>

                                        {/* Right */}
                                        <div className="om2-card-right">
                                            <div className="om2-card-amount">₹{parseFloat(order.total_amount).toFixed(0)}</div>
                                            <StatusPill status={order.order_status} />
                                            <div className="om2-card-date">
                                                {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>

                                        {isActive && <div className="om2-card-active-glow" style={{ background: `linear-gradient(90deg, ${cfg.color}22, transparent)` }} />}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="om2-empty-list">
                                <ShoppingBag size={38} />
                                <p>No orders found</p>
                                <span>Try adjusting your search or filter</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Detail Panel ── */}
                <div className="om2-detail-panel">
                    {selectedOrder ? (
                        <div className="om2-detail-card om2-fade-in" key={selectedOrder.id}>
                            {/* Top gradient accent */}
                            <div className="om2-detail-accent" style={{ background: `linear-gradient(90deg, ${STATUS_CONFIG[selectedOrder.order_status]?.color}, transparent)` }} />

                            {/* Detail Header */}
                            <div className="om2-detail-header">
                                <div className="om2-dh-top">
                                    <div className="om2-dh-title-group">
                                        <h2 className="om2-dh-title">Order Details</h2>
                                        <button
                                            className={`om2-copy-btn ${copiedId === selectedOrder.id ? 'copied' : ''}`}
                                            onClick={() => handleCopyId(selectedOrder.id)}
                                            title="Copy Order ID"
                                        >
                                            {copiedId === selectedOrder.id ? <Check size={12} /> : <FileText size={12} />}
                                            #{selectedOrder.id.toString().slice(-8).toUpperCase()}
                                        </button>
                                    </div>
                                    <StatusPill status={selectedOrder.order_status} />
                                </div>
                                <div className="om2-dh-date">
                                    <Calendar size={13} />
                                    {new Date(selectedOrder.created_at).toLocaleString(undefined, {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            <div className="om2-detail-body">

                                {/* ── Delivery Journey ── */}
                                <div className="om2-section">
                                    <div className="om2-section-label">
                                        <Truck size={13} />
                                        Delivery Journey
                                    </div>

                                    <div className="om2-timeline">
                                        {JOURNEY_STEPS.map((step, i) => {
                                            const stepRank = STATUS_CONFIG[step].rank;
                                            const isCompleted = !isCancelled && stepRank < currentRank;
                                            const isActive = !isCancelled && selectedOrder.order_status === step;
                                            const cfg = STATUS_CONFIG[step];
                                            return (
                                                <div key={step} className={`om2-tl-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isCancelled ? 'grey' : ''}`}>
                                                    <div className="om2-tl-left">
                                                        <div
                                                            className="om2-tl-dot"
                                                            style={
                                                                isCompleted ? { background: '#34d399', borderColor: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.4)' } :
                                                                    isActive ? { background: cfg.color, borderColor: cfg.color, boxShadow: cfg.glow } :
                                                                        {}
                                                            }
                                                        >
                                                            {isCompleted && <Check size={10} />}
                                                        </div>
                                                        {i < JOURNEY_STEPS.length - 1 && (
                                                            <div className="om2-tl-line" style={isCompleted ? { background: '#34d399' } : {}} />
                                                        )}
                                                    </div>
                                                    <div className="om2-tl-info">
                                                        <span className="om2-tl-label" style={isActive ? { color: cfg.color } : isCompleted ? { color: '#34d399' } : {}}>
                                                            {step}
                                                        </span>
                                                        {isActive && <span className="om2-tl-tag" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>Current</span>}
                                                        {isCompleted && <span className="om2-tl-tag om2-tl-done">Done</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {isCancelled && (
                                            <div className="om2-tl-step">
                                                <div className="om2-tl-left">
                                                    <div className="om2-tl-dot" style={{ background: '#f87171', borderColor: '#f87171', boxShadow: '0 0 8px rgba(248,113,113,0.4)' }}>
                                                        <X size={10} />
                                                    </div>
                                                </div>
                                                <div className="om2-tl-info">
                                                    <span className="om2-tl-label" style={{ color: '#f87171' }}>Cancelled</span>
                                                    <span className="om2-tl-tag" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>Terminated</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    {!['Delivered', 'Cancelled'].includes(selectedOrder.order_status) && (
                                        <div className="om2-action-row">
                                            {selectedOrder.order_status === 'Pending' && (
                                                <button className="om2-btn om2-btn-primary" onClick={() => handleUpdateStatus(selectedOrder.id, 'Processing')} disabled={actionLoading}>
                                                    <Zap size={14} /> Start Processing
                                                </button>
                                            )}
                                            {selectedOrder.order_status === 'Processing' && (
                                                <button className="om2-btn om2-btn-info" onClick={() => handleUpdateStatus(selectedOrder.id, 'Shipped')} disabled={actionLoading}>
                                                    <Truck size={14} /> Mark Shipped
                                                </button>
                                            )}
                                            {selectedOrder.order_status === 'Shipped' && (
                                                <button className="om2-btn om2-btn-success" onClick={() => handleUpdateStatus(selectedOrder.id, 'Delivered')} disabled={actionLoading}>
                                                    <CheckCircle size={14} /> Confirm Delivery
                                                </button>
                                            )}
                                            <button className="om2-btn om2-btn-danger" onClick={() => handleUpdateStatus(selectedOrder.id, 'Cancelled')} disabled={actionLoading}>
                                                <X size={14} /> Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* ── Customer & Shipping ── */}
                                <div className="om2-section">
                                    <div className="om2-section-label">
                                        <User size={13} />
                                        Customer &amp; Shipping
                                    </div>
                                    <div className="om2-info-grid">
                                        <div className="om2-info-card">
                                            <div className="om2-info-card-head">
                                                <User size={13} /> Customer
                                            </div>
                                            <div className="om2-info-name">{selectedOrder.full_name}</div>
                                            <div className="om2-info-row"><Mail size={12} />{selectedOrder.email}</div>
                                            <div className="om2-info-row"><Phone size={12} />{selectedOrder.phone}</div>
                                        </div>
                                        <div className="om2-info-card">
                                            <div className="om2-info-card-head">
                                                <MapPin size={13} /> Deliver To
                                            </div>
                                            <div className="om2-info-addr">
                                                {selectedOrder.address_line1}
                                                {selectedOrder.address_line2 && `, ${selectedOrder.address_line2}`}
                                                <br />
                                                {selectedOrder.city}, {selectedOrder.state} — {selectedOrder.pincode}
                                            </div>
                                            {selectedOrder.landmark && (
                                                <div className="om2-info-landmark">
                                                    <MapPin size={11} /> Near: {selectedOrder.landmark}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ── Order Items ── */}
                                <div className="om2-section">
                                    <div className="om2-section-label">
                                        <Package size={13} />
                                        Order Contents
                                        <span className="om2-section-badge">{orderItems.length} items</span>
                                    </div>
                                    {detailLoading ? (
                                        <div className="om2-item-skels">
                                            {[...Array(3)].map((_, i) => <div key={i} className="om2-item-skel" />)}
                                        </div>
                                    ) : (
                                        <div className="om2-items-list">
                                            {orderItems.map((item, idx) => (
                                                <div key={item.id} className="om2-item-row" style={{ animationDelay: `${idx * 0.07}s` }}>
                                                    <div className="om2-item-img">
                                                        <img src={getFullImageUrl(item.image_url)} alt={item.name} />
                                                        <span className="om2-item-qty">{item.quantity}</span>
                                                    </div>
                                                    <div className="om2-item-info">
                                                        <span className="om2-item-name">{item.name}</span>
                                                        <span className="om2-item-per">
                                                            ₹{(parseFloat(item.subtotal) / item.quantity).toFixed(2)} × {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="om2-item-sub">₹{parseFloat(item.subtotal).toFixed(2)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ── Receipt ── */}
                                <div className="om2-receipt">
                                    <div className="om2-receipt-row">
                                        <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="om2-receipt-row">
                                        <span>GST (18%)</span><span>₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="om2-receipt-row">
                                        <span>Shipping</span>
                                        <span className={shipping === 0 ? 'om2-free' : ''}>
                                            {shipping === 0 ? '🎉 Free' : `₹${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="om2-receipt-divider" />
                                    <div className="om2-receipt-row om2-receipt-total">
                                        <span>Total Paid</span>
                                        <span>₹{parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="om2-payment-badge">
                                        <CheckCircle size={14} />
                                        Securely processed via Razorpay
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="om2-empty-detail">
                            <div className="om2-empty-orb">
                                <Package size={36} />
                            </div>
                            <h3>Select an Order</h3>
                            <p>Click any order from the list to view its full details, track its delivery journey, and manage its status.</p>
                            <div className="om2-empty-hint">
                                <ArrowRight size={13} /> {orders.length} orders waiting
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;
