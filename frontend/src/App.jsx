import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Auth/Profile';

// Admin Pages
// Admin Pages
import AdminDashboardHome from './pages/Admin/AdminDashboardHome';
import ProductManagement from './pages/Admin/ProductManagement';
import ProductForm from './pages/Admin/ProductForm';
import CategoryManagement from './pages/Admin/CategoryManagement';
import InventoryManagement from './pages/Admin/InventoryManagement';
import OrderManagement from './pages/Admin/OrderManagement';
import UserManagement from './pages/Admin/UserManagement';
import Catalog from './pages/Catalog/Catalog';
import AIAssistant from './pages/AIAssistant/AIAssistant';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './components/Admin/AdminLayout';

// Checkout & Orders
import Checkout from './pages/Checkout/Checkout';
import OrderSuccess from './pages/Checkout/OrderSuccess';
import Wishlist from './pages/Wishlist/Wishlist';
import NotFound from './pages/NotFound/NotFound';

// Components & Context
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
        <AuthProvider>
        <Router>
            <Routes>
                {/* Admin Public Routes - No Layout or Separate Layout */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Protected Routes - Uses AdminLayout */}
                <Route path="/admin/*" element={
                    <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                            <Routes>
                                <Route path="dashboard" element={<AdminDashboardHome />} />
                                <Route path="products" element={<ProductManagement />} />
                                <Route path="products/add" element={<ProductForm />} />
                                <Route path="products/edit/:id" element={<ProductForm />} />
                                <Route path="categories" element={<CategoryManagement />} />
                                <Route path="orders" element={<OrderManagement />} />
                                <Route path="users" element={<UserManagement />} />
                                <Route path="inventory" element={<InventoryManagement />} />
                            </Routes>
                        </AdminLayout>
                    </ProtectedRoute>
                } />

                {/* Public & User Routes - Uses Main Layout */}
                <Route path="/*" element={
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Catalog />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/ai-assistant" element={<AIAssistant />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/about" element={<div className="container" style={{padding: '50px 0'}}><h2>About TechZone</h2><p>Your trusted destination for premium electronics and gadgets.</p></div>} />
                            
                            {/* User Protected Routes */}
                            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                            <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                            {/* Catch-all Route for 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Layout>
                } />
            </Routes>
        </Router>
    </AuthProvider>
    </ToastProvider>
  );
}

export default App;
