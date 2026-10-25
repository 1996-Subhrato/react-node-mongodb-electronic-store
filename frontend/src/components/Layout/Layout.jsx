import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content" style={{ minHeight: '80vh', paddingTop: 'var(--nav-height)' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
