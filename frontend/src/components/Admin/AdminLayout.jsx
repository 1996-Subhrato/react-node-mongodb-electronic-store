import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logoutAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar 
                isCollapsed={isCollapsed} 
                toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
                onLogout={handleLogout}
            />
            <main className={`admin-main ${isCollapsed ? 'expanded' : ''}`}>
                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
