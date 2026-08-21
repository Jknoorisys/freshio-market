import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingBag, Plus, Minus, Tag, AlertCircle } from 'lucide-react';

export const CartPage = () => {
  const navigate = useNavigate();
  const styles = useResponsiveStyles(rawStyles);
  const { cart, updateCartQuantity, deleteFromCart, getSubtotal, getDiscount, getDeliveryFee, getTax, addToast } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState(null);

  // Constants aligned with AppContext defaults
  const FREE_SHIPPING_THRESHOLD = 15000;

  const subtotal = getSubtotal();
  const bulkDiscount = getDiscount();
  const shippingFee = getDeliveryFee();
  const vatAmount = getTax();
  const couponDiscount = activeCoupon ? activeCoupon.value : 0;
  
  const finalTotal = Math.max(0, subtotal - bulkDiscount - couponDiscount + shippingFee + vatAmount);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'KIGALI250') {
      setActiveCoupon({ code: 'KIGALI250', value: 250 });
      addToast('Promo KIGALI250 applied: 250 RWF discount!', 'success');
      setCouponCode('');
    } else if (code === 'FRESHIO1000' && subtotal >= 8000) {
      setActiveCoupon({ code: 'FRESHIO1000', value: 1000 });
      addToast('Promo FRESHIO1000 applied: 1,000 RWF discount!', 'success');
      setCouponCode('');
    } else if (code === 'FRESHIO1000') {
      addToast('Coupon requires minimum purchase of 8,000 RWF', 'warning');
    } else {
      addToast('Invalid voucher code. Try KIGALI250', 'error');
    }
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    addToast('Coupon code removed', 'info');
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyPage}>
        <div className="container" style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>🛒</div>
          <h2 style={styles.emptyTitle}>Your Basket is Empty</h2>
          <p style={styles.emptyDesc}>You haven't added any fresh groceries to your basket yet. Explore our Kigali marketplace to find organic produce and local treats!</p>
          <button onClick={() => navigate('/shop')} className="btn btn-primary" style={styles.shopBtn}>
            Start Sourcing Fresh Food
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.pageTitle}>My Shopping Basket</h1>

        <div style={styles.layout}>
          {/* LEFT: CART ITEMS LIST */}
          <div style={styles.itemsColumn}>
            <div style={styles.tableHeader}>
              <span style={styles.thProduct}>Product</span>
              <span style={styles.thPrice}>Price</span>
              <span style={styles.thQty}>Quantity</span>
              <span style={styles.thTotal}>Total</span>
            </div>

            {cart.map(({ product, quantity }) => (
              <div key={product.id} style={styles.cartRow}>
                {/* Product details */}
                <div style={styles.productCol}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={styles.itemImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/></svg>';
                    }}
                  />
                  <div style={styles.itemDetails}>
                    <span style={styles.itemBrand}>{product.brand}</span>
                    <h3 style={styles.itemName}>{product.name}</h3>
                    <span style={styles.itemUnit}>{product.unit}</span>
                  </div>
                </div>

                {/* Price */}
                <div style={styles.priceCol}>
                  <span style={styles.priceText}>{product.price.toLocaleString()} RWF</span>
                </div>

                {/* Qty edit */}
                <div style={styles.qtyCol}>
                  <div style={styles.qtyControl}>
                    <button 
                      onClick={() => updateCartQuantity(product.id, quantity - 1)} 
                      style={styles.qtyBtn}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={styles.qtyVal}>{quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(product.id, quantity + 1)} 
                      style={styles.qtyBtn}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => { deleteFromCart(product.id); addToast(`Removed ${product.name}`, 'info'); }} style={styles.deleteBtn}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>

                {/* Total */}
                <div style={styles.totalCol}>
                  <span style={styles.totalText}>
                    {(product.price * quantity).toLocaleString()} RWF
                  </span>
                </div>
              </div>
            ))}

            {/* Coupons section */}
            <div style={styles.couponBlock}>
              <h4 style={styles.couponTitle}>Do you have a voucher code?</h4>
              {activeCoupon ? (
                <div style={styles.activeCouponBox}>
                  <Tag size={16} />
                  <span>Coupon <strong>{activeCoupon.code}</strong> applied (-{activeCoupon.value} RWF)</span>
                  <button onClick={removeCoupon} style={styles.removeCouponBtn}>Remove</button>
                </div>
              ) : (
                <div style={styles.couponInputGroup}>
                  <input 
                    type="text" 
                    placeholder="Enter code e.g. KIGALI250"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={styles.couponInput}
                  />
                  <button onClick={applyCoupon} className="btn btn-primary" style={styles.couponApplyBtn}>
                    Apply
                  </button>
                </div>
              )}
              <span style={styles.couponHint}>Tip: Try code <strong>KIGALI250</strong> for a prompt test discount.</span>
            </div>
          </div>

          {/* RIGHT: BILL SUMMARY SECTION */}
          <div style={styles.summaryColumn}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Basket Summary</h3>

              {/* Subtotal */}
              <div style={styles.summaryLine}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryVal}>{subtotal.toLocaleString()} RWF</span>
              </div>

              {/* Bulk discount indicator */}
              {bulkDiscount > 0 && (
                <div style={{ ...styles.summaryLine, color: 'var(--color-primary)' }}>
                  <span style={styles.summaryLabel}>Loyalty Discount</span>
                  <span style={styles.summaryVal}>-{bulkDiscount.toLocaleString()} RWF</span>
                </div>
              )}

              {/* Coupon discounts */}
              {activeCoupon && (
                <div style={{ ...styles.summaryLine, color: 'var(--color-primary)' }}>
                  <span style={styles.summaryLabel}>Voucher Discount</span>
                  <span style={styles.summaryVal}>-{couponDiscount.toLocaleString()} RWF</span>
                </div>
              )}

              {/* Shipping fees */}
              <div style={styles.summaryLine}>
                <span style={styles.summaryLabel}>Delivery Fee</span>
                <span style={styles.summaryVal}>
                  {shippingFee === 0 ? 'FREE' : `${shippingFee.toLocaleString()} RWF`}
                </span>
              </div>

              {/* Taxes */}
              <div style={styles.summaryLine}>
                <span style={styles.summaryLabel}>Taxes (5% VAT)</span>
                <span style={styles.summaryVal}>{vatAmount.toLocaleString()} RWF</span>
              </div>

              {/* Free delivery bar indicator */}
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div style={styles.freeShippingAlert}>
                  <AlertCircle size={14} color="var(--color-primary-dark)" />
                  <span>
                    Add <strong>{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} RWF</strong> more for <strong>FREE Delivery</strong>!
                  </span>
                </div>
              )}

              <div style={styles.summaryDivider}></div>

              {/* Total final amount */}
              <div style={styles.totalLine}>
                <span style={styles.totalLabel}>Grand Total</span>
                <span style={styles.totalVal}>{finalTotal.toLocaleString()} RWF</span>
              </div>

              {/* Action buttons */}
              <button 
                onClick={() => navigate('/checkout')} 
                className="btn btn-primary"
                style={styles.checkoutBtn}
              >
                Proceed to Shipping & MoMo
              </button>

              <button 
                onClick={() => navigate('/shop')} 
                style={styles.continueBtn}
              >
                Continue Sourcing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const rawStyles = {
  page: {
    padding: '40px 0 80px 0',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '32px',
  },
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
    },
  },
  itemsColumn: {
    flexGrow: 1,
    width: '100%',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '12px 20px',
    backgroundColor: '#FAFBFB',
    border: '1.5px solid var(--color-border)',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '16px',
    '@media (max-width: 600px)': {
      display: 'none',
    },
  },
  thProduct: { textAlign: 'left' },
  thPrice: { textAlign: 'center' },
  thQty: { textAlign: 'center' },
  thTotal: { textAlign: 'right' },
  cartRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '16px',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(22, 58, 53, 0.01)',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
      gap: '12px',
      textAlign: 'center',
    },
  },
  productCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'left',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      textAlign: 'center',
    },
  },
  itemImage: {
    width: '64px',
    height: '64px',
    objectFit: 'contain',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    padding: '4px',
    backgroundColor: '#FFFFFF',
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemBrand: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
    margin: '2px 0 4px 0',
  },
  itemUnit: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  priceCol: {
    textAlign: 'center',
  },
  priceText: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  qtyCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--color-border)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  qtyBtn: {
    border: 'none',
    background: 'none',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--color-text)',
    transition: 'background-color 0.2s',
  },
  qtyVal: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-text)',
    width: '24px',
    textAlign: 'center',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-error)',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: 0,
  },
  totalCol: {
    textAlign: 'right',
    '@media (max-width: 600px)': {
      textAlign: 'center',
      borderTop: '1px solid var(--color-border)',
      paddingTop: '8px',
    },
  },
  totalText: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  couponBlock: {
    backgroundColor: 'var(--color-primary-light)',
    borderRadius: '16px',
    padding: '24px',
    border: '1.5px solid rgba(39, 158, 83, 0.08)',
  },
  couponTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    marginBottom: '12px',
  },
  activeCouponBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FFFFFF',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid var(--color-primary)',
    fontSize: '13px',
    color: 'var(--color-text)',
    width: 'fit-content',
  },
  removeCouponBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-error)',
    fontWeight: '700',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: 0,
    marginLeft: '12px',
  },
  couponInputGroup: {
    display: 'flex',
    gap: '12px',
    maxWidth: '400px',
    marginBottom: '8px',
  },
  couponInput: {
    flexGrow: 1,
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    fontSize: '14px',
    outline: 'none',
  },
  couponApplyBtn: {
    padding: '0 24px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
  },
  couponHint: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  summaryColumn: {
    width: '380px',
    flexShrink: 0,
    position: 'sticky',
    top: '100px',
    '@media (max-width: 900px)': {
      width: '100%',
      position: 'static',
    },
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 24px rgba(22, 58, 53, 0.02)',
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '20px',
  },
  summaryLine: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    marginBottom: '14px',
    fontWeight: '600',
  },
  summaryLabel: {},
  summaryVal: {
    color: 'var(--color-text)',
  },
  freeShippingAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--color-primary-light)',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '11px',
    color: 'var(--color-primary-dark)',
    marginBottom: '16px',
    fontWeight: '700',
  },
  summaryDivider: {
    height: '1.5px',
    backgroundColor: 'var(--color-border)',
    margin: '16px 0',
  },
  totalLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '24px',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  totalVal: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px 0',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  continueBtn: {
    width: '100%',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    fontWeight: '700',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: '4px 0',
    transition: 'color 0.2s',
  },
  emptyPage: {
    padding: '80px 24px',
  },
  emptyContainer: {
    maxWidth: '500px',
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  emptyIcon: {
    fontSize: '72px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  emptyDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  shopBtn: {
    borderRadius: '12px',
    padding: '12px 28px',
    fontSize: '14px',
    fontWeight: '700',
  },
};
export default CartPage;
