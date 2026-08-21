import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const MobileTabNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useApp();

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isActive = (path) => {
    if (path === '/mobile') {
      return location.pathname === '/mobile' || location.pathname === '/mobile/';
    }
    return location.pathname === path;
  };

  return (
    <nav style={styles.navBar} className="mobile-app-bottom-nav">
      <div style={styles.navContent}>
        <button
          onClick={() => navigate('/mobile')}
          style={{
            ...styles.navItem,
            color: isActive('/mobile') ? '#006b32' : '#3e4a3f',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>home</span>
          <span style={styles.navLabel}>Home</span>
        </button>

        <button
          onClick={() => navigate('/mobile/shop')}
          style={{
            ...styles.navItem,
            color: isActive('/mobile/shop') || location.pathname.startsWith('/mobile/category') ? '#006b32' : '#3e4a3f',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>grid_view</span>
          <span style={styles.navLabel}>Categories</span>
        </button>

        <button
          onClick={() => navigate('/mobile/cart')}
          style={{
            ...styles.navItem,
            color: isActive('/mobile/cart') ? '#006b32' : '#3e4a3f',
          }}
        >
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>shopping_basket</span>
            {getCartCount() > 0 && (
              <span style={styles.badgeCount}>{getCartCount()}</span>
            )}
          </div>
          <span style={styles.navLabel}>Cart</span>
        </button>

        <button
          onClick={() => navigate('/mobile/account')}
          style={{
            ...styles.navItem,
            color: isActive('/mobile/account') ? '#006b32' : '#3e4a3f',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>person</span>
          <span style={styles.navLabel}>Profile</span>
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(24px)',
    borderTop: 'none',
    boxShadow: '0 -1px 12px rgba(0, 0, 0, 0.05)',
    height: '80px',
    borderRadius: '24px 24px 0 0', // rounded-t-[24px]
    zIndex: 999,
    paddingBottom: 'env(safe-area-inset-bottom)',
    boxSizing: 'border-box',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding: '0 16px',
    boxSizing: 'border-box',
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
    width: '64px',
    height: '64px',
    transition: 'color 0.2s',
  },
  navLabel: {
    fontSize: '11px',
    fontWeight: '700',
  },
  badgeCount: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
    backgroundColor: '#FF5A5F', // error-red
    color: '#FFFFFF',
    fontSize: '9px',
    fontWeight: '800',
    padding: '2px 5px',
    borderRadius: '10px',
    minWidth: '12px',
    textAlign: 'center',
    border: '1.5px solid #FFFFFF',
  },
};

export default MobileTabNav;
