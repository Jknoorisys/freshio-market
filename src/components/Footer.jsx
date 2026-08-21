import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { Send, Mail, Phone, MapPin, Clock } from 'lucide-react';

export const Footer = () => {
  const { newsletterSubscribed, subscribeNewsletter } = useApp();
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      subscribeNewsletter(email.trim());
      setEmail('');
    }
  };

  return (
    <footer style={styles.footer}>

      {/* NEWSLETTER BANNER */}
      <div style={styles.newsletterSection}>
        <div className="container" style={styles.newsletterContainer}>
          <div style={styles.newsletterText}>
            <div style={styles.newsletterBadge}>📬 NEWSLETTER</div>
            <h3 style={styles.newsletterTitle}>Fresh deals, straight to your inbox</h3>
            <p style={styles.newsletterSubtitle}>Exclusive weekly discounts &amp; organic lifestyle tips for Kigali.</p>
          </div>
          {newsletterSubscribed ? (
            <div style={styles.newsletterSuccess}>
              🎉 <strong>You're in!</strong> Fresh deals are on their way.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.newsletterForm}>
              <div style={{
                ...styles.inputWrapper,
                border: isFocused ? '1.5px solid var(--color-primary)' : '1.5px solid rgba(255,255,255,0.1)',
                backgroundColor: isFocused ? '#192b23' : '#1e3229',
              }}>
                <Mail size={17} color="#5A8A72" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input
                  type="email"
                  placeholder="Enter your email address…"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                  style={styles.input}
                />
              </div>
              <button type="submit" className="footer-newsletter-btn">
                Subscribe <Send size={14} style={{ marginLeft: '6px' }} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div style={styles.mainFooter}>
        <div className="container" style={styles.footerGrid}>

          {/* Col 0: Logo + Brand */}
          <div style={styles.logoCol}>
            <Logo variant="green" height={48} showTagline={true} />
            <p style={styles.brandDesc}>
              Farm-fresh produce, everyday essentials, and organic choices delivered daily to your doorstep across Kigali, Rwanda.
            </p>
            <div style={styles.socialsList}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="TikTok">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.41-.43-.6-.67-.02 3.25-.01 6.5-.01 9.75-.15 2.15-1.16 4.26-2.92 5.56-1.92 1.48-4.57 1.95-6.93 1.34-2.45-.61-4.53-2.47-5.32-4.88-.93-2.69-.37-5.91 1.59-8.08 1.76-2.02 4.6-2.93 7.15-2.28.01 1.43.02 2.85.01 4.28-1.42-.42-3.03-.09-4.08.97-1.12 1.1-.96 3.12.35 4.09 1.15.89 2.92.74 3.86-.48.33-.41.48-.93.49-1.45V.02z" />
                </svg>
              </a>
            </div>
            {/* MTN MoMo Trust Badge */}
            <div style={styles.trustBadge}>
              <span style={styles.trustBadgeText}>🔒 Secure Payments via MTN MoMo</span>
            </div>
          </div>

          {/* Col 1: Shop */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Shop</h4>
            <ul style={styles.linkList}>
              <li><Link to="/shop" className="footer-nav-link">All Products (4,600+)</Link></li>
              <li><Link to="/category/groceries" className="footer-nav-link">🛒 Groceries</Link></li>
              <li><Link to="/category/fresh-produce" className="footer-nav-link">🥬 Fresh Produce</Link></li>
              <li><Link to="/category/meat-fish" className="footer-nav-link">🍗 Meat &amp; Fish</Link></li>
              <li><Link to="/category/beverages" className="footer-nav-link">🥤 Beverages</Link></li>
              <li><Link to="/category/wines-spirits" className="footer-nav-link">🍷 Wines &amp; Spirits</Link></li>
              <li><Link to="/category/dairy" className="footer-nav-link">🧀 Dairy &amp; Frozen</Link></li>
              <li><Link to="/deals" className="footer-nav-link">🏷️ Weekly Deals</Link></li>
            </ul>
          </div>

          {/* Col 2: Company */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Freshio</h4>
            <ul style={styles.linkList}>
              <li><Link to="/about" className="footer-nav-link">About Us</Link></li>
              <li><Link to="/stores" className="footer-nav-link">Our Stores</Link></li>
              <li><Link to="/sustainability" className="footer-nav-link">Sustainability</Link></li>
              <li><a href="#careers" className="footer-nav-link">Careers</a></li>
              <li><Link to="/contact" className="footer-nav-link">Contact Us</Link></li>
              <li><Link to="/fresh-picks" className="footer-nav-link">Fresh Picks Blog</Link></li>
            </ul>
          </div>

          {/* Col 3: Help */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Help</h4>
            <ul style={styles.linkList}>
              <li><Link to="/faq" className="footer-nav-link">FAQs</Link></li>
              <li><a href="#delivery" className="footer-nav-link">Delivery Info</a></li>
              <li><a href="#returns" className="footer-nav-link">Returns &amp; Refunds</a></li>
              <li><a href="#payments" className="footer-nav-link">Payment Options</a></li>
              <li><a href="#privacy" className="footer-nav-link">Privacy Policy</a></li>
              <li><a href="#terms" className="footer-nav-link">Terms &amp; Conditions</a></li>
            </ul>
          </div>

          {/* Col 4: Contact + App */}
          <div style={styles.linkCol}>
            <h4 style={styles.colTitle}>Support</h4>
            <div style={styles.supportInfo}>
              <div style={styles.supportItem}>
                <Phone size={15} color="var(--color-primary)" style={styles.supportIcon} />
                <div>
                  <span style={styles.supportLabel}>Call Us (9AM–9PM)</span>
                  <a href="tel:+250788000000" className="footer-support-value">+250 788 000 000</a>
                </div>
              </div>
              <div style={styles.supportItem}>
                <Mail size={15} color="var(--color-primary)" style={styles.supportIcon} />
                <div>
                  <span style={styles.supportLabel}>Email Support</span>
                  <a href="mailto:hello@freshio.rw" className="footer-support-value">hello@freshio.rw</a>
                </div>
              </div>
              <div style={styles.supportItem}>
                <Clock size={15} color="var(--color-primary)" style={styles.supportIcon} />
                <div>
                  <span style={styles.supportLabel}>Working Hours</span>
                  <span style={styles.supportValueText}>Everyday 07:00 AM – 11:00 PM</span>
                </div>
              </div>
              <div style={styles.supportItem}>
                <MapPin size={15} color="var(--color-primary)" style={styles.supportIcon} />
                <div>
                  <span style={styles.supportLabel}>Head Office</span>
                  <span style={styles.supportValueText}>KN 5 Rd, Kiyovu, Kigali</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={styles.bottomBar}>
        <div className="container" style={styles.bottomContainer}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} Freshio Market Ltd, Kigali, Rwanda. All rights reserved.
          </p>
          <div style={styles.paymentMethods}>
            <span style={styles.payChip}>MTN MoMo</span>
            <span style={styles.payChip}>Airtel Money</span>
            <span style={styles.payChip}>Visa</span>
            <span style={styles.payChip}>Mastercard</span>
            <span style={{ ...styles.payChip, backgroundColor: 'rgba(39,174,96,0.2)', color: '#20B86B' }}>🛡️ Secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#12201A',
    color: '#D8EAE2',
    marginTop: '64px',
  },
  /* NEWSLETTER */
  newsletterSection: {
    background: 'linear-gradient(135deg, #163A35 0%, #1E4D3A 100%)',
    padding: '48px 0',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  newsletterContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '28px',
  },
  newsletterText: { flex: '1 1 380px' },
  newsletterBadge: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '8px',
  },
  newsletterTitle: {
    fontSize: '24px',
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: '6px',
    lineHeight: '1.2',
  },
  newsletterSubtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: '1.5',
  },
  newsletterForm: {
    display: 'flex',
    gap: '10px',
    flex: '1 1 350px',
    maxWidth: '480px',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '12px',
    padding: '0 16px',
    flexGrow: 1,
    transition: 'all 0.2s',
  },
  input: {
    width: '100%',
    height: '48px',
    fontSize: '14px',
    color: '#FFFFFF',
    fontWeight: '500',
    border: 'none',
    outline: 'none',
    background: 'transparent',
  },
  subscribeBtn: {
    borderRadius: '12px',
    padding: '0 24px',
    fontSize: '14px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  newsletterSuccess: {
    backgroundColor: 'rgba(32, 184, 107, 0.15)',
    border: '1px solid var(--color-primary)',
    color: '#20B86B',
    padding: '14px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
  },
  /* MAIN FOOTER */
  mainFooter: { padding: '56px 0 48px' },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.9fr 1.1fr',
    gap: '40px',
  },
  logoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    alignItems: 'flex-start',
  },
  brandDesc: {
    fontSize: '13.5px',
    color: 'rgba(216,234,226,0.65)',
    lineHeight: '1.65',
    maxWidth: '260px',
  },
  socialsList: { display: 'flex', gap: '8px' },
  socialLink: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: 'rgba(255,255,255,0.7)',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  trustBadge: {
    backgroundColor: 'rgba(32,184,107,0.1)',
    border: '1px solid rgba(32,184,107,0.25)',
    borderRadius: '10px',
    padding: '8px 14px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  trustBadgeText: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#20B86B',
  },
  linkCol: { display: 'flex', flexDirection: 'column' },
  colTitle: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    marginBottom: '18px',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  linkList: { display: 'flex', flexDirection: 'column', gap: '9px' },
  link: {
    fontSize: '13.5px',
    color: 'rgba(216,234,226,0.6)',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  supportInfo: { display: 'flex', flexDirection: 'column', gap: '16px' },
  supportItem: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  supportIcon: { marginTop: '3px', flexShrink: 0 },
  supportLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'rgba(216,234,226,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
  },
  supportValue: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#FFFFFF',
    display: 'block',
    marginTop: '2px',
    textDecoration: 'none',
  },
  supportValueText: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    display: 'block',
    marginTop: '2px',
  },
  /* BOTTOM BAR */
  bottomBar: {
    backgroundColor: '#0A1510',
    padding: '20px 0',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  bottomContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  copyright: {
    fontSize: '12.5px',
    color: 'rgba(255,255,255,0.35)',
    margin: 0,
  },
  paymentMethods: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
  payChip: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  // legacy kept for compat
  paymentIcons: { display: 'flex', gap: '12px' },
  securityText: { fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600' },
};

export default Footer;
