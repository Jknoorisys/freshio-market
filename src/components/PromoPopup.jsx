import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Send } from 'lucide-react';

export const PromoPopup = () => {
  const { promoDismissed, dismissPromo, subscribeNewsletter } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (promoDismissed) return;

    // Show popup after 4 seconds delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [promoDismissed]);

  if (!isOpen || promoDismissed) return null;

  const handleClose = () => {
    setIsOpen(false);
    dismissPromo();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subscribeNewsletter(email)) {
      setIsOpen(false);
      dismissPromo();
    }
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Left Side: Illustrative Block */}
        <div style={styles.promoImageSide}>
          <div style={styles.badgeContainer}>
            <Sparkles size={16} style={{ marginRight: '6px' }} />
            <span>EXCLUSIVELY FOR YOU</span>
          </div>
          <h2 style={styles.promoImageTitle}>Freshness Sourced Daily.</h2>
          <p style={styles.promoImageDesc}>Everyday essentials at wholesale prices.</p>
        </div>

        {/* Right Side: Action form */}
        <div style={styles.formSide}>
          <button style={styles.closeBtn} onClick={handleClose}>
            <X size={18} />
          </button>
          
          <div style={styles.discountBadge}>🎉 2,000 RWF OFF</div>
          
          <h3 style={styles.title}>Unlock Your First Deal!</h3>
          <p style={styles.desc}>
            Join the Freshio newsletter today and get **2,000 RWF OFF** your first order, plus members-only flash deals and healthy cooking tips!
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={{
                ...styles.inputContainer,
                borderColor: isFocused ? 'var(--color-primary)' : 'var(--color-border)',
                boxShadow: isFocused ? '0 0 0 3px rgba(39, 158, 83, 0.1)' : 'none',
              }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                  style={styles.input}
                />
              </div>
            <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
              Claim Offer
              <Send size={16} style={{ marginLeft: '8px' }} />
            </button>
          </form>

          <button onClick={handleClose} style={styles.noThanksBtn}>
            No thanks, I want to pay full price
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 37, 31, 0.5)',
    backdropFilter: 'blur(5px)',
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    boxShadow: '0 25px 60px rgba(8, 122, 75, 0.15)',
    width: '100%',
    maxWidth: '750px',
    height: '420px',
    display: 'flex',
    overflow: 'hidden',
    animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    position: 'relative',
  },
  promoImageSide: {
    width: '42%',
    backgroundColor: 'var(--color-primary-dark)',
    backgroundImage: `linear-gradient(135deg, rgba(32,184,107,0.3) 0%, rgba(8,122,75,0.8) 100%), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '32px 24px',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  badgeContainer: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-primary-dark)',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '800',
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    marginBottom: '16px',
  },
  promoImageTitle: {
    fontSize: '22px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '8px',
  },
  promoImageDesc: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
  },
  formSide: {
    width: '58%',
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '50%',
    backgroundColor: '#F3F6F4',
    transition: 'background-color 0.2s',
  },
  discountBadge: {
    backgroundColor: 'var(--color-orange-light)',
    color: 'var(--color-orange)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '800',
    width: 'fit-content',
    marginBottom: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '8px',
  },
  desc: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
  },
  inputContainer: {
    border: '2px solid var(--color-border)',
    borderRadius: '12px',
    backgroundColor: '#FFFDFB',
    padding: '0 16px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  input: {
    width: '100%',
    height: '42px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    outline: 'none',
    background: 'transparent',
  },
  submitBtn: {
    height: '44px',
    borderRadius: '12px',
    width: '100%',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(32, 184, 107, 0.15)',
  },
  noThanksBtn: {
    marginTop: '16px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    textDecoration: 'underline',
    alignSelf: 'center',
    cursor: 'pointer',
  },
};
export default PromoPopup;
