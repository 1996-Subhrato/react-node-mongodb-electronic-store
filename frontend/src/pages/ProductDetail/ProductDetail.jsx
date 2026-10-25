import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ProductDetail.css';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Plus, Minus, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ProductAISheet from '../../components/AI/ProductAISheet';
import StarRating from '../../components/Products/StarRating';
import StockStatus from '../../components/Products/StockStatus';
import ReviewSection from '../../components/Reviews/ReviewSection';
import RelatedProducts from '../../components/Products/RelatedProducts';
import RecentlyViewed from '../../components/Products/RecentlyViewed';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BACKEND_URL}${url}`;
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, fetchCartCount } = useAuth();
    const { showToast } = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);
    const [isAISheetOpen, setIsAISheetOpen] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await api.get(`/products/${id}`);
                setProduct(data);
                setMainImage(getFullImageUrl(data.image_url));
                setLoading(false);

                // Track view if user is logged in
                if (user) {
                    api.post('/recently-viewed/track', { productId: id });
                }
            } catch (err) {
                console.error('Error fetching product detail:', err);
                setError('Product not found or connection error');
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0); // Scroll to top on id change
    }, [id, user]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (product.available_stock < 1) {
            showToast('This product is currently out of stock.', 'error');
            return;
        }

        setAdding(true);
        try {
            await api.post('/cart/add', {
                productId: product.id,
                quantity: 1
            });
            showToast(`${product.name} added to cart!`, 'success');
            await fetchCartCount();
            setAdding(false);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error adding to cart';
            showToast(errorMsg, 'error');
            setAdding(false);
        }
    };

    const toggleWishlist = async () => {
        if (!user) return navigate('/login');
        try {
            await api.post('/wishlist/add', { productId: product.id });
            setIsWishlisted(true);
            showToast('Added to Wishlist!', 'success');
        } catch (err) {
            console.error('Wishlist error:', err);
        }
    };

    if (loading) return <div className="detail-loading"><div className="loader"></div></div>;
    if (error) return <div className="container error-msg">{error}</div>;

    return (
        <div className="product-detail-page container animate-fade">
            <Link to="/products" className="back-btn"><ArrowLeft size={18} /> Back to Catalog</Link>

            <div className="detail-grid">
                {/* Image Gallery */}
                <div className="gallery-section">
                    <div className="main-image-container glass">
                        <img src={mainImage} alt={product.name} className="main-image" />
                    </div>
                    <div className="thumbnail-grid">
                        {product.images?.map((url, idx) => {
                            const fullUrl = getFullImageUrl(url);
                            return (
                                <div
                                    key={idx}
                                    className={`thumb-wrapper glass ${mainImage === fullUrl ? 'active' : ''}`}
                                    onClick={() => setMainImage(fullUrl)}
                                >
                                    <img src={fullUrl} alt={`${product.name} thumbnail ${idx}`} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info Section */}
                <div className="info-section">
                    <span className="detail-category">{product.category_name}</span>
                    <div className="title-row">
                        <h1 className="detail-title">{product.name}</h1>
                        {/* <button
                            className={`wishlist-detail-btn ${isWishlisted ? 'active' : ''}`}
                            onClick={toggleWishlist}
                        >
                            <Heart size={24} fill={isWishlisted ? "var(--primary)" : "none"} />
                        </button> */}
                    </div>

                    <div className="review-snapshot">
                        <StarRating rating={product.avg_rating} count={product.review_count} size={20} />
                    </div>

                    <div className="detail-price-row">
                        <span className="detail-price">₹{product.price}</span>
                        {/* <span className="price-unit">Per Kg</span> */}
                    </div>

                    <div className="detail-meta">
                        <div className="meta-item">
                            <span className="label">Variant / Model</span>
                            <span className="value">{product.weight || 'Standard'}</span>
                        </div>
                        <div className="meta-item">
                            <span className="label">Availability</span>
                            <StockStatus stock={product.available_stock} />
                        </div>
                    </div>

                    <p className="detail-description">{product.description}</p>

                    <div className="action-row">
                        <button
                            className="btn btn-primary add-to-cart-btn"
                            disabled={product.stock_quantity <= 0 || adding}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={20} /> {adding ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button
                            className="btn btn-secondary ai-btn"
                            onClick={() => setIsAISheetOpen(true)}
                        >
                            <Sparkles size={20} /> Ask AI
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="detail-extra-content">
                <div className="content-tabs glass">
                    <button className="tab active">Description</button>
                    <button className="tab" onClick={() => document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' })}>Reviews ({product.review_count})</button>
                </div>

                <section id="reviews">
                    <ReviewSection productId={id} />
                </section>

                <RelatedProducts productId={id} />

                <RecentlyViewed />
            </div>

            {/* AI Assistant Sheet */}
            <ProductAISheet
                isOpen={isAISheetOpen}
                onClose={() => setIsAISheetOpen(false)}
                product={product}
            />
        </div>
    );
};

export default ProductDetail;
