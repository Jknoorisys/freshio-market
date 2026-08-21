import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Tag, Heart, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist } = useApp();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="mobile-bottom-nav" style={styles.navBar}>
      <button
        onClick={() => navigate('/')}
        style={{
          ...styles.navItem,
          color: isActive('/') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        }}
      >
        <Home size={20} />
        <span style={styles.navLabel}>Home</span>
      </button>

      <button
        onClick={() => navigate('/shop')}
        style={{
          ...styles.navItem,
          color: isActive('/shop') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        }}
      >
        <ShoppingBag size={20} />
        <span style={styles.navLabel}>Shop</span>
      </button>

      <button
        onClick={() => navigate('/deals')}
        style={{
          ...styles.navItem,
          color: isActive('/deals') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        }}
      >
        <Tag size={20} />
        <span style={styles.navLabel}>Deals</span>
      </button>

      <button
        onClick={() => navigate('/account/wishlist')}
        style={{
          ...styles.navItem,
          color: isActive('/account/wishlist') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        }}
      >
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <Heart size={20} />
          {wishlist.length > 0 && <span style={styles.badgeDot} />}
        </div>
        <span style={styles.navLabel}>Wishlist</span>
      </button>

      <button
        onClick={() => navigate('/account')}
        style={{
          ...styles.navItem,
          color: location.pathname.startsWith('/account') && !isActive('/account/wishlist') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        }}
      >
        <User size={20} />
        <span style={styles.navLabel}>Account</span>
      </button>
    </div>
  );
};

const styles = {
  navBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid var(--color-border)',
    boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.04)',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 800,
    paddingBottom: 'env(safe-area-inset-bottom)', // Support notch iPhones
    // Note: Desktop hiding is done in CSS via media queries or JS. We can specify it in inline display.
    // We will apply viewport styles in class or custom element if needed, but we can also set inline hide logic or write media query.
    // Let's add standard responsive inline styling based on window size inside the component, or rely on index.css.
    // We can write media query rules inside index.css for mobile-nav, which is safer.
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '20%',
    height: '100%',
    transition: 'color 0.2s',
  },
  navLabel: {
    fontSize: '11px',
    fontWeight: '700',
  },
  badgeDot: {
    position: 'absolute',
    top: '-2px',
    right: '-4px',
    width: '7px',
    height: '7px',
    backgroundColor: 'var(--color-error)',
    borderRadius: '50%',
  },
};

export default MobileBottomNav;
