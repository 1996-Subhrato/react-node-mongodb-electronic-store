import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Zap, Search, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, admin, cartCount, logoutUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    if (admin) {
      await logoutAdmin();
      navigate('/admin/login');
    } else {
      await logoutUser();
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="logo-main">TechZone</span>
        </Link>

        {/* Global Search Bar */}
        <form className="nav-search-premium" onSubmit={handleSearch}>
          <Search size={18} className="search-icon-nav" />
          <input
            type="text"
            placeholder="Search phones, laptops, headphones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Desktop Navigation */}
        <div className="nav-links-premium">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Shop
          </NavLink>
          {/* <NavLink to="/ai-assistant" className="nav-link ai-link-nav">
             AI Assistant
          </NavLink> */}
        </div>

        {/* Action Icons */}
        <div className="nav-actions-premium">
          <Link to="/cart" className="action-icon-premium cart-trigger" title="Shopping Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge-premium">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-dropdown-trigger">
              <User size={22} className="action-icon-premium" />
              <div className="user-mini-menu glass">
                <span className="menu-user-name">Hi, {user.name}</span>
                <Link to="/profile">My Profile</Link>
                <button onClick={handleLogout} className="logout-link">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="action-icon-premium" title="Login">
              <User size={22} />
            </Link>
          )}

          <button
            className="mobile-toggle-premium"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
        <NavLink to="/products" onClick={() => setIsMobileMenuOpen(false)}>Shop</NavLink>
        <NavLink to="/ai-assistant" onClick={() => setIsMobileMenuOpen(false)}>AI Assistant</NavLink>
        {user ? (
          <>
            <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>My Profile</NavLink>
            <button onClick={handleLogout} className="mobile-logout">Logout</button>
          </>
        ) : (
          <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login / Register</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
