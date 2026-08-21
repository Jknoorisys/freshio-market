import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, X } from 'lucide-react';

export const CookieConsent = () => {
  const { cookieAccepted, acceptCookies } = useApp();

  if (cookieAccepted) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.content}>
        <div style={styles.iconContainer}>
          <Shield size={20} color="var(--color-primary-dark)" />
        </div>
        <p style={styles.text}>
          Freshio uses cookies to customize and improve your shopping experience. By continuing, you agree to our cookie policy.
        </p>
      </div>
      <div style={styles.actions}>
        <button onClick={acceptCookies} className="btn btn-primary" style={styles.btn}>
          Accept All
        </button>
        <button onClick={acceptCookies} className="btn btn-outline" style={styles.btnOutline}>
          Manage
        </button>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    position: 'fixed',
    bottom: '24px',
    left: '24px',
    right: '24px',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--color-border)',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(23, 37, 31, 0.1)',
    zIndex: 999,
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    animation: 'fadeInUp 0.4s ease-out',
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: '1 1 500px',
  },
  iconContainer: {
    backgroundColor: 'var(--color-primary-light)',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexShrink: 0,
  },
  btn: {
    padding: '10px 20px',
    fontSize: '13px',
  },
  btnOutline: {
    padding: '8px 18px',
    fontSize: '13px',
  },
};

// Responsive handling for smaller screens
const mobileMedia = `@media (max-width: 768px) {
  .cookie-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}`;

export default CookieConsent;
