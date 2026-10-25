import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import './ProductForm.css';
import { ArrowLeft, Save, Info, Link as LinkIcon, BrainCircuit, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { disableNumberInputScroll } from '../../utils/formUtils';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ProductForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [categories, setCategories] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    // Gallery State
    const [galleryFiles, setGalleryFiles] = useState([null, null, null, null]);
    const [galleryPreviews, setGalleryPreviews] = useState([null, null, null, null]);
    
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        clearErrors,
        trigger,
        formState: { errors }
    } = useForm({
        defaultValues: {
            category_id: '',
            name: '',
            description: '',
            price: '',
            stock_quantity: '',
            weight: '',
            health_benefits: '',
            nutrition_info: '',
            recommended_intake: '',
            ai_context_notes: '',
            image_url: ''
        }
    });

    const existingImageUrl = watch('image_url');

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const data = await api.get('/products/categories');
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const getFullImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${BACKEND_URL}${url}`;
    };

    const fetchProduct = async () => {
        try {
            const data = await api.get(`/products/${id}`);
            const gallery = data.images ? data.images.slice(1) : [];
            
            reset({
                ...data,
                category_id: data.category?._id || data.category_id || '',
                additional_images: gallery
            });

            if (data.image_url) {
                setPreviewUrl(getFullImageUrl(data.image_url));
            }

            if (gallery.length > 0) {
                const newPreviews = [null, null, null, null];
                gallery.forEach((url, idx) => {
                    if (idx < 4) newPreviews[idx] = getFullImageUrl(url);
                });
                setGalleryPreviews(newPreviews);
            }
        } catch (err) {
            console.error('Error fetching product:', err);
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                showToast('Only JPG, JPEG, and PNG files are supported', 'error');
                e.target.value = ''; // Reset input
                return;
            }

            // Update the form value and clear the error
            setValue('image', file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                // Trigger validation again once preview is set
                trigger('image');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryFileChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                showToast('Only JPG, JPEG, and PNG files are supported', 'error');
                e.target.value = ''; // Reset input
                return;
            }

            const newFiles = [...galleryFiles];
            newFiles[index] = file;
            setGalleryFiles(newFiles);

            const reader = new FileReader();
            reader.onloadend = () => {
                const newPreviews = [...galleryPreviews];
                newPreviews[index] = reader.result;
                setGalleryPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const fd = new FormData();
            
            // Append basic fields
            Object.keys(data).forEach(key => {
                if (!['image', 'additional_images', 'images', 'image_url'].includes(key)) {
                    fd.append(key, data[key]);
                }
            });

            // Append main image - logic simplified to expect a single File object
            console.log("Selected Image:", data.image);

            let imageToAppend = null;
            if (data.image instanceof File || data.image instanceof Blob) {
                imageToAppend = data.image;
            }

            if (imageToAppend) {
                fd.append('image', imageToAppend);
            } else if (data.image_url) {
                // If it's an existing product with a URL and no new file selected
                fd.append('image_url', data.image_url);
            }

            // Append additional gallery images
            let hasNewGallery = false;
            galleryFiles.forEach((file) => {
                if (file) {
                    fd.append('additional_images', file);
                    hasNewGallery = true;
                }
            });

            if (!hasNewGallery && data.additional_images?.length > 0) {
                data.additional_images.forEach(url => {
                    fd.append('additional_images', url);
                });
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (isEdit) {
                await api.put(`/admin/products/${id}`, fd, config);
                showToast('Product updated successfully', 'success');
            } else {
                await api.post('/admin/products', fd, config);
                showToast('Product created successfully', 'success');
            }
            navigate('/admin/products');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save product', 'error');
            setLoading(false);
        }
    };

    const onFormError = (errors) => {
        if (errors.image) {
            const imageSection = document.getElementById('image-upload-section');
            if (imageSection) {
                imageSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    return (
        <div className="admin-container animate-fade">
            <Link to="/admin/products" className="back-btn"><ArrowLeft size={18} /> Back to Products</Link>
            
            <div className="form-header">
                <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                <p>{isEdit ? `Updating ID: ${id}` : 'Create a new product listing in the TechZone catalog'}</p>
            </div>

            <form className="product-form" onSubmit={handleSubmit(onSubmit, onFormError)}>

                <div className="form-grid">
                    {/* Basic Info Section */}
                    <div className="form-section glass">
                        <h3><Info size={18} /> Basic Information</h3>
                        
                        <div className="field">
                            <label>Product Name {errors.name && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                            <input 
                                type="text" 
                                {...register('name', { required: true })}
                                placeholder="e.g. Premium Walnuts"
                                className={errors.name ? 'error-field' : ''}
                            />
                        </div>

                        <div className="field">
                            <label>Category {errors.category_id && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                            <select 
                                {...register('category_id', { required: true })}
                                className={errors.category_id ? 'error-field' : ''}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label>Description {errors.description && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                            <textarea 
                                {...register('description', { required: true })}
                                rows="4"
                                placeholder="Describe the key features, specs, and compatibility..."
                                className={errors.description ? 'error-field' : ''}
                            ></textarea>
                        </div>
                    </div>

                    {/* Inventory & Specs Section */}
                    <div className="form-section glass">
                        <h3><Save size={18} /> Inventory & Specs</h3>
                        
                        <div className="field-row">
                            <div className="field">
                                <label>Price (₹) {errors.price && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                                <input 
                                    type="number" 
                                    {...register('price', { required: true, min: 0 })}
                                    onWheel={disableNumberInputScroll}
                                    className={errors.price ? 'error-field' : ''}
                                />
                            </div>
                            <div className="field">
                                <label>Stock (Units) {errors.stock_quantity && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                                <input 
                                    type="number" 
                                    {...register('stock_quantity', { required: true, min: 0 })}
                                    onWheel={disableNumberInputScroll}
                                    className={errors.stock_quantity ? 'error-field' : ''}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label>Variant / Storage {errors.weight && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                            <select 
                                {...register('weight', { required: true })}
                                className={errors.weight ? 'error-field' : ''}
                            >
                                <option value="">Select Variant</option>
                                <option value="32GB">32 GB</option>
                                <option value="64GB">64 GB</option>
                                <option value="128GB">128 GB</option>
                                <option value="256GB">256 GB</option>
                                <option value="512GB">512 GB</option>
                                <option value="1TB">1 TB</option>
                                <option value="8GB RAM | 256GB SSD">8GB RAM | 256GB SSD</option>
                                <option value="16GB RAM | 512GB SSD">16GB RAM | 512GB SSD</option>
                                <option value="40mm GPS">40mm GPS</option>
                                <option value="44mm GPS">44mm GPS</option>
                                <option value="41mm GPS">41mm GPS</option>
                                <option value="45mm GPS">45mm GPS</option>
                                <option value="Standard">Standard</option>
                            </select>
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className="form-section glass">
                        <h3><LinkIcon size={18} /> Media & Photos</h3>
                        
                        <div className="field" id="image-upload-section">
                            <label>Main Product Image {errors.image && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                            <div className={`file-upload-wrapper product-upload ${errors.image ? 'error-field' : ''}`}>
                                <div className="image-preview-container product-preview-box">
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
                                    {previewUrl ? 'Change Photo' : 'Upload Photo'}
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        className="hidden-file-input"
                                        {...register('image', { 
                                            validate: (value) => {
                                                if (isEdit && existingImageUrl) return true;
                                                if (previewUrl) return true;
                                                if (value instanceof File) return true;
                                                if (value && value.length > 0) return true; // Keep as fallback for default input behavior
                                                return "Main product image is required";
                                            },
                                            onChange: (e) => handleFileChange(e)
                                        })}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="field">
                            <label>Product Gallery Photos (Optional - Max 4)</label>
                            <div className="gallery-upload-grid">
                                {[0, 1, 2, 3].map((idx) => (
                                    <div key={idx} className="file-upload-wrapper gallery-slot">
                                        <div className="image-preview-container gallery-preview-box">
                                            {galleryPreviews[idx] ? (
                                                <img src={galleryPreviews[idx]} alt={`Gallery ${idx + 1}`} className="upload-preview" />
                                            ) : (
                                                <div className="preview-placeholder sm">
                                                    <ImageIcon size={24} />
                                                    <span>Empty</span>
                                                </div>
                                            )}
                                        </div>
                                        <label className="file-input-label sm">
                                            <Upload size={14} />
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => handleGalleryFileChange(idx, e)}
                                                className="hidden-file-input"
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Content Section */}
                    <div className="form-section glass ai-section">
                        <h3><BrainCircuit size={18} /> AI Product Content (Assistant Logic)</h3>
                        <p className="section-note">This information directly trains the AI Assistant for this product.</p>
                        
                        <div className="field">
                            <label>Key Features / Selling Points {errors.health_benefits && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                            <textarea 
                                {...register('health_benefits', { required: true })}
                                rows="3"
                                placeholder="e.g. AMOLED display, 108MP camera, 5G connectivity..."
                                className={errors.health_benefits ? 'error-field' : ''}
                            ></textarea>
                        </div>

                        <div className="field">
                            <label>Technical Specifications {errors.nutrition_info && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                            <textarea 
                                {...register('nutrition_info', { required: true })}
                                rows="3"
                                placeholder="e.g. Processor: Snapdragon 8 Gen 2, RAM: 12GB, Battery: 5000mAh..."
                                className={errors.nutrition_info ? 'error-field' : ''}
                            ></textarea>
                        </div>

                        <div className="field">
                            <label>Usage / Compatibility {errors.recommended_intake && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                            <textarea 
                                {...register('recommended_intake', { required: true })}
                                rows="2"
                                placeholder="e.g. Compatible with iOS 16+, Windows 11, supports fast charging..."
                                className={errors.recommended_intake ? 'error-field' : ''}
                            ></textarea>
                        </div>

                        <div className="field">
                            <label>AI Context Notes (Private) {errors.ai_context_notes && <span className="error-text"><AlertCircle size={12}/> Required</span>}</label>
                            <textarea 
                                {...register('ai_context_notes', { required: true })}
                                rows="2"
                                placeholder="Internal notes for AI behavior..."
                                className={errors.ai_context_notes ? 'error-field' : ''}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : isEdit ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;

