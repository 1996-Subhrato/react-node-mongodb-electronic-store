import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './ProductManagement.css';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import ConfirmationModal from '../../components/UI/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, product: null });
    const { showToast } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await api.get('/admin/products');
            setProducts(data);
        } catch (err) {
            showToast('Failed to fetch products', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getFullImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${BACKEND_URL}${url}`;
    };

    const handleDeleteClick = (product) => {
        if (product.order_count > 0) {
            showToast(`Cannot delete "${product.name}" as it is associated with ${product.order_count} orders.`, 'warning');
            return;
        }
        setModalConfig({ isOpen: true, product });
    };

    const confirmDelete = async () => {
        const { product } = modalConfig;
        if (!product) return;

        try {
            await api.delete(`/admin/products/${product.id}`);
            setProducts(products.filter(p => p.id !== product.id));
            showToast('Product deleted successfully', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete product', 'error');
        } finally {
            setModalConfig({ isOpen: false, product: null });
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-container animate-fade">
            <header className="admin-header">
                <div>
                    <h1>Product Management</h1>
                    <p>Manage your TechZone product catalog</p>
                </div>
                <Link to="/admin/products/add" className="btn btn-primary add-btn">
                    <Plus size={20} /> Add New Product
                </Link>
            </header>

            <div className="admin-controls glass">
                <div className="search-box">
                    <Search size={20} />
                    <input 
                        type="text" 
                        placeholder="Filter products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="stats">
                    <span>Total: {products.length} Products</span>
                </div>
            </div>

            <div className="product-table-wrapper glass">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Variant</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="table-loading">Loading items...</td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan="7" className="table-empty">No products found.</td></tr>
                        ) : (
                            filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="table-img">
                                            <img src={getFullImageUrl(product.image_url)} alt={product.name} />
                                        </div>
                                    </td>
                                    <td><strong>{product.name}</strong></td>
                                    <td><span className="table-category">{product.category_name}</span></td>
                                    <td>₹{product.price}</td>
                                    <td>
                                        <span className={`stock-badge ${product.stock_quantity < 10 ? 'low' : ''}`}>
                                            {product.stock_quantity} units
                                        </span>
                                    </td>
                                    <td>{product.weight || 'N/A'}</td>
                                    <td>
                                        <div className="table-actions">
                                            <Link to={`/admin/products/edit/${product.id}`} className="action-btn edit" title="Edit">
                                                <Edit size={18} />
                                            </Link>
                                            <button 
                                                className={`action-btn delete ${product.order_count > 0 ? 'disabled' : ''}`} 
                                                title={product.order_count > 0 ? `In ${product.order_count} orders` : "Delete"}
                                                onClick={() => handleDeleteClick(product)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, product: null })}
                onConfirm={confirmDelete}
                title="Delete Product?"
                message={`Are you sure you want to remove "${modalConfig.product?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default ProductManagement;
