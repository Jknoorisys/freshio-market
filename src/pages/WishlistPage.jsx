import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/mockData';
import { ArrowLeft, Heart } from 'lucide-react';

export const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist } = useApp();

  // Extract products in wishlist
  const wishlistProducts = useMemo(() => {
    return PRODUCTS.filter(p => wishlist.includes(p.id));
  }, [wishlist]);

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <button onClick={() => navigate('/account')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 style={styles.pageTitle}>My Favorites</h1>

        {wishlistProducts.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>
              <Heart size={48} color="var(--color-text-secondary)" />
            </div>
            <h3 style={styles.emptyTitle}>Wishlist is Empty</h3>
            <p style={styles.emptyDesc}>
              You haven't favorited any products yet. Tap the heart icons on our grocery cards to build your custom shopping lists.
            </p>
            <button onClick={() => navigate('/shop')} className="btn btn-primary" style={styles.shopBtn}>
              Go Browse Fresh Items
            </button>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '40px 0 80px 0',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '24px',
    padding: 0,
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '32px',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '64px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    maxWidth: '540px',
    margin: '0 auto',
  },
  emptyIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#FAFBFB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  emptyDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  shopBtn: {
    borderRadius: '10px',
    padding: '10px 24px',
  },
  productsGrid: {
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
export default WishlistPage;
