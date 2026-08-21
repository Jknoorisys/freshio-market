import React, { useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/mockData';
import { Sparkles, Star } from 'lucide-react';

export const FreshPicks = () => {
  // Filter products matching top-rated criteria (rating >= 4.8)
  const premiumPicks = useMemo(() => {
    return PRODUCTS.filter(p => p.rating >= 4.8);
  }, []);

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Header Banner */}
        <div style={styles.banner}>
          <div style={styles.badgeRow}>
            <Star size={12} fill="#FFCC00" color="#FFCC00" />
            <span>EDITORIAL CHOICE</span>
          </div>
          <h1 style={styles.title}>Kigali's Fresh Picks</h1>
          <p style={styles.desc}>
            Our weekly compilation of highest-rated organic whole foods, volcanic Irish potatoes, and fresh farm milks, reviewed and loved by Kigali shoppers.
          </p>
        </div>

        {/* Product Catalog Grid */}
        <div style={styles.grid}>
          {premiumPicks.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
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
    backgroundImage: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #157A4C 100%)',
    borderRadius: '24px',
    padding: '40px',
    color: '#FFFFFF',
    marginBottom: '40px',
    boxShadow: '0 8px 24px rgba(22, 58, 53, 0.05)',
  },
  badgeRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.15)',
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
    lineHeight: '1.5',
    maxWidth: '640px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
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
};
export default FreshPicks;
