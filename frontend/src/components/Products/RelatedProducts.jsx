import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ProductCard from './ProductCard';
import './ProductRow.css';

const RelatedProducts = ({ productId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const data = await api.get(`/products/${productId}/related`);
                setProducts(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching related products:', err);
                setLoading(false);
            }
        };
        fetchRelated();
    }, [productId]);

    if (!loading && products.length === 0) return null;

    return (
        <section className="product-row-section animate-fade">
            <div className="section-header">
                <h2>Related Products</h2>
                <p>You might also like these handpicked selections</p>
            </div>
            <div className="product-grid">
                {loading ? (
                    [1,2,3,4].map(i => <div key={i} className="skeleton-card glass" style={{height: '350px'}}></div>)
                ) : (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </section>
    );
};

export default RelatedProducts;
