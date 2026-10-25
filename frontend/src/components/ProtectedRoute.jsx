import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, admin, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="loading-container"><div className="loader"></div></div>;

    if (adminOnly) {
        if (!admin) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
    } else {
        if (!user) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
