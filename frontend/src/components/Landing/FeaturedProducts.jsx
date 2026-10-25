import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../Products/ProductCard';
import { ArrowRight } from 'lucide-react';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // For landing, we just take the first few products
                const data = await api.get('/products');
                setProducts(data.slice(0, 4));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching featured products:', err);
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <section className="featured-section-landing container">
            <div className="section-header-row">
                <div className="header-text">
                    <span className="section-subtitle">Customer Favorites</span>
                    <h2>Best Selling Products</h2>
                </div>
                <Link to="/products" className="view-all-link">
                    View Catalog <ArrowRight size={18} />
                </Link>
            </div>

            {loading ? (
                <div className="loading-placeholder">Loading premium selection...</div>
            ) : (
                <div className="product-grid-landing">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default FeaturedProducts;
