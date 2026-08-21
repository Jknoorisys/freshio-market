import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileTabNav } from './MobileTabNav';

export const MobileAppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Show bottom tab navigation only on main mobile pages
  const showTabNav = [
    '/mobile',
    '/mobile/',
    '/mobile/shop',
    '/mobile/wishlist',
    '/mobile/account'
  ].includes(location.pathname);

  return (
    <div style={styles.outerContainer} className="mobile-outer-container">

      {/* Desktop side panel – only visible on wide screens */}
      <div style={styles.desktopInfoPanel} className="mobile-desktop-panel">
        <div style={styles.badge}>MOBILE APP MODE</div>
        <h2 style={styles.panelTitle}>Freshio Mobile</h2>
        <p style={styles.panelDesc}>
          You're viewing the mobile app version of Freshio. On a real phone this opens fullscreen as a native app — no browser bar, no frame.
        </p>
        <div style={styles.linkList}>
          <button onClick={() => navigate('/')} style={styles.linkBtnOutline}>
            Switch to Desktop Web
          </button>
        </div>
      </div>

      {/* Phone screen wrapper – looks like a frame on desktop, fills screen on phone */}
      <div style={styles.phoneFrame} className="mobile-phone-frame">
        {/* Scrollable App Content */}
        <div className="mobile-viewport" style={styles.viewportContent}>
          {children}
        </div>

        {/* Bottom Tab Bar – natural flex footer, no absolute positioning */}
        {showTabNav && <MobileTabNav />}
      </div>

    </div>
  );
};

const styles = {
  outerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'radial-gradient(circle at 10% 20%, rgb(239, 246, 238) 0%, rgb(207, 230, 203) 90%)',
    padding: '40px 20px',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)',
    gap: '60px',
    overflow: 'auto',
  },

  desktopInfoPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '300px',
    color: 'var(--color-primary-dark)',
  },
  badge: {
    background: 'var(--color-primary)',
    color: '#FFF',
    fontSize: '11px',
    fontWeight: '800',
    padding: '6px 12px',
    borderRadius: '100px',
    letterSpacing: '1px',
    marginBottom: '16px',
    boxShadow: 'var(--shadow-sm)',
  },
  panelTitle: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '12px',
    lineHeight: '1.2',
  },
  panelDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  },
  linkBtnOutline: {
    padding: '12px 20px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--color-primary)',
    color: 'var(--color-primary)',
    fontWeight: '700',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'all 0.2s',
  },

  // Desktop: looks like a phone frame; Mobile: fills the full screen
  phoneFrame: {
    position: 'relative',
    width: '390px',
    height: '844px',
    borderRadius: '44px',
    backgroundColor: 'var(--color-bg)',
    boxShadow: '0 30px 60px -12px rgba(0,0,0,0.35), 0 0 0 8px #111, 0 0 0 10px #333',
    flexShrink: 0,
    boxSizing: 'border-box',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',  // children stack vertically: viewport grows, tab nav stays fixed
  },

  viewportContent: {
    flex: 1,               // fills all remaining space above the tab bar
    minHeight: 0,          // allows flex child to shrink properly
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: 'var(--color-bg)',
    width: '100%',
    boxSizing: 'border-box',
    WebkitOverflowScrolling: 'touch',
  },
};

// Responsive CSS: on real phones — fill the screen, no fake frame, use dynamic viewport height
if (typeof document !== 'undefined') {
  const styleId = 'mobile-layout-styles';
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = `
      @media (max-width: 768px) {
        /* Outer wrapper: plain white background, no padding */
        .mobile-outer-container {
          padding: 0 !important;
          background: var(--color-bg) !important;
          gap: 0 !important;
          min-height: 100dvh !important;
          align-items: stretch !important;
        }
        /* Hide desktop side panel on phones */
        .mobile-desktop-panel {
          display: none !important;
        }
        /* Phone frame becomes the full screen */
        .mobile-phone-frame {
          width: 100vw !important;
          height: 100dvh !important;
          max-height: 100dvh !important;
          border-radius: 0 !important;
          border: none !important;
          box-shadow: none !important;
          flex: 1 !important;
        }
        /* Viewport scrolls within the real phone's safe area */
        .mobile-viewport {
          height: calc(100dvh - 80px) !important;
          max-height: calc(100dvh - 80px) !important;
        }
      }

      /* Scrollbar hide for the viewport */
      .mobile-viewport::-webkit-scrollbar {
        display: none;
      }
      .mobile-viewport {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

export default MobileAppLayout;
