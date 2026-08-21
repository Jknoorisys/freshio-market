import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Heart, Star, Plus, Minus, ShoppingCart } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { cart, wishlist, toggleWishlist, addToCart, removeFromCart } = useApp();
  const navigate = useNavigate();

  const isWishlisted = wishlist.includes(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
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
    // Replace with a beautiful SVG placeholder representing Freshio organic items
    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/><circle cx="50" cy="50" r="25" fill="%23FFFFFF"/><path d="M50 35 C42 45 42 55 50 65 C58 55 58 45 50 35 Z" fill="%2320B86B"/><text x="50" y="80" font-family="sans-serif" font-weight="bold" font-size="6" fill="%23087A4B" text-anchor="middle">Freshio Organics</text></svg>';
  };

  return (
    <div style={styles.card} onClick={handleCardClick} className="product-card-hover">
      {/* Product Image Section */}
      <div style={styles.imageWrapper}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={styles.image} 
          className="product-image-zoom" 
          onError={handleImageError}
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
            size={18}
            fill={isWishlisted ? 'var(--color-primary)' : 'none'}
            color={isWishlisted ? 'var(--color-primary)' : 'var(--color-text-secondary)'}
            style={{ transition: 'transform 0.2s' }}
            className={isWishlisted ? 'animate-heart' : ''}
          />
        </button>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span style={styles.discountBadge}>
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Product Information */}
      <div style={styles.infoWrapper}>
        <span style={styles.category}>{product.category}</span>
        <h4 style={styles.name} title={product.name}>
          {product.name}
        </h4>

        {/* Rating */}
        <div style={styles.ratingRow}>
          <Star size={14} fill="#FFC107" color="#FFC107" />
          <span style={styles.ratingVal}>{product.rating}</span>
          <span style={styles.reviews}>({product.reviews})</span>
        </div>

        <span style={styles.unit}>{product.unit}</span>

        {/* Price & Action Button */}
        <div style={styles.priceRow}>
          <div style={styles.priceContainer}>
            <span style={styles.price}>{product.price.toLocaleString()} RWF</span>
            {product.originalPrice > product.price && (
              <span style={styles.originalPrice}>{product.originalPrice.toLocaleString()} RWF</span>
            )}
          </div>

          {/* Action Button */}
          {quantity > 0 ? (
            <div style={styles.qtyControl} onClick={(e) => e.stopPropagation()}>
              <button onClick={handleMinusClick} style={styles.qtyBtn}>
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <span style={styles.qtyText}>{quantity}</span>
              <button onClick={handlePlusClick} style={styles.qtyBtn}>
                <Plus size={12} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button onClick={handleAddClick} style={styles.addBtn} className="btn-add-hover">
              <Plus size={14} strokeWidth={2.5} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// CSS Rules for Hover effects (written as classes in index.css or handled via inline/CSS injections)
const hoverStyles = `
  .product-card-hover {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .product-card-hover:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-md) !important;
    border-color: var(--color-primary) !important;
  }
  .product-image-zoom {
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .product-card-hover:hover .product-image-zoom {
    transform: scale(1.08);
  }
  .btn-add-hover:hover {
    background-color: var(--color-primary-dark) !important;
    color: #FFFFFF !important;
  }
`;

// Insert the hover rules dynamically in index.css if not present, or inject in document header
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = hoverStyles;
  document.head.appendChild(styleSheet);
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer',
    padding: '12px',
    boxShadow: 'var(--shadow-sm)',
    height: '100%',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '160px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#FFFDF9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    zIndex: 2,
    boxShadow: 'var(--shadow-sm)',
    outline: 'none',
  },
  discountBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: 'var(--color-orange)',
    color: '#FFFFFF',
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: '800',
    zIndex: 2,
  },
  infoWrapper: {
    padding: '12px 4px 4px 4px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  category: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  name: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginTop: '4px',
    marginBottom: '6px',
    lineHeight: '1.4',
    height: '40px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '4px',
  },
  ratingVal: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  reviews: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  unit: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginBottom: '12px',
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
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  originalPrice: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    textDecoration: 'line-through',
    marginTop: '-2px',
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '8px 14px',
    borderRadius: '14px',
    border: '1.5px solid var(--color-primary)',
    backgroundColor: '#FFFFFF',
    color: 'var(--color-primary-dark)',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    borderRadius: '14px',
    padding: '2px',
    boxShadow: '0 4px 10px rgba(32, 184, 107, 0.15)',
  },
  qtyBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
  },
  qtyText: {
    fontSize: '13px',
    fontWeight: '700',
    width: '22px',
    textAlign: 'center',
  },
};

export default ProductCard;
