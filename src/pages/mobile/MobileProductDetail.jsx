import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, Share2, Shield, Truck, RefreshCw, ShoppingCart, Percent } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileNavBar } from '../../components/mobile/MobileNavBar';
import { PRODUCTS } from '../../data/mockData';

export const MobileProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    addToCart,
    wishlist,
    toggleWishlist,
  } = useApp();

  const [qty, setQty] = useState(1);

  // Find product by id
  const product = useMemo(() => {
    return (PRODUCTS || []).find((p) => String(p.id) === String(id));
  }, [PRODUCTS, id]);

  const isLiked = useMemo(() => {
    return wishlist.includes(product?.id);
  }, [wishlist, product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return (PRODUCTS || [])
      .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
      .slice(0, 4);
  }, [PRODUCTS, product]);

  if (!product) {
    return (
      <div style={styles.errorContainer}>
        <MobileNavBar title="Product Details" />
        <div style={styles.errorContent}>
          <h2>Product Not Found</h2>
          <p>We couldn't load the details for this item. It may have been discontinued.</p>
          <button onClick={() => navigate('/mobile')} style={styles.errorBtn}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    setQty(1); // reset qty
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Link to product: ${window.location.href}`);
    }
  };

  return (
    <div style={styles.container}>
      <MobileNavBar
        title="Product Details"
        rightElement={
          <div style={styles.headerRight}>
            <button onClick={handleShare} style={styles.headerIconBtn}>
              <Share2 size={20} color="var(--color-text)" />
            </button>
            <button onClick={() => toggleWishlist(product.id)} style={styles.headerIconBtn}>
              <Heart
                size={20}
                fill={isLiked ? 'var(--color-error)' : 'transparent'}
                color={isLiked ? 'var(--color-error)' : 'var(--color-text)'}
              />
            </button>
          </div>
        }
      />

      <div style={styles.scrollableContent}>
        {/* Product Image Section */}
        <div style={styles.imageCard}>
          {product.discount > 0 && (
            <span style={styles.discountBadge}>
              {product.discount}% OFF
            </span>
          )}
          <img
            src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            style={styles.productImage}
          />
        </div>

        {/* Product Details Section */}
        <div style={styles.infoCard}>
          <div style={styles.brandRow}>
            <span style={styles.brandName}>{product.brand}</span>
            <span style={styles.ratingBadge}>
              <Star size={12} fill="var(--color-orange)" color="var(--color-orange)" style={{ marginRight: 2 }} />
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <h2 style={styles.productName}>{product.name}</h2>
          <div style={styles.unitText}>Pack Size: {product.unit}</div>

          <div style={styles.priceRow}>
            <div style={styles.priceCol}>
              <span style={styles.price}>{product.price} RWF</span>
              {product.originalPrice > product.price && (
                <span style={styles.wasPrice}>{product.originalPrice} RWF</span>
              )}
            </div>
            {product.stock > 0 ? (
              <span style={styles.instockBadge}>In Stock ({product.stock})</span>
            ) : (
              <span style={styles.outstockBadge}>Out of Stock</span>
            )}
          </div>

          {/* Sawa Citi delivery details */}
          <div style={styles.guaranteeBox}>
            <div style={styles.guaranteeItem}>
              <Truck size={16} color="var(--color-primary)" />
              <div>
                <div style={styles.gTitle}>2-Hour Delivery</div>
                <div style={styles.gDesc}>Across all sectors in Kigali</div>
              </div>
            </div>
            <div style={styles.guaranteeItem}>
              <Shield size={16} color="var(--color-primary)" />
              <div>
                <div style={styles.gTitle}>100% Organic Quality</div>
                <div style={styles.gDesc}>Handpicked Sawa Citi inventory</div>
              </div>
            </div>
            <div style={styles.guaranteeItem}>
              <RefreshCw size={16} color="var(--color-primary)" />
              <div>
                <div style={styles.gTitle}>Instant Refunds</div>
                <div style={styles.gDesc}>No-questions-asked refund policy</div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div style={styles.descSection}>
            <h3 style={styles.sectionTitle}>Product Description</h3>
            <p style={styles.descParagraph}>{product.description}</p>
          </div>

          {/* Related items */}
          {relatedProducts.length > 0 && (
            <div style={styles.relatedSection}>
              <h3 style={styles.sectionTitle}>You May Also Like</h3>
              <div style={styles.relatedGrid}>
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      navigate(`/mobile/product/${p.id}`);
                      setQty(1);
                    }}
                    style={styles.relatedCard}
                  >
                    <img src={p.image} alt={p.name} style={styles.relatedImg} />
                    <h4 style={styles.relatedName}>{p.name}</h4>
                    <span style={styles.relatedPrice}>{p.price} RWF</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Footer */}
      {product.stock > 0 && (
        <div style={styles.stickyFooter}>
          <div style={styles.qtyContainer}>
            <button
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              style={styles.qtyBtn}
            >
              -
            </button>
            <span style={styles.qtyVal}>{qty}</span>
            <button
              onClick={() => setQty((prev) => Math.min(product.stock, prev + 1))}
              style={styles.qtyBtn}
            >
              +
            </button>
          </div>
          <button onClick={handleAddToCart} style={styles.addToCartBtn}>
            <ShoppingCart size={18} style={{ marginRight: 8 }} />
            Add To Basket • {(product.price * qty)} RWF
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#F7F9FA',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIconBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableContent: {
    flexGrow: 1,
    overflowY: 'auto',
    paddingBottom: '88px', // offset sticky footer
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    padding: '30px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottom: '1px solid var(--color-border)',
  },
  discountBadge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: 'var(--color-error)',
    color: '#FFFFFF',
    fontSize: '9px',
    fontWeight: '900',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  productImage: {
    maxHeight: '240px',
    maxWidth: '100%',
    objectFit: 'contain',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: '20px 16px',
    marginTop: '8px',
    borderTop: '1px solid var(--color-border)',
  },
  brandRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandName: {
    fontSize: '11px',
    fontWeight: '900',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
  },
  productName: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginTop: '8px',
    lineHeight: '1.4',
  },
  unitText: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
    marginTop: '4px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--color-border)',
  },
  priceCol: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  price: {
    fontSize: '22px',
    fontWeight: '900',
    color: 'var(--color-primary-dark)',
  },
  wasPrice: {
    fontSize: '14px',
    textDecoration: 'line-through',
    color: 'var(--color-text-secondary)',
  },
  instockBadge: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--color-success)',
    backgroundColor: '#E6F8EF',
    padding: '4px 8px',
    borderRadius: '100px',
  },
  outstockBadge: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--color-error)',
    backgroundColor: '#FFEBEB',
    padding: '4px 8px',
    borderRadius: '100px',
  },
  guaranteeBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px 0',
    borderBottom: '1px solid var(--color-border)',
  },
  guaranteeItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  gTitle: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  gDesc: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    marginTop: '1px',
  },
  descSection: {
    padding: '16px 0',
    borderBottom: '1px solid var(--color-border)',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '8px',
  },
  descParagraph: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
  },
  relatedSection: {
    padding: '16px 0 0 0',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginTop: '10px',
  },
  relatedCard: {
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: '#FFF',
  },
  relatedImg: {
    height: '70px',
    objectFit: 'contain',
    marginBottom: '6px',
  },
  relatedName: {
    fontSize: '11px',
    fontWeight: '700',
    textAlign: 'center',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    height: '28px',
    lineHeight: '1.3',
  },
  relatedPrice: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    marginTop: '4px',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid var(--color-border)',
    padding: '12px 16px 28px 16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    zIndex: 900,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
  },
  qtyContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    height: '46px',
    backgroundColor: 'var(--color-bg)',
  },
  qtyBtn: {
    width: '36px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: 'var(--color-text)',
  },
  qtyVal: {
    fontSize: '14px',
    fontWeight: '800',
    width: '24px',
    textAlign: 'center',
  },
  addToCartBtn: {
    flexGrow: 1,
    height: '46px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'var(--color-primary-dark)',
    }
  },
  errorContainer: {
    backgroundColor: '#FFF',
    height: '100%',
  },
  errorContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
    marginTop: '60px',
  },
  errorBtn: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: 'var(--color-primary)',
    color: '#FFF',
    fontWeight: '700',
    borderRadius: '8px',
  }
};

export default MobileProductDetail;
