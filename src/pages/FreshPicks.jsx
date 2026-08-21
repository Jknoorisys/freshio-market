import React, { useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/mockData';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 32;

export const FreshPicks = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products matching top-rated criteria or fresh tags
  const premiumPicks = useMemo(() => {
    return PRODUCTS.filter(p => (p.rating || 0) >= 4.7 || (Array.isArray(p.tags) && (p.tags.includes('fresh') || p.tags.includes('organic') || p.tags.includes('bestseller'))));
  }, []);

  const totalPages = Math.ceil(premiumPicks.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return premiumPicks.slice(start, start + ITEMS_PER_PAGE);
  }, [premiumPicks, currentPage]);

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Header Banner */}
        <div style={styles.banner}>
          <div style={styles.badgeRow}>
            <Star size={12} fill="#FFCC00" color="#FFCC00" />
            <span>SAWA CITI EDITORIAL PICKS</span>
          </div>
          <h1 style={styles.title}>Kigali's Fresh Picks</h1>
          <p style={styles.desc}>
            Our weekly compilation of highest-rated products, farm-fresh produce from Musanze hills, and top reviewed groceries across Kigali.
          </p>
        </div>

        {/* Product Catalog Grid */}
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
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '32px 0 80px 0',
  },
  banner: {
    backgroundImage: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #157A4C 100%)',
    borderRadius: '24px',
    padding: '36px',
    color: '#FFFFFF',
    marginBottom: '32px',
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
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: '1.5',
    maxWidth: '640px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '18px',
    marginBottom: '32px',
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0',
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
};

export default FreshPicks;
