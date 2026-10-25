import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Wishlist.css';
import ProductCard from '../../components/Products/ProductCard';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const data = await api.get('/wishlist');
            setWishlistItems(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching wishlist:', err);
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await api.delete(`/wishlist/${id}`);
            setWishlistItems(wishlistItems.filter(item => item.wishlist_id !== id));
        } catch (err) {
            console.error('Error removing from wishlist:', err);
        }
    };

    if (loading) return <div className="wishlist-loading"><div className="loader"></div></div>;

    return (
        <div className="wishlist-page container animate-fade">
            <div className="section-header">
                <h1>My Wishlist</h1>
                <p>Saved items for your next tech purchase</p>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="empty-wishlist glass">
                    <Heart size={64} color="#ccc" />
                    <h2>Your wishlist is empty</h2>
                    <p>Browse our premium tech products and save your favorites!</p>
                    <Link to="/" className="btn btn-primary">Start Exploring</Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map((item) => (
                        <div key={item.wishlist_id} className="wishlist-item-wrapper">
                            <ProductCard product={item} />
                            <button 
                                className="remove-wishlist-btn glass" 
                                onClick={() => handleRemove(item.wishlist_id)}
                                title="Remove from wishlist"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
