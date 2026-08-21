import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileNavBar } from '../../components/mobile/MobileNavBar';
import { PRODUCTS } from '../../data/mockData';

export const MobileWishlist = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart } = useApp();

  const lovedProducts = useMemo(() => {
    return (PRODUCTS || []).filter((p) => wishlist.includes(p.id));
  }, [wishlist]);

  return (
    <div style={styles.container}>
      <MobileNavBar title="Loved Items" showBack={true} />

      <div style={styles.scrollContent}>
        {lovedProducts.length > 0 ? (
          <div style={styles.grid}>
            {lovedProducts.map((prod) => (
              <div key={prod.id} style={styles.productCard}>
                <button
                  onClick={() => toggleWishlist(prod.id)}
                  style={styles.removeBtn}
                >
                  <Trash2 size={16} color="var(--color-text-secondary)" />
                </button>
                <div style={styles.prodImgWrapper} onClick={() => navigate(`/mobile/product/${prod.id}`)}>
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'}
                    alt={prod.name}
                    style={styles.prodImg}
                  />
                </div>
                <div style={styles.prodInfo}>
                  <h3 style={styles.prodName} onClick={() => navigate(`/mobile/product/${prod.id}`)}>
                    {prod.name}
                  </h3>
                  <div style={styles.prodMeta}>{prod.unit}</div>
                  <div style={styles.priceRow}>
                    <span style={styles.price}>{prod.price} RWF</span>
                    <button
                      onClick={() => addToCart(prod, 1)}
                      style={styles.addCartBtn}
                    >
                      <ShoppingCart size={15} color="#FFF" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIconCircle}>
              <Heart size={44} fill="var(--color-text-secondary)" color="var(--color-text-secondary)" />
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you like to buy them later. Tap the heart icon on any product to save it here!</p>
            <button onClick={() => navigate('/mobile/shop')} style={styles.shopBtn}>
              Explore Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#F7F9FA',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContent: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '16px',
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: 'var(--shadow-sm)',
  },
  removeBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '4px',
    zIndex: 10,
  },
  prodImgWrapper: {
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  prodImg: {
    maxHeight: '90px',
    maxWidth: '90px',
    objectFit: 'contain',
  },
  prodInfo: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  prodName: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text)',
    cursor: 'pointer',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    height: '32px',
    lineHeight: '1.3',
  },
  prodMeta: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
    fontWeight: '500',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
  price: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  addCartBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    marginTop: '40px',
  },
  emptyIconCircle: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    backgroundColor: '#EAECEE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  shopBtn: {
    marginTop: '20px',
    padding: '10px 24px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-primary)',
    color: '#FFF',
    fontWeight: '700',
    fontSize: '13px',
    border: 'none',
    cursor: 'pointer',
  }
};

export default MobileWishlist;
