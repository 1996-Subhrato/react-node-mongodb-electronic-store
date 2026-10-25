import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, MessageSquare, Sparkles, Cpu } from 'lucide-react';
import './AIHeroSection.css';

const AIHeroSection = () => {
    return (
        <section className="ai-hero-section containerr">
            <div className="container ai-hero-grid glass">
                <div className="ai-visual-side animate-fade-in">
                    <img 
                        src="/images/ai/ai_visual.png" 
                        alt="AI Product Assistant" 
                        className="ai-main-img"
                    />
                    <div className="ai-glow-effect"></div>
                </div>
                
                <div className="ai-content-side">
                    <span className="badge-ai"><Sparkles size={14} /> Only on TechZone</span>
                    <h2>Meet Your Personal <br /><span className="text-ai">AI Product Advisor</span></h2>
                    <p className="ai-desc">
                        Not sure which gadget to buy? Our AI assistant knows every product in our store 
                        and can instantly recommend the best smartphone, laptop, or accessory 
                        tailored to your budget and needs.
                    </p>
                    
                    <ul className="ai-features">
                        <li><MessageSquare size={18} /> Ask product &amp; compatibility questions</li>
                        <li><BrainCircuit size={18} /> Get personalized gadget recommendations</li>
                        <li><Cpu size={18} /> Compare specs &amp; find the best deals</li>
                    </ul>
                    
                    <div className="ai-cta-group">
                        <Link to="/ai-assistant" className="btn btn-primary btn-ai">
                            Try AI Assistant
                        </Link>
                        <span className="ai-status">
                            <span className="status-dot"></span> Online &amp; Ready
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIHeroSection;
