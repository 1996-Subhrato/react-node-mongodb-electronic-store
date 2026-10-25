import React from 'react';
import { Send } from 'lucide-react';
import './Newsletter.css';

const Newsletter = () => {
    return (
        <section className="newsletter-landing">
            <div className="container newsletter-container glass">
                <div className="newsletter-content">
                    <h2>Get Exclusive Tech Deals <br />Straight to Your Inbox</h2>
                    <p>Subscribe to be the first to know about new arrivals, flash sales, and AI-curated product picks.</p>
                </div>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="input-group-landing">
                        <input type="email" placeholder="Enter your email address" required />
                        <button type="submit" className="btn btn-primary">
                            Subscribe <Send size={18} />
                        </button>
                    </div>
                    <p className="privacy-note">We respect your privacy. Unsubscribe at any time.</p>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
