import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminDashboardHome.css';
import {
    ShoppingBag,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    Package,
    ArrowRight,
    Tags
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.get('/admin/stats');
                setStats(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="loading-state">Initializing Dashboard...</div>;

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats?.stats?.totalRevenue || 0}`,
            icon: <DollarSign size={24} />,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b98115 0%, #05966910 100%)',
            trend: 'Payments successful'
        },
        {
            title: 'Total Orders',
            value: stats?.stats?.totalOrders || 0,
            icon: <ShoppingBag size={24} />,
            color: '#fbbf24',
            gradient: 'linear-gradient(135deg, #fbbf2415 0%, #d9770610 100%)',
            trend: 'Customer purchases'
        },
        {
            title: 'Products',
            value: stats?.stats?.totalProducts || 0,
            icon: <Package size={24} />,
            color: '#6366f1',
            gradient: 'linear-gradient(135deg, #6366f115 0%, #4f46e510 100%)',
            trend: 'Active listings'
        },
        {
            title: 'Categories',
            value: stats?.stats?.totalCategories || 0,
            icon: <Tags size={24} />,
            color: '#926C44',
            gradient: 'linear-gradient(135deg, #926C4415 0%, #6B4E3110 100%)',
            trend: 'Inventory segments'
        },
        {
            title: 'Low Stock Alerts',
            value: stats?.stats?.lowStockCount || 0,
            icon: <AlertTriangle size={24} />,
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #ef444415 0%, #dc262610 100%)',
            trend: 'Immediate action'
        }
    ];

    return (
        <div className="admin-dashboard-home animate-fade">
            <header className="dashboard-header">
                <div>
                    <h1>Welcome, Admin</h1>
                    <p>Here's what's happening with TechZone today.</p>
                </div>
                <div className="date-display">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className="stat-card admin-card" style={{ background: stat.gradient, border: `1px solid ${stat.color}20` }}>
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-title">{stat.title}</span>
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-trend">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-section admin-card">
                    <div className="section-header">
                        <h2>Best Selling Products</h2>
                        <Link to="/admin/products" className="view-all">View Products <ArrowRight size={16} /></Link>
                    </div>
                    <div className="best-sellers-list">
                        {stats?.bestSellers?.map((item) => (
                            <div key={item.id} className="best-seller-item">
                                <img src={`http://localhost:5000${item.image_url}`} alt={item.name} />
                                <div className="item-details">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-sales">{item.units_sold} units sold</span>
                                </div>
                                <div className="item-rank">
                                    <TrendingUp size={16} color="#10b981" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-section admin-card">
                    <div className="section-header">
                        <h2>Low Stock Alerts</h2>
                        <Link to="/admin/inventory" className="view-all">Manage Stock <ArrowRight size={16} /></Link>
                    </div>
                    <div className="low-stock-table-wrapper">
                        <table className="mini-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.lowStockItems?.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.available_stock} units</td>
                                        <td><span className="badge badge-danger">Critical</span></td>
                                    </tr>
                                ))}
                                {stats?.lowStockItems?.length === 0 && (
                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>All items well stocked!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;
