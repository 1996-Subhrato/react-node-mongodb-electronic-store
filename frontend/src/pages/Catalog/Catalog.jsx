import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Catalog.css';
import { Search, Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/Products/ProductCard';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search') || '';

    const { user, fetchCartCount } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            setActiveCategory('');
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchProducts();
    }, [location.search, activeCategory, sortBy]);

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        // Clear search when selecting a category
        if (searchQuery) {
            navigate('/products');
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await api.get('/products/categories');
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = '/products?';
            if (searchQuery) url += `search=${searchQuery}&`;
            if (activeCategory) url += `category=${activeCategory}&`;
            if (sortBy) url += `sort=${sortBy}&`;

            const data = await api.get(url);
            setProducts(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please check if the backend is running.');
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setActiveCategory('');
        navigate('/products');
    };

    return (
        <div className="catalog-page animate-fade">
            <div className="catalog-breadcrumb-section">
                <div className="container">
                    <nav className="breadcrumb-nav">
                        <Link to="/">Home</Link>
                        <span className="separator">/</span>
                        <Link to="/products">Shop</Link>
                        {/* <span className="separator">/</span>
                        <span className="current">All Products</span> */}
                    </nav>
                    <div className="breadcrumb-content">
                        <h1 className="page-title">{searchQuery ? `Search: "${searchQuery}"` : 'Premium Catalog'}</h1>
                        <p className="page-subtitle">Discover our exclusive collection of next-gen electronics and high-performance gadgets.</p>
                    </div>
                </div>
                <div className="breadcrumb-overlay"></div>
            </div>

            <main className="container catalog-main">
                <aside className="catalog-sidebar">
                    <div className="filter-section glass">
                        <h3><Filter size={18} /> Categories</h3>
                        <div className="category-filters">
                            <button
                                className={`filter-option ${activeCategory === '' ? 'active' : ''}`}
                                onClick={() => handleClearFilters()}
                            >
                                All Products
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`filter-option ${activeCategory == cat.id ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section glass">
                        <h3><SlidersHorizontal size={18} /> Sort By</h3>
                        <select
                            className="catalog-sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            {/* <option value="popular">Most Popular</option> */}
                        </select>
                    </div>
                </aside>

                <section className="catalog-content">
                    <div className="catalog-toolbar glass">
                        <div className="results-count">
                            Showing <strong>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
                        </div>
                        <div className="view-toggles">
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loader"></div>
                            <p>Loading products...</p>
                        </div>
                    ) : error ? (
                        <div className="error-box">{error}</div>
                    ) : products.length === 0 ? (
                        <div className="empty-state glass">
                            <Search size={48} />
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search for something else.</p>
                            <button className="btn btn-primary" onClick={handleClearFilters}>Clear Filters</button>
                        </div>
                    ) : (
                        <div className={`product-grid ${viewMode}-view`}>
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Catalog;
