import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const MobileTabNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useApp();

  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) => {
    if (path === '/mobile') {
      return location.pathname === '/mobile' || location.pathname === '/mobile/';
    }
    return location.pathname === path;
  };

  const tabs = [
    { path: '/mobile',         icon: 'home',            label: 'Home' },
    { path: '/mobile/shop',    icon: 'grid_view',       label: 'Shop' },
    { path: '/mobile/cart',    icon: 'shopping_basket', label: 'Cart',    badge: getCartCount() },
    { path: '/mobile/wishlist',icon: 'favorite',        label: 'Saved' },
    { path: '/mobile/account', icon: 'person',          label: 'Profile' },
  ];

  return (
    <nav style={styles.navBar}>
      {tabs.map((tab) => {
        const active = isActive(tab.path) ||
          (tab.path === '/mobile/shop' && location.pathname.startsWith('/mobile/category'));
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{ ...styles.navItem, color: active ? '#2D9B51' : '#8a9a8b' }}
          >
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{
                fontSize: '24px',
                fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
              }}>
                {tab.icon}
              </span>
              {tab.badge > 0 && (
                <span style={styles.badge}>{tab.badge}</span>
              )}
            </div>
            <span style={{ ...styles.navLabel, fontWeight: active ? '800' : '600' }}>
              {tab.label}
            </span>
            {active && <div style={styles.activeDot} />}
          </button>
        );
      })}
    </nav>
  );
};

const styles = {
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '60px',
    flexShrink: 0,
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid rgba(0,0,0,0.07)',
    boxShadow: '0 -2px 16px rgba(0,0,0,0.06)',
    zIndex: 999,
    boxSizing: 'border-box',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    flex: 1,
    height: '100%',
    position: 'relative',
    transition: 'color 0.15s ease',
    padding: 0,
  },
  navLabel: {
    fontSize: '10px',
    lineHeight: 1,
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-8px',
    backgroundColor: '#FF5A5F',
    color: '#FFF',
    fontSize: '9px',
    fontWeight: '800',
    padding: '2px 4px',
    borderRadius: '10px',
    minWidth: '14px',
    textAlign: 'center',
    border: '1.5px solid #FFF',
  },
  activeDot: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '3px',
    backgroundColor: '#2D9B51',
    borderRadius: '0 0 4px 4px',
  },
};

export default MobileTabNav;
