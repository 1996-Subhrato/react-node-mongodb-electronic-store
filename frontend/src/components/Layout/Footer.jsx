import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Camera, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand-logo footer-logo-link">
            <span className="logo-text">TechZone</span>
          </Link>
          <p className="footer-mission">
            Your one-stop destination for the latest electronics and gadgets. We combine cutting-edge technology with AI-powered recommendations to help you find the perfect device.
          </p>
          <div className="social-links-premium">
            <a href="#" className="social-icon"><Globe size={20} /></a>
            <a href="#" className="social-icon"><Camera size={20} /></a>
            <a href="#" className="social-icon"><MessageCircle size={20} /></a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Marketplace</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=1">Smartphones</Link></li>
            <li><Link to="/products?category=2">Laptops</Link></li>
            <li><Link to="/products?category=3">Headphones</Link></li>
            <li><Link to="/products?category=4">Smart Watches</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/track-order">Track Your Order</Link></li>
            <li><Link to="/shipping">Shipping Policy</Link></li>
            <li><Link to="/faq">Product FAQs</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/impact">Tech Partners</Link></li>
            <li><Link to="/careers">Join the Team</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom-premium">
        <div className="container bottom-flex">
          <p>&copy; 2026 TechZone. Engineered for Tech Enthusiasts.</p>
          {/* <div className="payment-icons">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" height="20" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" height="20" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" height="20" />
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
