import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ProductCard from './ProductCard';
import './ProductRow.css';
import { useAuth } from '../../context/AuthContext';

const RecentlyViewed = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                const data = await api.get('/recently-viewed');
                setProducts(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recently viewed:', err);
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    if (!user || (!loading && products.length === 0)) return null;

    return (
        <section className="product-row-section animate-fade">
            <div className="section-header">
                <h2>Recently Viewed</h2>
                <p>Pick up where you left off</p>
            </div>
            <div className="product-grid">
                {loading ? (
                    [1,2,3].map(i => <div key={i} className="skeleton-card glass" style={{height: '350px'}}></div>)
                ) : (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </section>
    );
};

export default RecentlyViewed;
