import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Heart, Star, Plus, Minus, Tag } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { cart, wishlist, toggleWishlist, addToCart, removeFromCart } = useApp();
  const navigate = useNavigate();

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id || item.product.sku === product.sku);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleMinusClick = (e) => {
    e.stopPropagation();
    removeFromCart(product.id);
  };

  const handlePlusClick = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23F4F6F8"/><circle cx="50" cy="50" r="28" fill="%23E2E8F0"/><text x="50" y="55" font-family="sans-serif" font-size="24" text-anchor="middle">🛒</text></svg>';
  };

  const firstTag = Array.isArray(product.tags) && product.tags.length > 0 ? product.tags[0] : null;

  return (
    <div style={styles.card} onClick={handleCardClick} className="product-card-hover">
      {/* Product Image Section */}
      <div style={styles.imageWrapper}>
        <img 
          src={product.image || product.imageUrl} 
          alt={product.name} 
          style={styles.image} 
          className="product-image-zoom" 
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          style={{
            ...styles.wishlistBtn,
            backgroundColor: isWishlisted ? 'var(--color-primary-light)' : '#FFFFFF',
          }}
          aria-label="Add to Wishlist"
        >
          <Heart
            size={16}
            fill={isWishlisted ? 'var(--color-primary)' : 'none'}
            color={isWishlisted ? 'var(--color-primary)' : 'var(--color-text-secondary)'}
            style={{ transition: 'transform 0.2s' }}
            className={isWishlisted ? 'animate-heart' : ''}
          />
        </button>

        {/* Discount / Deal Badge */}
        {product.discount > 0 && (
          <span style={styles.discountBadge}>
            -{product.discount}%
          </span>
        )}

        {/* Tag badge if present and no discount */}
        {!product.discount && firstTag && (
          <span style={styles.tagBadge}>
            {firstTag}
          </span>
        )}
      </div>

      {/* Product Information */}
      <div style={styles.infoWrapper}>
        {/* Category & SKU row */}
        <div style={styles.metaRow}>
          <span style={styles.category} title={product.categoryName || product.category}>
            {product.categoryEmoji ? `${product.categoryEmoji} ` : ''}{product.categoryName || product.category}
          </span>
          {product.sku && (
            <span style={styles.skuBadge}>
              {product.sku}
            </span>
          )}
        </div>

        <h4 style={styles.name} title={product.name}>
          {product.name}
        </h4>

        {/* Rating and Unit */}
        <div style={styles.detailsRow}>
          <div style={styles.ratingRow}>
            <Star size={13} fill="#FFC107" color="#FFC107" />
            <span style={styles.ratingVal}>{product.rating || 4.5}</span>
            <span style={styles.reviews}>({product.reviews || 12})</span>
          </div>
          {product.unit && (
            <span style={styles.unit}>{product.unit}</span>
          )}
        </div>

        {/* Price & Action Button */}
        <div style={styles.priceRow}>
          <div style={styles.priceContainer}>
            <span style={styles.price}>{(product.price || 0).toLocaleString()} <span style={styles.currency}>RWF</span></span>
            {product.originalPrice > product.price && (
              <span style={styles.originalPrice}>{(product.originalPrice).toLocaleString()} RWF</span>
            )}
          </div>

          {/* Action Button */}
          {quantity > 0 ? (
            <div style={styles.qtyControl} onClick={(e) => e.stopPropagation()}>
              <button onClick={handleMinusClick} style={styles.qtyBtn} aria-label="Decrease quantity">
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <span style={styles.qtyText}>{quantity}</span>
              <button onClick={handlePlusClick} style={styles.qtyBtn} aria-label="Increase quantity">
                <Plus size={12} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button onClick={handleAddClick} style={styles.addBtn} className="btn-add-hover" aria-label="Add to cart">
              <Plus size={14} strokeWidth={2.5} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer',
    padding: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    height: '100%',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '150px',
    borderRadius: '14px',
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
  },
  image: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
    transition: 'transform 0.3s ease',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    zIndex: 2,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    outline: 'none',
  },
  discountBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    padding: '3px 7px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '800',
    zIndex: 2,
    letterSpacing: '0.3px',
  },
  tagBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: 'var(--color-primary-dark)',
    color: '#FFFFFF',
    padding: '3px 7px',
    borderRadius: '6px',
    fontSize: '9px',
    fontWeight: '700',
    textTransform: 'uppercase',
    zIndex: 2,
    letterSpacing: '0.4px',
  },
  infoWrapper: {
    padding: '10px 2px 2px 2px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '6px',
    marginBottom: '4px',
  },
  category: {
    fontSize: '10.5px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '65%',
  },
  skuBadge: {
    fontSize: '9.5px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    backgroundColor: 'var(--color-primary-light)',
    padding: '1px 5px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    letterSpacing: '0.2px',
  },
  name: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '6px',
    lineHeight: '1.35',
    height: '36px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  detailsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
    gap: '4px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  ratingVal: {
    fontSize: '11.5px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  reviews: {
    fontSize: '10.5px',
    color: 'var(--color-text-secondary)',
  },
  unit: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    backgroundColor: '#F3F4F6',
    padding: '2px 6px',
    borderRadius: '4px',
    maxWidth: '45%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    gap: '6px',
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  price: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  currency: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
  },
  originalPrice: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    textDecoration: 'line-through',
    marginTop: '-2px',
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '6px 12px',
    borderRadius: '12px',
    border: '1.5px solid var(--color-primary)',
    backgroundColor: '#FFFFFF',
    color: 'var(--color-primary-dark)',
    fontWeight: '700',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    borderRadius: '12px',
    padding: '2px',
    boxShadow: '0 2px 8px rgba(32, 184, 107, 0.2)',
  },
  qtyBtn: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
  },
  qtyText: {
    fontSize: '12px',
    fontWeight: '700',
    width: '20px',
    textAlign: 'center',
  },
};

export default ProductCard;
