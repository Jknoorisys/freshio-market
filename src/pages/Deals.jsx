import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/mockData';
import { Sparkles, Timer, Percent, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 32;

export const Deals = () => {
  const navigate = useNavigate();
  const styles = useResponsiveStyles(rawStyles);
  const [currentPage, setCurrentPage] = useState(1);

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
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products on discount or marked as deals
  const dealProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.discount > 0 || p.isDeal || (Array.isArray(p.tags) && (p.tags.includes('deal') || p.tags.includes('sale') || p.tags.includes('bestseller'))));
  }, []);

  const totalPages = Math.ceil(dealProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return dealProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [dealProducts, currentPage]);

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Banner Header */}
        <div style={styles.banner}>
          <div style={styles.bannerInfo}>
            <div style={styles.badgeRow}>
              <Percent size={14} />
              <span>SAWA CITI WEEKLY SAVINGS</span>
            </div>
            <h1 style={styles.title}>Weekly Discounts &amp; Deals</h1>
            <p style={styles.desc}>
              Save big on daily essentials across all 8 Sawa Citi branches in Kigali. Stock up on grains, pantry favorites, beverages, and household goods.
            </p>
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
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.paginationRow}>
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{ ...styles.pageNavBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={18} /> Prev
            </button>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{ ...styles.pageNavBtn, opacity: currentPage === totalPages ? 0.4 : 1 }}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Loyalty Program Link */}
        <div style={styles.loyaltyPromo}>
          <div style={styles.loyaltyMeta}>
            <Sparkles size={24} color="var(--color-primary-dark)" />
            <div>
              <h3 style={styles.loyaltyTitle}>Want even bigger savings?</h3>
              <p style={styles.loyaltyDesc}>Join Freshio+ for 2,999 RWF/month to unlock unlimited free delivery across Kigali.</p>
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

const rawStyles = {
  page: {
    padding: '32px 0 80px 0',
    '@media (max-width: 768px)': {
      padding: '16px 0 40px 0',
    }
  },
  banner: {
    backgroundImage: 'linear-gradient(135deg, #FF5A5F 0%, #D83B41 100%)',
    borderRadius: '24px',
    padding: '36px',
    color: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
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
    '@media (max-width: 768px)': {
      fontSize: '24px',
    }
  },
  desc: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: '1.5',
  },
  timerBlock: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: '18px 22px',
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
    color: 'rgba(255,255,255,0.85)',
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
    fontSize: '26px',
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
    fontSize: '22px',
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    paddingBottom: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '18px',
    marginBottom: '32px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '14px',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
    }
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0 32px 0',
  },
  pageNavBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    backgroundColor: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text)',
    cursor: 'pointer',
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
