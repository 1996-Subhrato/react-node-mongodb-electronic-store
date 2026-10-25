import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './UserManagement.css';
import { 
    Users, 
    ShoppingBag, 
    Calendar, 
    Search,
    ChevronRight,
    UserCircle,
    Mail
} from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await api.get('/admin/users');
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setLoading(false);
        }
    };

    const viewUserHistory = async (user) => {
        setSelectedUser(user);
        setUserOrders([]);
        try {
            const orders = await api.get(`/admin/users/${user.id}/orders`);
            setUserOrders(orders);
        } catch (err) {
            console.error('Error fetching user orders:', err);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="user-management animate-fade">
            <header className="page-header">
                <div>
                    <h1>User Management</h1>
                    <p>Manage your premium customer base</p>
                </div>
            </header>

            <div className="admin-controls glass">
                <div className="search-box">
                    <Search size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="stats">
                    <span>Total Customers: {users.length}</span>
                </div>
            </div>

            <div className="user-content-grid">
                <div className="user-list-section admin-card">
                    <div className="user-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="3" className="table-loading">Loading users...</td></tr>
                                ) : filteredUsers.map(user => (
                                    <tr key={user.id} className={selectedUser?.id === user.id ? 'active-row' : ''}>
                                        <td>
                                            <div className="user-profile">
                                                <div className="avatar-mini">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="user-info">
                                                    <span className="name">{user.name}</span>
                                                    <span className="email">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button className="action-btn-text" onClick={() => viewUserHistory(user)}>
                                                View History <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="user-history-section">
                    {selectedUser ? (
                        <div className="admin-card history-card animate-fade">
                            <div className="history-header">
                                <UserCircle size={48} color="#fbbf24" />
                                <div className="header-info">
                                    <h2>{selectedUser.name}</h2>
                                    <span className="email-row"><Mail size={14} /> {selectedUser.email}</span>
                                    <span className="join-row"><Calendar size={14} /> Member since {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="orders-summary">
                                <h3>Order History</h3>
                                <div className="history-list">
                                    {userOrders.length > 0 ? (
                                        userOrders.map(order => (
                                            <div key={order.id} className="history-item">
                                                <div className="order-meta">
                                                    <span className="order-id">Order #{order.id}</span>
                                                    <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="order-stats">
                                                    <span className="order-amount">₹{order.total_amount}</span>
                                                    <span className={`status-pill mini ${order.order_status.toLowerCase()}`}>
                                                        {order.order_status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-orders">No orders placed yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-history admin-card">
                            <Users size={48} color="#cbd5e1" />
                            <p>Select a user to view their purchase history and profile details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
