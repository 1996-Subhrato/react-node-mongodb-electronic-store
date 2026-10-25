import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Warehouse,
    BrainCircuit,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Home,
    Tags
} from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = ({ isCollapsed, toggleSidebar, onLogout }) => {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(false);
        onLogout();
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const navItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/categories', icon: <Tags size={20} />, label: 'Categories' },
        { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
        { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/admin/inventory', icon: <Warehouse size={20} />, label: 'Inventory' },
    ];

    return (
        <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="admin-brand-logo">
                    {/* <img src="/logo-2.png" alt="TechZone Logo" className="admin-logo-img" /> */}
                    {!isCollapsed && <span>TechZone</span>}
                </div>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="icon">{item.icon}</span>
                        {!isCollapsed && <span className="label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                {/* <NavLink to="/" className="nav-item">
                    <span className="icon"><Home size={20} /></span>
                    {!isCollapsed && <span className="label">Back to Store</span>}
                </NavLink> */}
                <button className="nav-item logout-btn" onClick={handleLogoutClick}>
                    <span className="icon"><LogOut size={20} /></span>
                    {!isCollapsed && <span className="label">Logout</span>}
                </button>
            </div>

            {showLogoutConfirm && (
                <div className="logout-confirm-overlay" onClick={cancelLogout}>
                    <div className="logout-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-icon">
                            <LogOut size={32} />
                        </div>
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to exit the admin panel?</p>
                        <div className="confirm-actions">
                            <button className="confirm-cancel-btn" onClick={cancelLogout}>Cancel</button>
                            <button className="confirm-logout-btn" onClick={confirmLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default AdminSidebar;
