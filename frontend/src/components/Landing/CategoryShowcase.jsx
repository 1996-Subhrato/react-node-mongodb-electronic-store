import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './CategoryShowcase.css';
import { ArrowRight } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BACKEND_URL}${url}`;
};

const CategoryShowcase = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await api.get('/products/categories');
                setCategories(data.slice(0, 4)); // Only top 4 for showcase
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <section className="category-showcase container">
            <div className="section-header-centered">
                <span className="section-subtitle">Curated Selection</span>
                <h2>Shop by Category</h2>
                <div className="header-line"></div>
            </div>

            <div className="category-grid-landing">
                {categories.map((cat, index) => (
                    <Link to={`/products?category=${cat.id}`} key={cat.id} className="category-card-landing glass animate-on-scroll" style={{animationDelay: `${index * 0.1}s`}}>
                        <div className="category-img-wrapper">
                            <img src={getFullImageUrl(cat.image_url) || `https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=300&u=${index}`} alt={cat.name} />
                        </div>
                        <div className="category-overlay-content">
                            <h3>{cat.name}</h3>
                            <span className="explore-link">Explore Collection <ArrowRight size={16} /></span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryShowcase;
