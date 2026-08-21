import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wifi, Battery, Signal } from 'lucide-react';
import { MobileTabNav } from './MobileTabNav';

export const MobileAppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState('');

  // Format current time as HH:MM
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine if we should show the bottom tab navigation.
  // We only show it on main mobile pages: /mobile, /mobile/shop, /mobile/wishlist, /mobile/account
  const showTabNav = [
    '/mobile',
    '/mobile/',
    '/mobile/shop',
    '/mobile/wishlist',
    '/mobile/account'
  ].includes(location.pathname);

  return (
    <div style={styles.outerContainer} className="mobile-outer-container">
      {/* Desktop side panel helper to quickly switch or see info */}
      <div style={styles.desktopInfoPanel} className="mobile-desktop-panel">
        <div style={styles.badge}>MOBILE APP MODE</div>
        <h2 style={styles.panelTitle}>Freshio Mobile</h2>
        <p style={styles.panelDesc}>
          You are viewing the simulated mobile app version of Freshio. On screens under 768px wide, this frame automatically melts away for a native mobile experience.
        </p>
        <div style={styles.linkList}>
          <button onClick={() => navigate('/')} style={styles.linkBtnOutline}>
            Switch to Desktop Web
          </button>
        </div>
      </div>

      {/* Phone Mockup Frame Container */}
      <div style={styles.phoneFrame} className="mobile-phone-frame">
        {/* Physical buttons on the mockup */}
        <div style={styles.volumeUp} />
        <div style={styles.volumeDown} />
        <div style={styles.powerBtn} />

        {/* Inner Phone Screen */}
        <div style={styles.phoneScreen} className="mobile-phone-screen">
          {/* Status Bar */}
          <div style={styles.statusBar} className="mobile-status-bar">
            <span style={styles.timeLabel}>{time || '09:41'}</span>

            {/* Dynamic Island Area */}
            <div style={styles.dynamicIsland}>
              <div style={styles.dynamicIslandCamera} />
            </div>

            <div style={styles.statusIcons}>
              <Signal size={12} strokeWidth={2.5} />
              <Wifi size={12} strokeWidth={2.5} />
              <Battery size={16} strokeWidth={2.5} style={styles.batteryIcon} />
            </div>
          </div>

          {/* Scrollable Viewport / Content */}
          <div style={{
            ...styles.viewportContent,
            paddingBottom: showTabNav ? '80px' : '0px'
          }}>
            {children}
          </div>

          {/* Mobile Bottom Tab Navigation */}
          {showTabNav && <MobileTabNav />}

          {/* Physical Home Indicator */}
          <div style={styles.homeIndicator} className="mobile-home-indicator" />
        </div>
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

  // Phone Frame styles
  phoneFrame: {
    position: 'relative',
    width: '390px',
    height: '844px',
    borderRadius: '50px',
    backgroundColor: '#000000',
    padding: '12px', // Bezel thickness
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    flexShrink: 0,
    boxSizing: 'border-box',
    border: '4px solid #333333',
  },
  // Physical buttons
  volumeUp: {
    position: 'absolute',
    left: '-6px',
    top: '180px',
    width: '6px',
    height: '60px',
    backgroundColor: '#1c1c1e',
    borderRadius: '4px 0 0 4px',
  },
  volumeDown: {
    position: 'absolute',
    left: '-6px',
    top: '255px',
    width: '6px',
    height: '60px',
    backgroundColor: '#1c1c1e',
    borderRadius: '4px 0 0 4px',
  },
  powerBtn: {
    position: 'absolute',
    right: '-6px',
    top: '215px',
    width: '6px',
    height: '80px',
    backgroundColor: '#1c1c1e',
    borderRadius: '0 4px 4px 0',
  },

  // Screen
  phoneScreen: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-bg)',
    borderRadius: '38px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
  },
  statusBar: {
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontSize: '13px',
    fontWeight: '600',
    zIndex: 1001,
    position: 'relative',
    userSelect: 'none',
  },
  timeLabel: {
    width: '40px',
    textAlign: 'left',
  },
  dynamicIsland: {
    width: '100px',
    height: '26px',
    backgroundColor: '#000000',
    borderRadius: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '8px',
  },
  dynamicIslandCamera: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#0c0f24',
    border: '1px solid #1a1a2e',
  },
  statusIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '50px',
    justifyContent: 'flex-end',
  },
  batteryIcon: {
    transform: 'rotate(0deg)',
    marginLeft: '2px',
  },
  viewportContent: {
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: 'var(--color-bg)',
    width: '100%',
    height: 'calc(100% - 44px)',
    boxSizing: 'border-box',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '134px',
    height: '5px',
    backgroundColor: '#000000',
    borderRadius: '100px',
    zIndex: 1000,
    opacity: 0.5,
    pointerEvents: 'none',
  }
};

// Insert CSS for responsive phone frame styling
if (typeof document !== 'undefined') {
  const styleId = 'mobile-layout-styles';
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = `
      @media (max-width: 768px) {
        .mobile-outer-container {
          padding: 0 !important;
          background: var(--color-bg) !important;
          gap: 0 !important;
        }
        .mobile-desktop-panel {
          display: none !important;
        }
        .mobile-phone-frame {
          width: 100vw !important;
          height: 100vh !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          border: none !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .mobile-phone-screen {
          border-radius: 0 !important;
          height: 100vh !important;
        }
        .mobile-home-indicator {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

export default MobileAppLayout;
