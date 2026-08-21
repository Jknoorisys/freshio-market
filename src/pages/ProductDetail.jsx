import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/mockData';
import { ArrowLeft, Star, Heart, ShoppingBag, Plus, Minus, Truck, Shield, Calendar, ArrowRight } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { cart, addToCart, updateQuantity, wishlist, toggleWishlist, addToast } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('sourcing');

  // Find active product
  const product = useMemo(() => {
    return PRODUCTS.find(p => p.id === id);
  }, [id]);

  // Handle missing product
  if (!product) {
    return (
      <div style={styles.errorContainer}>
        <span style={{ fontSize: '64px' }}>🥬</span>
        <h2>Product Not Found</h2>
        <p>The product you are trying to view does not exist or has been removed from our Kigali database.</p>
        <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ borderRadius: '12px' }}>
          Back to Shop Catalog
        </button>
      </div>
    );
  }

  // Check if product is currently in cart
  const cartItem = cart.find(item => item.id === product.id);
  const isInWishlist = wishlist.includes(product.id);

  // Load related products (excluding current product)
  const relatedProducts = useMemo(() => {
    return PRODUCTS
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast(`${product.name} (${quantity} units) added to cart`, 'success');
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    if (!isInWishlist) {
      addToast(`Added ${product.name} to Wishlist`, 'success');
    } else {
      addToast(`Removed ${product.name} from Wishlist`, 'info');
    }
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Product Overview Layout */}
        <div style={styles.productMain}>
          {/* Left Column: Image Frame */}
          <div style={styles.imageCol}>
            <div style={styles.imageWrapper}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={styles.mainImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/></svg>';
                }}
              />
              {product.discount > 0 && (
                <div style={styles.discountBadge}>
                  -{product.discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information Panel */}
          <div style={styles.infoCol}>
            <span style={styles.categoryBreadcrumb}>
              {product.category} &rsaquo; {product.subcategory}
            </span>
            
            <h1 style={styles.productTitle}>{product.name}</h1>
            
            <div style={styles.brandRow}>
              <span style={styles.brandLabel}>Brand: <strong>{product.brand}</strong></span>
              <span style={styles.divider}>|</span>
              <div style={styles.reviewsRow}>
                <div style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < Math.floor(product.rating) ? "var(--color-orange)" : "none"} 
                      color={i < Math.floor(product.rating) ? "var(--color-orange)" : "#D0D5DD"} 
                    />
                  ))}
                </div>
                <span style={styles.reviewsText}>
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div style={styles.priceRow}>
              <div style={styles.priceColumn}>
                <span style={styles.currentPrice}>
                  {product.price.toLocaleString()} RWF
                </span>
                {product.originalPrice > product.price && (
                  <span style={styles.originalPrice}>
                    {product.originalPrice.toLocaleString()} RWF
                  </span>
                )}
              </div>
              <span style={styles.unitBadge}>{product.unit}</span>
            </div>

            <p style={styles.description}>{product.description}</p>

            {/* In-Stock indicators */}
            <div style={styles.stockStatus}>
              <span style={{
                ...styles.dot,
                backgroundColor: product.stock > 0 ? '#10B981' : '#EF4444'
              }}></span>
              <span style={styles.stockText}>
                {product.stock > 0 ? `In Stock (${product.stock} items left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Cart Controllers */}
            <div style={styles.actionBlock}>
              <div style={styles.qtyControl}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  style={styles.qtyBtn}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span style={styles.qtyVal}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)} 
                  style={styles.qtyBtn}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart} 
                className="btn btn-primary"
                style={styles.addToCartBtn}
              >
                <ShoppingBag size={18} />
                <span>Add To Cart</span>
              </button>

              <button 
                onClick={handleWishlistToggle} 
                style={{
                  ...styles.wishlistBtn,
                  backgroundColor: isInWishlist ? 'rgba(255, 90, 95, 0.1)' : 'transparent',
                  borderColor: isInWishlist ? 'var(--color-error)' : 'var(--color-border)',
                }}
              >
                <Heart size={20} fill={isInWishlist ? "var(--color-error)" : "none"} color={isInWishlist ? "var(--color-error)" : "var(--color-text)"} />
              </button>
            </div>

            {/* Quick Sourcing / Delivery Tabs */}
            <div style={styles.tabsWrapper}>
              <div style={styles.tabsHeader}>
                <button 
                  onClick={() => setActiveTab('sourcing')} 
                  style={{
                    ...styles.tabLink,
                    borderBottomColor: activeTab === 'sourcing' ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === 'sourcing' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                  }}
                >
                  Sourcing & Sincerity
                </button>
                <button 
                  onClick={() => setActiveTab('delivery')} 
                  style={{
                    ...styles.tabLink,
                    borderBottomColor: activeTab === 'delivery' ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === 'delivery' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                  }}
                >
                  Delivery Policy
                </button>
              </div>
              <div style={styles.tabContent}>
                {activeTab === 'sourcing' ? (
                  <div style={styles.tabPane}>
                    <div style={styles.tabIconLine}>
                      <Calendar size={18} color="var(--color-primary)" />
                      <span>Harvested directly from Musanze volcanic plots within 24 hours of dispatch.</span>
                    </div>
                    <div style={styles.tabIconLine}>
                      <Shield size={18} color="var(--color-primary)" />
                      <span>100% pesticide-free organic certification guaranteed. Sourced honestly.</span>
                    </div>
                  </div>
                ) : (
                  <div style={styles.tabPane}>
                    <div style={styles.tabIconLine}>
                      <Truck size={18} color="var(--color-primary)" />
                      <span>Superfast delivery inside Kigali sectors (Kimihurura, Kiyovu, Kacyiru) in under 2 hours.</span>
                    </div>
                    <div style={styles.tabIconLine}>
                      <Shield size={18} color="var(--color-primary)" />
                      <span>Packed inside temperature-sealed biodegradable carrier packs.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section style={styles.relatedSection}>
            <div style={styles.relatedHeader}>
              <h2 style={styles.relatedTitle}>You might also like</h2>
              <button onClick={() => navigate(`/category/${product.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`)} style={styles.moreBtn}>
                View Category <ArrowRight size={14} />
              </button>
            </div>
            <div style={styles.relatedGrid}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '32px 0 64px 0',
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
  errorContainer: {
    textAlign: 'center',
    padding: '80px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  productMain: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
    gap: '48px',
    marginBottom: '64px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
      gap: '32px',
    },
  },
  imageCol: {
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1.5px solid var(--color-border)',
    overflow: 'hidden',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    boxShadow: '0 8px 24px rgba(22, 58, 53, 0.03)',
  },
  mainImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: 'var(--color-error)',
    color: '#FFFFFF',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '800',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  categoryBreadcrumb: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  productTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: 'var(--color-text)',
    lineHeight: '1.1',
    marginBottom: '12px',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  brandLabel: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  divider: {
    color: 'var(--color-border)',
  },
  reviewsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  reviewsText: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--color-primary-light)',
    padding: '16px 24px',
    borderRadius: '16px',
    marginBottom: '24px',
  },
  priceColumn: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  currentPrice: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  originalPrice: {
    fontSize: '16px',
    color: 'var(--color-text-secondary)',
    textDecoration: 'line-through',
  },
  unitBadge: {
    fontSize: '13px',
    fontWeight: '700',
    backgroundColor: '#FFFFFF',
    color: 'var(--color-primary-dark)',
    padding: '6px 14px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  description: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  stockStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  stockText: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
  },
  actionBlock: {
    display: 'flex',
    gap: '16px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--color-border)',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  qtyBtn: {
    border: 'none',
    background: 'none',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--color-text)',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'var(--color-border)',
    },
  },
  qtyVal: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-text)',
    width: '32px',
    textAlign: 'center',
  },
  addToCartBtn: {
    flexGrow: 1,
    height: '46px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  wishlistBtn: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    border: '1.5px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabsWrapper: {
    border: '1.5px solid var(--color-border)',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  tabsHeader: {
    display: 'flex',
    backgroundColor: '#FAFBFB',
    borderBottom: '1.5px solid var(--color-border)',
  },
  tabLink: {
    flex: 1,
    background: 'none',
    border: 'none',
    borderBottom: '2.5px solid transparent',
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  tabContent: {
    padding: '20px',
  },
  tabPane: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tabIconLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
  },
  relatedSection: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: '48px',
  },
  relatedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  relatedTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  moreBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary-dark)',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
};
export default ProductDetail;
