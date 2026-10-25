import React, { useState, useEffect } from 'react';
import { Package, Edit3, Trash2, Check, X, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import './Admin.css';
import { disableNumberInputScroll } from '../../utils/formUtils';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const InventoryManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState(0);
    const [loading, setLoading] = useState(true);

    const getFullImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${BACKEND_URL}${url}`;
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const data = await api.get('/inventory');
            setInventory(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching inventory:', err);
            setLoading(false);
        }
    };

    const handleUpdate = async (productId) => {
        try {
            await api.put('/inventory/update', {
                product_id: productId,
                available_stock: parseInt(editValue)
            });
            setEditingId(null);
            fetchInventory();
        } catch (err) {
            alert('Failed to update stock');
        }
    };

    if (loading) return <div>Loading Inventory...</div>;

    return (
        <div className="admin-page container animate-fade">
            <div className="admin-header">
                <div>
                    <h1><Package size={28} /> Inventory Management</h1>
                    <p>Monitor and update real-time stock levels</p>
                </div>
            </div>

            <div className="admin-table-container glass">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Available Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => (
                            <tr key={item.id}>
                                <td className="product-cell">
                                    <div className="table-img">
                                        {item.image_url ? (
                                            <img src={getFullImageUrl(item.image_url)} alt={item.name} />
                                        ) : (
                                            <div className="table-img-placeholder"><ImageIcon size={24} /></div>
                                        )}
                                    </div>
                                    <span>{item.name} {item.weight && <span style={{ color: '#64748b', fontSize: '0.85em', fontWeight: '500', marginLeft: '4px' }}>({item.weight})</span>}</span>
                                </td>
                                <td>{item.category_name}</td>
                                <td>
                                    {editingId === item.product_id ? (
                                        <div className="edit-stock-group">
                                            <input 
                                                type="number" 
                                                value={editValue} 
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onWheel={disableNumberInputScroll}
                                            />
                                            <button className="confirm-btn" onClick={() => handleUpdate(item.product_id)}><Check size={18} /></button>
                                            <button className="cancel-btn" onClick={() => setEditingId(null)}><X size={18} /></button>
                                        </div>
                                    ) : (
                                        <span className="stock-count">{item.available_stock} units</span>
                                    )}
                                </td>
                                <td>
                                    {item.available_stock <= 0 ? (
                                        <span className="status-badge oos">Out of Stock</span>
                                    ) : item.available_stock <= 10 ? (
                                        <span className="status-badge low">Low Stock</span>
                                    ) : (
                                        <span className="status-badge in">In Stock</span>
                                    )}
                                </td>
                                <td>
                                    <button 
                                        className="edit-btn" 
                                        onClick={() => {
                                            setEditingId(item.product_id);
                                            setEditValue(item.available_stock);
                                        }}
                                    >
                                        <Edit3 size={18} /> Edit Stock
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryManagement;
