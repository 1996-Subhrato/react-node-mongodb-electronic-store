import React from 'react';
import Hero from '../../components/Landing/Hero';
import CategoryShowcase from '../../components/Landing/CategoryShowcase';
import FeaturedProducts from '../../components/Landing/FeaturedProducts';
import ValueProp from '../../components/Landing/ValueProp';
import AIHeroSection from '../../components/Landing/AIHeroSection';
import Newsletter from '../../components/Landing/Newsletter';
import './Home.css';

const Home = () => {
    return (
        <div className="landing-page-container">
            <Hero />
            
            <ValueProp />
            
            <CategoryShowcase />
            
            <AIHeroSection />
            
            <FeaturedProducts />
            

            
            <section className="testimonial-section-landing container">
                <div className="section-header-centered">
                    <span className="section-subtitle">Wall of Love</span>
                    <h2>Trusted by 50,000+ Tech Enthusiasts</h2>
                </div>
                
                <div className="testimonial-grid">
                    <div className="testimonial-card glass">
                        <div className="stars">★★★★★</div>
                        <p>"The iPhone I ordered arrived in perfect condition. TechZone's packaging and delivery speed is incredible!"</p>
                        <div className="tester">
                            <img src="https://i.pravatar.cc/150?u=a" alt="User" />
                            <div>
                                <strong>Aditi Sharma</strong>
                                <span>Verified Buyer</span>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card glass">
                        <div className="stars">★★★★★</div>
                        <p>"The AI assistant recommended the perfect laptop for my video editing needs. Spot-on suggestion!"</p>
                        <div className="tester">
                            <img src="https://i.pravatar.cc/150?u=b" alt="User" />
                            <div>
                                <strong>Rahul Verma</strong>
                                <span>Tech Reviewer</span>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card glass">
                        <div className="stars">★★★★★</div>
                        <p>"Got my Sony headphones at a fantastic price. Genuine product, super fast delivery. Highly recommended!"</p>
                        <div className="tester">
                            <img src="https://i.pravatar.cc/150?u=c" alt="User" />
                            <div>
                                <strong>Priya S.</strong>
                                <span>Daily Customer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <Newsletter />
        </div>
    );
};

export default Home;
