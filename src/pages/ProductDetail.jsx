import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, findProduct } from '../data/mockData';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Truck, 
  Shield, 
  Calendar, 
  ArrowRight,
  Tag,
  Store,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { cart, addToCart, wishlist, toggleWishlist, addToast } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  // Find active product by id, sku, or slug
  const product = useMemo(() => {
    return findProduct(id) || PRODUCTS.find(p => p.id === id || p.sku === id || p.slug === id);
  }, [id]);

  // Check if product is currently in cart / wishlist
  const cartItem = product ? cart.find(item => item.product.id === product.id || item.product.sku === product.sku) : null;
  const isInWishlist = product ? wishlist.includes(product.id) : false;

  // Load related products (from same category, excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const catSlug = product.categorySlug || product.category;
    return PRODUCTS
      .filter(p => (p.categorySlug === catSlug || p.category === product.category) && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  // Handle missing product
  if (!product) {
    return (
      <div style={styles.errorContainer}>
        <span style={{ fontSize: '64px' }}>🛒</span>
        <h2 style={{ margin: '16px 0 8px 0', fontSize: '24px', fontWeight: '800' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          The product you are trying to view does not exist in our Sawa Citi Kigali catalog.
        </p>
        <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ borderRadius: '12px' }}>
          Back to Shop Catalog
        </button>
      </div>
    );
  }

  const galleryImages = (product.imageUrls && product.imageUrls.length > 0) 
    ? product.imageUrls 
    : [product.image || product.imageUrl].filter(Boolean);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast(`${product.name} (${quantity} items) added to cart`, 'success');
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    if (!isInWishlist) {
      addToast(`Added ${product.name} to Wishlist`, 'success');
    } else {
      addToast(`Removed ${product.name} from Wishlist`, 'info');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Freshio Sawa Citi Kigali!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23F4F6F8"/><circle cx="50" cy="50" r="28" fill="%23E2E8F0"/><text x="50" y="55" font-family="sans-serif" font-size="24" text-anchor="middle">🛒</text></svg>';
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={styles.breadcrumbBar}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <ArrowLeft size={16} /> Back
          </button>
          <div style={styles.breadcrumbs}>
            <Link to="/" style={styles.bcLink}>Home</Link>
            <span style={styles.bcSep}>/</span>
            <Link to="/shop" style={styles.bcLink}>Shop</Link>
            <span style={styles.bcSep}>/</span>
            <Link to={`/category/${product.categorySlug || 'groceries'}`} style={styles.bcLink}>
              {product.categoryEmoji ? `${product.categoryEmoji} ` : ''}{product.categoryName || product.category}
            </Link>
            <span style={styles.bcSep}>/</span>
            <span style={styles.bcCurrent}>{product.name}</span>
          </div>
        </div>

        {/* Product Overview Layout */}
        <div style={styles.productMain}>
          {/* Left Column: Image Frame & Gallery */}
          <div style={styles.imageCol}>
            <div style={styles.imageWrapper}>
              <img 
                src={galleryImages[selectedImage] || product.image || product.imageUrl} 
                alt={product.name} 
                style={styles.mainImage}
                onError={handleImageError}
              />
              {product.discount > 0 && (
                <div style={styles.discountBadge}>
                  -{product.discount}% OFF
                </div>
              )}
            </div>

            {/* Gallery Thumbnails (if multiple images) */}
            {galleryImages.length > 1 && (
              <div style={styles.thumbnailRow}>
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      ...styles.thumbBtn,
                      borderColor: selectedImage === idx ? 'var(--color-primary)' : 'var(--color-border)'
                    }}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} style={styles.thumbImg} onError={handleImageError} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information Panel */}
          <div style={styles.infoCol}>
            {/* Category and SKU badge */}
            <div style={styles.headerMetaRow}>
              <Link to={`/category/${product.categorySlug || 'groceries'}`} style={styles.categoryBadge}>
                {product.categoryEmoji ? `${product.categoryEmoji} ` : ''}{product.categoryName || product.category}
              </Link>
              {product.sku && (
                <span style={styles.skuTag}>
                  SKU: <strong>{product.sku}</strong>
                </span>
              )}
            </div>
            
            <h1 style={styles.productTitle}>{product.name}</h1>
            
            {/* Brand & Ratings */}
            <div style={styles.brandRow}>
              <span style={styles.brandLabel}>Brand: <strong>{product.brand || 'Sawa Citi'}</strong></span>
              <span style={styles.divider}>|</span>
              <div style={styles.reviewsRow}>
                <div style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < Math.floor(product.rating || 4.5) ? "#FFC107" : "none"} 
                      color={i < Math.floor(product.rating || 4.5) ? "#FFC107" : "#D0D5DD"} 
                    />
                  ))}
                </div>
                <span style={styles.reviewsText}>
                  {product.rating || 4.5} ({product.reviews || 12} reviews)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div style={styles.priceRow}>
              <div style={styles.priceColumn}>
                <span style={styles.currentPrice}>
                  {(product.price || 0).toLocaleString()} <span style={styles.currSmall}>RWF</span>
                </span>
                {product.originalPrice > product.price && (
                  <span style={styles.originalPrice}>
                    {(product.originalPrice).toLocaleString()} RWF
                  </span>
                )}
              </div>
              {product.unit && (
                <span style={styles.unitBadge}>Unit: {product.unit}</span>
              )}
            </div>

            {/* Tags Badges */}
            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div style={styles.tagsContainer}>
                {product.tags.map((t, idx) => (
                  <span key={idx} style={styles.tagPill}>
                    <Tag size={11} style={{ marginRight: '4px' }} />
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p style={styles.description}>{product.description}</p>

            {/* In-Stock status & Sawa Citi branches note */}
            <div style={styles.availabilityBox}>
              <div style={styles.stockStatus}>
                <span style={{
                  ...styles.dot,
                  backgroundColor: product.stock > 0 ? '#10B981' : '#EF4444'
                }}></span>
                <span style={styles.stockText}>
                  {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
                </span>
              </div>
              <div style={styles.branchNotice}>
                <Store size={14} color="var(--color-primary-dark)" />
                <span>Available at all 8 Sawa Citi branches across Kigali</span>
              </div>
            </div>

            {/* Cart Controllers & Action Buttons */}
            <div style={styles.actionBlock}>
              <div style={styles.qtyControl}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  style={styles.qtyBtn}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span style={styles.qtyVal}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)} 
                  style={styles.qtyBtn}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart} 
                style={styles.addToCartBtn}
                className="btn btn-primary"
                disabled={product.stock <= 0}
              >
                <ShoppingBag size={18} />
                <span>Add {quantity > 1 ? `${quantity} Items` : 'to Cart'} • {((product.price || 0) * quantity).toLocaleString()} RWF</span>
              </button>

              <button 
                onClick={handleWishlistToggle}
                style={{
                  ...styles.wishlistActionBtn,
                  backgroundColor: isInWishlist ? 'var(--color-primary-light)' : '#FFFFFF',
                  borderColor: isInWishlist ? 'var(--color-primary)' : 'var(--color-border)'
                }}
                aria-label="Save to Wishlist"
              >
                <Heart 
                  size={20} 
                  fill={isInWishlist ? "var(--color-primary)" : "none"} 
                  color={isInWishlist ? "var(--color-primary)" : "var(--color-text-secondary)"} 
                />
              </button>

              <button 
                onClick={handleShare}
                style={styles.shareBtn}
                aria-label="Share product"
              >
                <Share2 size={18} color="var(--color-text-secondary)" />
              </button>
            </div>

            {/* Value Guarantees Banner */}
            <div style={styles.guaranteeGrid}>
              <div style={styles.guaranteeItem}>
                <Truck size={18} color="var(--color-primary)" />
                <div>
                  <h5 style={styles.gTitle}>2-Hour Kigali Delivery</h5>
                  <p style={styles.gDesc}>Temperature-controlled express dispatch</p>
                </div>
              </div>
              <div style={styles.guaranteeItem}>
                <Shield size={18} color="var(--color-primary)" />
                <div>
                  <h5 style={styles.gTitle}>100% Quality Guaranteed</h5>
                  <p style={styles.gDesc}>Fresh or hassle-free replacement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications & Sawa Citi Details */}
        <div style={styles.tabsSection}>
          <div style={styles.tabHeaders}>
            <button 
              onClick={() => setActiveTab('details')}
              style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'details' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'details' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)' }}
            >
              Product Specifications
            </button>
            <button 
              onClick={() => setActiveTab('delivery')}
              style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'delivery' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'delivery' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)' }}
            >
              Kigali Delivery & Returns
            </button>
          </div>

          <div style={styles.tabBody}>
            {activeTab === 'details' ? (
              <div style={styles.specTable}>
                <div style={styles.specRow}>
                  <span style={styles.specLabel}>Product SKU</span>
                  <span style={styles.specVal}>{product.sku}</span>
                </div>
                <div style={styles.specRow}>
                  <span style={styles.specLabel}>Category</span>
                  <span style={styles.specVal}>{product.categoryName || product.category}</span>
                </div>
                <div style={styles.specRow}>
                  <span style={styles.specLabel}>Brand</span>
                  <span style={styles.specVal}>{product.brand || 'Sawa Citi'}</span>
                </div>
                <div style={styles.specRow}>
                  <span style={styles.specLabel}>Size / Net Weight</span>
                  <span style={styles.specVal}>{product.sizeLabel || product.unit || 'Standard'}</span>
                </div>
                <div style={styles.specRow}>
                  <span style={styles.specLabel}>Stock Status</span>
                  <span style={styles.specVal}>{product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of stock'}</span>
                </div>
                <div style={styles.specRow}>
                  <span style={styles.specLabel}>Tags & Categories</span>
                  <span style={styles.specVal}>{Array.isArray(product.tags) && product.tags.length > 0 ? product.tags.join(', ') : 'Standard Supermarket Item'}</span>
                </div>
              </div>
            ) : (
              <div style={styles.deliveryContent}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Delivery in Kigali Sectors</h4>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                  Orders placed before 7:00 PM are delivered within 2 hours to Nyarutarama, Kiyovu, Kimihurura, Gacuriro, Remera, Kacyiru, Kibagabaga, and Kanombe. We accept MTN MoMo, Airtel Money, Cards, and Cash on Delivery.
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-primary-dark)', fontSize: '13px', fontWeight: '600' }}>
                  <CheckCircle2 size={16} /> Free Delivery on orders over 25,000 RWF (or anytime with Freshio+ membership)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Category Products Section */}
        {relatedProducts.length > 0 && (
          <div style={styles.relatedSection}>
            <div style={styles.relatedHeader}>
              <h3 style={styles.relatedTitle}>More from {product.categoryName || product.category}</h3>
              <Link to={`/category/${product.categorySlug || 'groceries'}`} style={styles.viewCategoryLink}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div style={styles.relatedGrid}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '24px 0 64px 0',
  },
  errorContainer: {
    padding: '80px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breadcrumbBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1px solid var(--color-border)',
    backgroundColor: '#FFFFFF',
    color: 'var(--color-text)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    flexWrap: 'wrap',
  },
  bcLink: {
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
  },
  bcSep: {
    color: '#D0D5DD',
  },
  bcCurrent: {
    color: 'var(--color-text)',
    fontWeight: '600',
    maxWidth: '260px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  productMain: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    marginBottom: '48px',
    backgroundColor: '#FFFFFF',
    padding: '32px',
    borderRadius: '24px',
    border: '1px solid var(--color-border)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
  },
  imageCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '380px',
    borderRadius: '20px',
    backgroundColor: '#F9FAFB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
    padding: '24px',
  },
  mainImage: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '800',
  },
  thumbnailRow: {
    display: 'flex',
    gap: '12px',
  },
  thumbBtn: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    border: '2px solid transparent',
    backgroundColor: '#F9FAFB',
    cursor: 'pointer',
    padding: '4px',
    overflow: 'hidden',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  categoryBadge: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    backgroundColor: 'var(--color-primary-light)',
    padding: '4px 10px',
    borderRadius: '8px',
    textDecoration: 'none',
    textTransform: 'uppercase',
  },
  skuTag: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    backgroundColor: '#F3F4F6',
    padding: '3px 8px',
    borderRadius: '6px',
    fontFamily: 'monospace',
  },
  productTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--color-text)',
    lineHeight: '1.3',
    marginBottom: '12px',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '18px',
  },
  brandLabel: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
  },
  divider: {
    color: '#D0D5DD',
  },
  reviewsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  reviewsText: {
    fontSize: '12.5px',
    color: 'var(--color-text-secondary)',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    padding: '12px 16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '14px',
  },
  priceColumn: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
  },
  currentPrice: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  currSmall: {
    fontSize: '15px',
    color: 'var(--color-text-secondary)',
  },
  originalPrice: {
    fontSize: '15px',
    color: 'var(--color-text-secondary)',
    textDecoration: 'line-through',
  },
  unitBadge: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    backgroundColor: '#FFFFFF',
    padding: '4px 10px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  tagsContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  tagPill: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    backgroundColor: 'var(--color-primary-light)',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: '14.5px',
    lineHeight: '1.6',
    color: 'var(--color-text-secondary)',
    marginBottom: '20px',
  },
  availabilityBox: {
    backgroundColor: '#F8FAF9',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  stockStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  stockText: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  branchNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  actionBlock: {
    display: 'flex',
    gap: '12px',
    marginBottom: '28px',
    alignItems: 'center',
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: '12px',
    padding: '4px',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#FFFFFF',
    color: 'var(--color-text)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  qtyVal: {
    fontSize: '14px',
    fontWeight: '700',
    width: '36px',
    textAlign: 'center',
  },
  addToCartBtn: {
    flexGrow: 1,
    padding: '14px 20px',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  wishlistActionBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    border: '1.5px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  shareBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    border: '1.5px solid var(--color-border)',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  guaranteeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '20px',
  },
  guaranteeItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  gTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '2px',
  },
  gDesc: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  tabsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
    marginBottom: '48px',
  },
  tabHeaders: {
    display: 'flex',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: '#F9FAFB',
  },
  tabBtn: {
    padding: '16px 24px',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    borderBottom: '2.5px solid transparent',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  tabBody: {
    padding: '24px 32px',
  },
  specTable: {
    display: 'flex',
    flexDirection: 'column',
  },
  specRow: {
    display: 'flex',
    padding: '10px 0',
    borderBottom: '1px solid #F3F4F6',
  },
  specLabel: {
    width: '180px',
    fontSize: '13.5px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  },
  specVal: {
    fontSize: '13.5px',
    color: 'var(--color-text)',
    fontWeight: '600',
  },
  deliveryContent: {
    padding: '8px 0',
  },
  relatedSection: {
    marginTop: '32px',
  },
  relatedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  relatedTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  viewCategoryLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    textDecoration: 'none',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
};

export default ProductDetail;
