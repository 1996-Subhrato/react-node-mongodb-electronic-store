import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Sparkles, ArrowRight, Play } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-landing">
            <div className="hero-background-effects">
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
                <div className="grid-overlay"></div>
            </div>

            <div className="container hero-content-wrapper">
                <div className="hero-text-center animate-slide-up">
                    <div className="hero-badge-container">
                        <span className="hero-premium-badge">
                            <Sparkles size={14} /> Next-Gen Technology
                        </span>
                    </div>

                    <h1 className="hero-main-title">
                        Elevate Your Digital <br />
                        <span className="hero-title-gradient">Lifestyle Experience</span>
                    </h1>

                    <p className="hero-subtitle">
                        Discover the future of gadgets with TechZone. Premium smartphones,
                        high-performance laptops, and elite audio gear—all in one place.
                    </p>

                    <div className="hero-cta-group">
                        <Link to="/products" className="btn btn-primary btn-hero">
                            Explore Catalog <ArrowRight size={18} />
                        </Link>
                        <Link to="/ai-assistant" className="btn btn-outline-white btn-hero">
                            <Play size={16} fill="white" /> Consult AI Advisor
                        </Link>
                    </div>

                    <div className="hero-trust-row">
                        <div className="trust-item">
                            <ShieldCheck size={20} />
                            <span>Official Warranty</span>
                        </div>
                        <div className="trust-divider"></div>
                        <div className="trust-item">
                            <Zap size={20} />
                            <span>Express Delivery</span>
                        </div>
                        <div className="trust-divider"></div>
                        <div className="trust-item">
                            <div className="user-avatars">
                                <img src="https://i.pravatar.cc/32?u=1" alt="User" />
                                <img src="https://i.pravatar.cc/32?u=2" alt="User" />
                                <img src="https://i.pravatar.cc/32?u=3" alt="User" />
                            </div>
                            <span>50k+ Happy Users</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual-center animate-fade-in-up">
                    <div className="visual-container">
                        {/* <img
                            src="/images/products/macbook-air-m2.png"
                            alt="Premium MacBook"
                            className="main-hero-device device-laptop"
                        /> */}
                        {/* <img 
                            src="/images/products/iphone-15-pro.png" 
                            alt="iPhone 15 Pro" 
                            className="main-hero-device device-phone" 
                        /> */}

                        {/* Floating elements */}
                        {/* <div className="floating-element feat-1 glass">
                            <Zap size={16} className="text-primary" />
                            <span>M2 Chip Performance</span>
                        </div>
                        <div className="floating-element feat-2 glass">
                            <Sparkles size={16} className="text-secondary" />
                            <span>ProMotion Display</span>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="hero-scroll-down">
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
