import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart, deleteFromCart, getSubtotal, getDeliveryFee, getTotal } = useApp();
  const navigate = useNavigate();
  const drawerRef = useRef();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    onClose();
    navigate('/cart');
  };

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee();
  const total = getTotal();

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        ref={drawerRef}
        style={styles.drawer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <ShoppingBag size={20} color="var(--color-primary)" />
            <h3 style={styles.title}>Your Cart</h3>
            <span style={styles.countBadge}>{cart.length}</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        {cart.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIconWrapper}>
              <ShoppingBag size={48} color="var(--color-text-secondary)" />
            </div>
            <h4 style={styles.emptyTitle}>Your cart is feeling empty</h4>
            <p style={styles.emptySubtitle}>Add some fresh produce and organic items to start cooking!</p>
            <button
              onClick={() => {
                onClose();
                navigate('/shop');
              }}
              className="btn btn-primary"
              style={{ marginTop: '16px' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Products List */}
            <div style={styles.productList}>
              {cart.map(({ product, quantity }) => (
                <div key={product.id} style={styles.productCard}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={styles.productImage} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/><circle cx="50" cy="50" r="20" fill="%23FFFFFF"/><path d="M50 40 C44 48 44 56 50 64 C56 56 56 48 50 40 Z" fill="%2320B86B"/></svg>';
                    }}
                  />
                  <div style={styles.productDetails}>
                    <span style={styles.productCategory}>{product.category}</span>
                    <h4 style={styles.productName} onClick={() => { onClose(); navigate(`/product/${product.id}`); }}>
                      {product.name}
                    </h4>
                    <span style={styles.productUnit}>{product.unit}</span>
                    
                    <div style={styles.priceRow}>
                      <span style={styles.productPrice}>{product.price.toLocaleString()} RWF</span>
                      
                      {/* Quantity Selector */}
                      <div style={styles.qtySelector}>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          style={styles.qtyBtn}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={styles.qtyText}>{quantity}</span>
                        <button
                          onClick={() => addToCart(product, 1)}
                          style={styles.qtyBtn}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteFromCart(product.id)}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Drawer Footer Summary */}
            <div style={styles.footer}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>{subtotal.toLocaleString()} RWF</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Delivery Fee</span>
                <span style={{
                  ...styles.summaryValue,
                  color: delivery === 0 ? 'var(--color-primary)' : 'var(--color-text)'
                }}>
                  {delivery === 0 ? 'FREE' : `${delivery.toLocaleString()} RWF`}
                </span>
              </div>
              
              <div style={styles.divider} />
              
              <div style={{ ...styles.summaryRow, marginBottom: '20px' }}>
                <span style={styles.totalLabel}>Estimated Total</span>
                <span style={styles.totalValue}>{total.toLocaleString()} RWF</span>
              </div>

              <div style={styles.actionGrid}>
                <button
                  onClick={handleViewCartClick}
                  className="btn btn-outline"
                  style={styles.viewCartBtn}
                >
                  View Cart
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="btn btn-primary"
                  style={styles.checkoutBtn}
                >
                  Checkout
                  <ArrowRight size={16} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 37, 31, 0.4)',
    backdropFilter: 'blur(3px)',
    zIndex: 1050,
    display: 'flex',
    justifyContent: 'flex-end',
    animation: 'fadeIn 0.2s ease-out',
  },
  drawer: {
    width: '100%',
    maxWidth: '440px',
    height: '100%',
    backgroundColor: '#FFFFFF',
    boxShadow: '-10px 0 40px rgba(23, 37, 31, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--color-text)',
    margin: 0,
  },
  countBadge: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    fontSize: '12px',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  closeBtn: {
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '50%',
    backgroundColor: '#F3F6F4',
    transition: 'background-color 0.2s',
  },
  emptyState: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    textAlign: 'center',
  },
  emptyIconWrapper: {
    backgroundColor: '#F3F6F4',
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px',
    color: 'var(--color-text)',
  },
  emptySubtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
    maxWidth: '280px',
  },
  productList: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  productCard: {
    display: 'flex',
    gap: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--color-border)',
    position: 'relative',
  },
  productImage: {
    width: '72px',
    height: '72px',
    borderRadius: '12px',
    objectFit: 'cover',
    backgroundColor: '#FFFDF7',
    border: '1px solid var(--color-border)',
    flexShrink: 0,
  },
  productDetails: {
    flexGrow: 1,
  },
  productCategory: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  productName: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginTop: '2px',
    marginBottom: '2px',
    cursor: 'pointer',
    '&:hover': {
      color: 'var(--color-primary)',
    },
  },
  productUnit: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    display: 'block',
    marginBottom: '8px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  qtySelector: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '2px',
    backgroundColor: '#FFFDF7',
  },
  qtyBtn: {
    padding: '4px 8px',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: '#F3F6F4',
      color: 'var(--color-text)',
    },
  },
  qtyText: {
    fontSize: '13px',
    fontWeight: '700',
    width: '24px',
    textAlign: 'center',
  },
  deleteBtn: {
    alignSelf: 'flex-start',
    color: '#A0AEC0',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    transition: 'all 0.2s',
    '&:hover': {
      color: 'var(--color-error)',
      backgroundColor: '#FFEBEB',
    },
  },
  footer: {
    padding: '24px',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: '#FFFDF7',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  summaryLabel: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: '14px',
    color: 'var(--color-text)',
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '12px 0',
  },
  totalLabel: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.3fr',
    gap: '12px',
  },
  viewCartBtn: {
    borderRadius: '12px',
    height: '46px',
    fontSize: '14px',
  },
  checkoutBtn: {
    borderRadius: '12px',
    height: '46px',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(32, 184, 107, 0.15)',
  },
};

export default CartDrawer;
