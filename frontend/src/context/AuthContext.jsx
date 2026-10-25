import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const fetchCartCount = async () => {
        try {
            const data = await api.get('/cart');
            const count = data.items.length;
            setCartCount(count);
        } catch (err) {
            setCartCount(0);
        }
    };

    const checkSession = async () => {
        try {
            const userData = await api.get('/auth/session');
            if (userData) {
                setUser(userData);
                // Fetch cart count after successful user session check
                await fetchCartCount();
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        }

        try {
            // Check if admin is logged in
            const adminData = await api.get('/admin/session');
            if (adminData && adminData.isAdmin) {
                setAdmin(adminData); 
            } else {
                setAdmin(null);
            }
        } catch (err) {
            setAdmin(null);
        }

        setLoading(false);
    };

    const loginUser = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        setUser(response.user);
        return response;
    };

    const loginAdmin = async (email, password) => {
        const response = await api.post('/admin/login', { email, password });
        setAdmin(response.admin);
        return response;
    };

    const updateUserAccount = async (formData) => {
        const response = await api.put('/auth/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        await checkSession(); // Refresh local state
        return response;
    };

    const logoutUser = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    const logoutAdmin = async () => {
        await api.post('/admin/logout');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            admin, 
            cartCount,
            loading, 
            loginUser, 
            loginAdmin, 
            logoutUser, 
            logoutAdmin,
            checkSession,
            fetchCartCount,
            updateUserAccount
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
