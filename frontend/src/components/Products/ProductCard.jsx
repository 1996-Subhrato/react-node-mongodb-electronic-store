import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import StarRating from './StarRating';
import StockStatus from './StockStatus';
import './ProductCard.css';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BACKEND_URL}${url}`;
};

const ProductCard = ({ product }) => {
    const { user, fetchCartCount } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/login');
            return;
        }

        setAdding(true);
        try {
            await api.post('/cart/add', { productId: product.id, quantity: 1 });
            showToast(`${product.name} added to cart!`, 'success');
            await fetchCartCount();
            setAdding(false);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error adding to cart';
            showToast(errorMsg, 'error');
            setAdding(false);
        }
    };

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (isWishlisted) {
                // In a full implementation, we'd need the wishlist item ID
                // For now, we just toggle the UI state as a demo
                setIsWishlisted(false);
            } else {
                await api.post('/wishlist/add', { productId: product.id });
                setIsWishlisted(true);
            }
        } catch (err) {
            console.error('Wishlist error:', err);
        }
    };

    return (
        <div className="product-card glass">
            <div className="product-image-container">
                <Link to={`/products/${product.id}`}>
                    <img src={getFullImageUrl(product.image_url)} alt={product.name} className="product-image" />
                </Link>
                <div className="product-badges">
                    {!!product.is_featured && <span className="badge-featured">Featured</span>}
                    {product.available_stock <= 0 && <span className="badge-oos">Out of Stock</span>}
                </div>
                {/* <button 
                    className={`wishlist-toggle ${isWishlisted ? 'active' : ''}`}
                    onClick={toggleWishlist}
                >
                    <Heart size={18} fill={isWishlisted ? "var(--primary)" : "none"} />
                </button> */}
                <div className="product-overlay">
                    <Link to={`/products/${product.id}`} className="icon-btn"><Eye size={20} /></Link>
                    <button
                        className="icon-btn"
                        onClick={handleAddToCart}
                        disabled={adding || product.available_stock <= 0}
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            <div className="product-info">
                <div className="category-row">
                    <span className="category-tag">{product.category_name}</span>
                    <StarRating rating={product.avg_rating} size={12} />
                </div>
                <Link to={`/products/${product.id}`}>
                    <h3 className="product-title">{product.name}</h3>
                </Link>
                <div className="product-meta">
                    <span className="weight-tag">{product.weight || '500g'}</span>
                    <StockStatus stock={product.available_stock} />
                </div>
                <div className="product-footer">
                    <div className="product-price">₹{product.price}</div>
                    <button
                        className="add-cart-text-btn"
                        onClick={handleAddToCart}
                        disabled={adding || product.available_stock <= 0}
                    >
                        {adding ? '...' : 'Add +'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
