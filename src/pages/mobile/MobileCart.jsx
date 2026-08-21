import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Sparkles, Percent, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileNavBar } from '../../components/mobile/MobileNavBar';

export const MobileCart = () => {
  const navigate = useNavigate();
  const {
    cart,
    updateCartQuantity,
    deleteFromCart,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getTax,
    getTotal,
    user,
    toggleMembership,
  } = useApp();

  const handleQtyChange = (productId, newQty) => {
    updateCartQuantity(productId, newQty);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/mobile/checkout');
  };

  return (
    <div style={styles.container}>
      <MobileNavBar title="Shopping Basket" showBack={true} />

      {cart.length > 0 ? (
        <div style={styles.scrollContent}>
          {/* Freshio+ Promo banner if user is not member */}
          {!user?.membership && (
            <div style={styles.promoBanner}>
              <div style={styles.promoLeft}>
                <Sparkles size={16} color="var(--color-orange)" style={{ marginRight: 6 }} />
                <div>
                  <div style={styles.promoTitle}>Unlock Free Delivery</div>
                  <div style={styles.promoDesc}>Join Freshio+ for unlimited free delivery in Kigali.</div>
                </div>
              </div>
              <button onClick={toggleMembership} style={styles.joinBtn}>
                Join
              </button>
            </div>
          )}

          {/* Cart Items List */}
          <div style={styles.itemsCard}>
            <h3 style={styles.cardHeader}>Basket Items ({cart.length})</h3>
            {cart.map((item) => (
              <div key={item.product.id} style={styles.itemRow}>
                <img
                  src={item.product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'}
                  alt={item.product.name}
                  style={styles.itemImg}
                  onClick={() => navigate(`/mobile/product/${item.product.id}`)}
                />
                <div style={styles.itemDetails}>
                  <h4 style={styles.itemName} onClick={() => navigate(`/mobile/product/${item.product.id}`)}>
                    {item.product.name}
                  </h4>
                  <div style={styles.itemMeta}>
                    <span>{item.product.unit}</span>
                    <span>• {item.product.price} RWF</span>
                  </div>
                  <div style={styles.itemActions}>
                    <div style={styles.qtyBox}>
                      <button
                        onClick={() => handleQtyChange(item.product.id, item.quantity - 1)}
                        style={styles.qtyBtn}
                      >
                        -
                      </button>
                      <span style={styles.qtyVal}>{item.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(item.product.id, item.quantity + 1)}
                        style={styles.qtyBtn}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => deleteFromCart(item.product.id)}
                      style={styles.deleteBtn}
                    >
                      <Trash2 size={16} color="var(--color-text-secondary)" />
                    </button>
                  </div>
                </div>
                <div style={styles.itemPriceCol}>
                  <span style={styles.itemPriceSum}>
                    {(item.product.price * item.quantity)} RWF
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Guarantee Badge */}
          <div style={styles.guaranteeCard}>
            <ShieldCheck size={20} color="var(--color-primary)" />
            <span>All items sourced direct from Sawa Citi Kigali stores.</span>
          </div>

          {/* Bill Summary */}
          <div style={styles.billCard}>
            <h3 style={styles.cardHeader}>Order Summary</h3>
            <div style={styles.billRow}>
              <span>Subtotal</span>
              <span>{getSubtotal()} RWF</span>
            </div>
            
            {getDiscount() > 0 && (
              <div style={{ ...styles.billRow, color: 'var(--color-success)' }}>
                <span>Discounts</span>
                <span>-{getDiscount()} RWF</span>
              </div>
            )}

            <div style={styles.billRow}>
              <span>Estimated Delivery</span>
              <span>{getDeliveryFee() === 0 ? 'FREE' : `${getDeliveryFee()} RWF`}</span>
            </div>

            <div style={styles.billRow}>
              <span>GST (5%)</span>
              <span>{getTax()} RWF</span>
            </div>

            <div style={{ ...styles.billRow, ...styles.billTotalRow }}>
              <span>Total Bill</span>
              <span>{getTotal()} RWF</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIconCircle}>
            <ShoppingBag size={48} color="var(--color-text-secondary)" />
          </div>
          <h2 style={styles.emptyTitle}>Your Basket is Empty</h2>
          <p style={styles.emptyDesc}>
            Looks like you haven't added any fresh groceries or local items yet. Start shopping to fill your basket!
          </p>
          <button onClick={() => navigate('/mobile/shop')} style={styles.shopNowBtn}>
            Browse Shop
          </button>
        </div>
      )}

      {/* Sticky Checkout Footer */}
      {cart.length > 0 && (
        <div style={styles.stickyFooter}>
          <div style={styles.footerTextCol}>
            <span style={styles.footerTotalLabel}>TOTAL AMOUNT</span>
            <span style={styles.footerTotalVal}>{getTotal()} RWF</span>
          </div>
          <button onClick={handleCheckout} style={styles.checkoutBtn}>
            Checkout
            <ArrowRight size={16} style={{ marginLeft: 6 }} />
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
  scrollContent: {
    flexGrow: 1,
    overflowY: 'auto',
    paddingBottom: '88px', // offset checkout button
  },
  promoBanner: {
    margin: '12px 16px 4px 16px',
    padding: '12px',
    backgroundColor: 'var(--color-primary-light)',
    border: '1.5px dashed var(--color-primary)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoLeft: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  promoTitle: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  promoDesc: {
    fontSize: '9px',
    color: 'var(--color-text-secondary)',
    marginTop: '1px',
  },
  joinBtn: {
    fontSize: '10px',
    fontWeight: '800',
    color: '#FFF',
    backgroundColor: 'var(--color-primary)',
    padding: '4px 10px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  itemsCard: {
    margin: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
  },
  cardHeader: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '16px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '8px',
  },
  itemRow: {
    display: 'flex',
    padding: '12px 0',
    borderBottom: '1px solid var(--color-border)',
    gap: '12px',
    '&:last-child': {
      borderBottom: 'none',
    }
  },
  itemImg: {
    width: '64px',
    height: '64px',
    objectFit: 'contain',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    backgroundColor: '#FFF',
  },
  itemDetails: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  itemName: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text)',
    cursor: 'pointer',
    lineHeight: '1.4',
  },
  itemMeta: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
    fontWeight: '500',
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '8px',
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    height: '28px',
    backgroundColor: 'var(--color-bg)',
  },
  qtyBtn: {
    width: '24px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  qtyVal: {
    fontSize: '11px',
    fontWeight: '800',
    width: '16px',
    textAlign: 'center',
  },
  deleteBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '4px',
  },
  itemPriceCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    minWidth: '70px',
  },
  itemPriceSum: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  guaranteeCard: {
    margin: '0 16px 12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
    padding: '0 8px',
  },
  billCard: {
    margin: '0 16px 16px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
  },
  billRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    padding: '6px 0',
    fontWeight: '600',
  },
  billTotalRow: {
    borderTop: '1px solid var(--color-border)',
    marginTop: '8px',
    paddingTop: '12px',
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
    textAlign: 'center',
    flexGrow: 1,
  },
  emptyIconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#EAECEE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  emptyDesc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '6px',
    lineHeight: '1.6',
    maxWidth: '280px',
    marginBottom: '24px',
  },
  shopNowBtn: {
    padding: '12px 32px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid var(--color-border)',
    padding: '12px 16px calc(12px + env(safe-area-inset-bottom)) 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 900,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
  },
  footerTextCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  footerTotalLabel: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.5px',
  },
  footerTotalVal: {
    fontSize: '18px',
    fontWeight: '900',
    color: 'var(--color-primary-dark)',
  },
  checkoutBtn: {
    width: '140px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
  }
};

export default MobileCart;
