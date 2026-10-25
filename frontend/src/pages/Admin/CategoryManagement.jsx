import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit2, Trash2, Plus, X, Search, Tags, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import './ProductManagement.css';
import './CategoryManagement.css';
import ConfirmationModal from '../../components/UI/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

const BACKEND_URL = 'http://localhost:5000';
// const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Delete Confirmation State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });

    // Toast Hook
    const { showToast } = useToast();

    // React Hook Form
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await api.get('/admin/categories');
            setCategories(data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const getFullImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${BACKEND_URL}${url}`;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setValue('name', category.name);
            setValue('description', category.description || '');
            setPreviewUrl(getFullImageUrl(category.image_url));
        } else {
            setEditingCategory(null);
            setPreviewUrl(null);
            reset();
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        reset();
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description || '');
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingCategory) {
                await api.put(`/admin/categories/${editingCategory.id}`, formData, config);
                showToast('Category updated successfully!', 'success');
            } else {
                await api.post('/admin/categories', formData, config);
                showToast('Category created successfully!', 'success');
            }
            closeModal();
            fetchCategories();
        } catch (err) {
            showToast(err.response?.data?.message || 'Action failed', 'error');
        }
    };

    const handleOpenDeleteModal = (category) => {
        setDeleteModal({ isOpen: true, category });
    };

    const confirmDelete = async () => {
        const { category } = deleteModal;
        if (!category) return;

        try {
            await api.delete(`/admin/categories/${category.id}`);
            showToast('Category deleted successfully!', 'success');
            setDeleteModal({ isOpen: false, category: null });
            fetchCategories();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete category', 'error');
            setDeleteModal({ isOpen: false, category: null });
        }
    };

    const filteredCategories = (categories || []).filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="admin-loading">Loading categories...</div>;

    return (
        <div className="admin-container animate-fade">
            <header className="admin-header">
                <div>
                    <h1>Category Management</h1>
                    <p>Organize your store's taxonomy</p>
                </div>
                <button className="btn btn-primary add-btn" onClick={() => openModal()}>
                    <Plus size={20} /> Add New Category
                </button>
            </header>

            <div className="admin-controls glass">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Filter categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="stats">
                    <span>Total: {categories.length} Categories</span>
                </div>
            </div>

            {error ? (
                <div className="error-alert">{error}</div>
            ) : (
                <div className="product-table-wrapper glass">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Thumbnail</th>
                                <th>Category Name</th>
                                <th>Description</th>
                                <th>Products</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.length === 0 ? (
                                <tr><td colSpan="5" className="table-empty">No categories found.</td></tr>
                            ) : (
                                filteredCategories.map(category => (
                                    <tr key={category.id}>
                                        <td>
                                            {category.image_url ? (
                                                <div className="table-img">
                                                    <img src={getFullImageUrl(category.image_url)} alt={category.name} />
                                                </div>
                                            ) : (
                                                <div className="table-img-placeholder"><Tags size={20} /></div>
                                            )}
                                        </td>
                                        <td><strong>{category.name}</strong></td>
                                        <td><p className="truncate-text">{category.description || 'No description'}</p></td>
                                        <td>
                                            <span className={`stock-badge ${category.product_count > 0 ? '' : 'low'}`}>
                                                {category.product_count} Products
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="action-btn edit" onClick={() => openModal(category)} title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    className={`action-btn delete ${category.product_count > 0 ? 'disabled' : ''}`}
                                                    onClick={() => {
                                                        if (category.product_count > 0) {
                                                            showToast(`Cannot delete "${category.name}" because it has ${category.product_count} products attached.`, 'warning');
                                                        } else {
                                                            handleOpenDeleteModal(category);
                                                        }
                                                    }}
                                                    title={category.product_count > 0 ? `Has ${category.product_count} products` : "Delete"}
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
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade">
                        <div className="modal-header">
                            <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                            <button className="close-btn" onClick={closeModal}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    {...register('name', {
                                        required: 'Category name is required',
                                        minLength: { value: 3, message: 'Minimum 3 characters required' }
                                    })}
                                    placeholder="E.g. Almonds"
                                />
                                {errors.name && <span className="validation-error">{errors.name.message}</span>}
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    {...register('description')}
                                    placeholder="Brief details about the category"
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>Category Image</label>
                                <div className="file-upload-wrapper">
                                    <div className="image-preview-container">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="upload-preview" />
                                        ) : (
                                            <div className="preview-placeholder">
                                                <ImageIcon size={40} />
                                                <span>No image selected</span>
                                            </div>
                                        )}
                                    </div>
                                    <label className="file-input-label">
                                        <Upload size={18} />
                                        {selectedFile ? 'Change Image' : 'Choose Image'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden-file-input"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingCategory ? 'Update Category' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, category: null })}
                onConfirm={confirmDelete}
                title="Delete Category?"
                message={`Are you sure you want to remove the category "${deleteModal.category?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default CategoryManagement;
