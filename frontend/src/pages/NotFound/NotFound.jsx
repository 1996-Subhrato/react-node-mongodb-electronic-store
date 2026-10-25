import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, ShoppingBag, HelpCircle, ArrowRight } from 'lucide-react';
import FeaturedProducts from '../../components/Landing/FeaturedProducts';
import './NotFound.css';

const NotFound = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="not-found-page animate-fade">
            <div className="nf-hero-section">
                <div className="container">
                    <div className="nf-content glass">
                        <div className="nf-badge">404 Error</div>
                        <h1>Page Not Found</h1>
                        <p className="nf-description">
                            Oops! The page you're looking for was either moved, 
                            deleted, or doesn't exist in our tech catalog.
                        </p>

                        <div className="nf-search-box">
                            <form onSubmit={handleSearch}>
                                <div className="nf-search-input-wrapper">
                                    <Search className="nf-search-icon" size={20} />
                                    <input 
                                        type="text" 
                                        placeholder="Search phones, laptops, headphones..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit" className="btn btn-primary">Search</button>
                                </div>
                            </form>
                        </div>

                        <div className="nf-actions">
                            <Link to="/" className="btn btn-primary btn-lg">
                                <Home size={18} /> Back to Home
                            </Link>
                            <Link to="/products" className="btn btn-secondary btn-lg btn-glass">
                                <ShoppingBag size={18} /> Shop Catalog
                            </Link>
                        </div>

                        <div className="nf-helpful-links">
                            <span>Still lost? Try these:</span>
                            <div className="links-row">
                                <Link to="/ai-assistant">AI Product Advisor</Link>
                                <Link to="/wishlist">My Wishlist</Link>
                                <Link to="/about">About Us</Link>
                                <a href="mailto:support@techzone.com"><HelpCircle size={14} /> Contact Support</a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="nf-bg-decoration">
                    <div className="nf-circle nf-c-1"></div>
                    <div className="nf-circle nf-c-2"></div>
                </div>
            </div>

            <div className="nf-suggestions">
                <div className="container">
                    <div className="nf-suggestions-header">
                        <h2>While you're here...</h2>
                        <p>Explore our most popular tech products</p>
                    </div>
                    <FeaturedProducts />
                    <div className="nf-catalog-cta">
                        <Link to="/products" className="view-all-link">
                            View Full Catalog <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
