import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/mockData';
import { Sparkles, Timer, Percent, ArrowRight } from 'lucide-react';

export const Deals = () => {
  const navigate = useNavigate();

  // Simulate deal expiration countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products on discount
  const dealProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.discount > 0);
  }, []);

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Banner Header */}
        <div style={styles.banner}>
          <div style={styles.bannerInfo}>
            <div style={styles.badgeRow}>
              <Percent size={14} />
              <span>FLASH SALES</span>
            </div>
            <h1 style={styles.title}>Weekly Discounts</h1>
            <p style={styles.desc}>Save big on local favorites from Inyange and Masaka. Harvested fresh, priced friendly.</p>
          </div>

          <div style={styles.timerBlock}>
            <span style={styles.timerLabel}><Timer size={14} /> Offers Expire In:</span>
            <div style={styles.digits}>
              <div style={styles.digitCol}>
                <span style={styles.digitVal}>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span style={styles.digitLabel}>Hrs</span>
              </div>
              <span style={styles.colon}>:</span>
              <div style={styles.digitCol}>
                <span style={styles.digitVal}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span style={styles.digitLabel}>Mins</span>
              </div>
              <span style={styles.colon}>:</span>
              <div style={styles.digitCol}>
                <span style={styles.digitVal}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span style={styles.digitLabel}>Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div style={styles.grid}>
          {dealProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Loyalty Program Link */}
        <div style={styles.loyaltyPromo}>
          <div style={styles.loyaltyMeta}>
            <Sparkles size={24} color="var(--color-primary-dark)" />
            <div>
              <h3 style={styles.loyaltyTitle}>Want even bigger savings?</h3>
              <p style={styles.loyaltyDesc}>Join Freshio+ for 2,999 RWF/month to unlock up to 40% off member exclusive items.</p>
            </div>
          </div>
          <button onClick={() => navigate('/account')} style={styles.joinBtn} className="btn btn-primary">
            Join Freshio+ <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '40px 0 80px 0',
  },
  banner: {
    backgroundImage: 'linear-gradient(135deg, #FF5A5F 0%, #D83B41 100%)',
    borderRadius: '24px',
    padding: '40px',
    color: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '24px',
    boxShadow: '0 8px 24px rgba(216, 59, 65, 0.08)',
  },
  bannerInfo: {
    maxWidth: '540px',
  },
  badgeRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '800',
    marginBottom: '10px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: '12px',
  },
  desc: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: '1.4',
  },
  timerBlock: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: '20px 24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  timerLabel: {
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: 'rgba(255,255,255,0.8)',
  },
  digits: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  digitCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  digitVal: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  digitLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  colon: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    paddingBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '48px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
  loyaltyPromo: {
    backgroundColor: 'var(--color-primary-light)',
    border: '1.5px solid var(--color-primary)',
    borderRadius: '20px',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  loyaltyMeta: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  loyaltyTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '4px',
  },
  loyaltyDesc: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
  },
  joinBtn: {
    padding: '10px 24px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
};
export default Deals;
