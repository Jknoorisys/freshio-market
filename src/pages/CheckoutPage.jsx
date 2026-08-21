import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { useApp } from '../context/AppContext';
import { Phone, ArrowLeft, Loader2, Sparkles, MapPin, Calendar, Wallet } from 'lucide-react';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const styles = useResponsiveStyles(rawStyles);
  const { cart, getSubtotal, getDiscount, getDeliveryFee, getTax, getTotal, clearCart, addOrder, addToast } = useApp();

  // --- FORM STATE ---
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sector, setSector] = useState('Kimihurura');
  const [streetAddress, setStreetAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('express');
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [momoNumber, setMomoNumber] = useState('');
  
  // Checkout transactional simulation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [momoStep, setMomoStep] = useState(0); // 0: Idle, 1: Prompt Sent, 2: Accepted
  const [simulateFailure, setSimulateFailure] = useState(false);

  const subtotal = getSubtotal();
  const bulkDiscount = getDiscount();
  const shippingFee = getDeliveryFee();
  const vatAmount = getTax();
  const finalTotal = getTotal();

  const sectors = ['Kimihurura', 'Kiyovu', 'Nyarutarama', 'Remera', 'Kacyiru', 'Kibagabaga', 'Gacuriro', 'Kanombe'];

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !streetAddress.trim()) {
      addToast('Please fill in all required shipping fields', 'warning');
      return;
    }

    if (paymentMethod === 'momo' && !momoNumber.trim()) {
      addToast('Please provide your MTN Mobile Money number', 'warning');
      return;
    }

    setIsSubmitting(true);

    if (paymentMethod === 'momo') {
      // 1. Simulate sending MoMo push prompt
      setMomoStep(1);
      setTimeout(() => {
        // 2. Simulate prompt PIN accept
        setMomoStep(2);
        setTimeout(() => {
          completeMockCheckout();
        }, 1500);
      }, 3000);
    } else {
      // Direct placement for Cash on Delivery
      setTimeout(() => {
        completeMockCheckout();
      }, 1500);
    }
  };

  const completeMockCheckout = () => {
    if (paymentMethod === 'momo' && simulateFailure) {
      addToast('MoMo transaction declined/failed.', 'error');
      setIsSubmitting(false);
      setMomoStep(0);
      
      const failedOrder = {
        id: `FR-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        total: finalTotal,
        status: 'Failed',
        paymentMethod: 'MTN MoMo',
        deliverySlot: deliverySlot === 'express' ? 'Express (< 2 Hrs)' : 'Next Day standard',
        address: `${houseNumber ? `${houseNumber}, ` : ''}${streetAddress}, ${sector}, Kigali`,
        items: [...cart],
      };
      
      navigate('/order-success', { state: { order: failedOrder, status: 'failed' } });
      return;
    }

    // Generate mock order object
    const newOrder = {
      id: `FR-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      total: finalTotal,
      status: 'Placed',
      paymentMethod: paymentMethod === 'momo' ? 'MTN MoMo' : 'Cash on Delivery',
      deliverySlot: deliverySlot === 'express' ? 'Express (< 2 Hrs)' : 'Next Day standard',
      address: `${houseNumber ? `${houseNumber}, ` : ''}${streetAddress}, ${sector}, Kigali`,
      items: [...cart],
    };

    addOrder(newOrder);
    clearCart();
    addToast('Order placed successfully!', 'success');
    
    setIsSubmitting(false);
    setMomoStep(0);
    
    // Redirect to success page with order details
    navigate('/order-success', { state: { order: newOrder } });
  };

  if (cart.length === 0) {
    return (
      <div style={styles.errorPage}>
        <h2>Your basket is empty</h2>
        <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ borderRadius: '12px' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <button onClick={() => navigate('/cart')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Basket
        </button>

        <h1 style={styles.pageTitle}>Secure Checkout</h1>

        <div style={styles.layout}>
          {/* LEFT: CHECKOUT FORMS */}
          <div style={styles.formColumn}>
            <form onSubmit={handleSubmitOrder} style={styles.checkoutForm}>
              {/* SECTION 1: SHIPPING DETAILS */}
              <div style={styles.formSection}>
                <div style={styles.sectionHeader}>
                  <MapPin size={20} color="var(--color-primary-dark)" />
                  <h3 style={styles.sectionTitle}>1. Delivery Address</h3>
                </div>
                
                <div style={styles.inputGrid}>
                  <div style={styles.inputWrapper}>
                    <label style={styles.inputLabel}>Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Jean-Luc Nkurunziza"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={styles.inputText}
                      required
                    />
                  </div>
                  
                  <div style={styles.inputWrapper}>
                    <label style={styles.inputLabel}>Local Phone Number *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +250 788 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={styles.inputText}
                      required
                    />
                  </div>

                  <div style={styles.inputWrapper}>
                    <label style={styles.inputLabel}>Kigali Sector *</label>
                    <select 
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      style={styles.selectInput}
                    >
                      {sectors.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.inputWrapper}>
                    <label style={styles.inputLabel}>Street / Avenue Address *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. KG 7 Ave"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      style={styles.inputText}
                      required
                    />
                  </div>

                  <div style={styles.inputWrapper}>
                    <label style={styles.inputLabel}>House / Apartment Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. House 24B"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      style={styles.inputText}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DELIVERY WINDOW */}
              <div style={styles.formSection}>
                <div style={styles.sectionHeader}>
                  <Calendar size={20} color="var(--color-primary-dark)" />
                  <h3 style={styles.sectionTitle}>2. Choose Delivery Time</h3>
                </div>

                <div style={styles.slotsGrid}>
                  <label style={{
                    ...styles.slotCard,
                    borderColor: deliverySlot === 'express' ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: deliverySlot === 'express' ? 'var(--color-primary-light)' : '#FFFFFF',
                  }}>
                    <input 
                      type="radio" 
                      name="deliverySlot" 
                      value="express" 
                      checked={deliverySlot === 'express'} 
                      onChange={() => setDeliverySlot('express')} 
                      style={styles.radioInput}
                    />
                    <div style={styles.slotDetails}>
                      <span style={styles.slotName}>⚡ Superfast Express</span>
                      <span style={styles.slotDesc}>Delivered under 2 Hours (1,500 RWF fee)</span>
                    </div>
                  </label>

                  <label style={{
                    ...styles.slotCard,
                    borderColor: deliverySlot === 'morning' ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: deliverySlot === 'morning' ? 'var(--color-primary-light)' : '#FFFFFF',
                  }}>
                    <input 
                      type="radio" 
                      name="deliverySlot" 
                      value="morning" 
                      checked={deliverySlot === 'morning'} 
                      onChange={() => setDeliverySlot('morning')} 
                      style={styles.radioInput}
                    />
                    <div style={styles.slotDetails}>
                      <span style={styles.slotName}>🌅 Morning Slot</span>
                      <span style={styles.slotDesc}>Tomorrow 09:00 AM - 12:00 PM</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* SECTION 3: PAYMENT METHOD */}
              <div style={styles.formSection}>
                <div style={styles.sectionHeader}>
                  <Wallet size={20} color="var(--color-primary-dark)" />
                  <h3 style={styles.sectionTitle}>3. Payment Mode</h3>
                </div>

                <div style={styles.paymentSelector}>
                  <label style={{
                    ...styles.paymentOption,
                    borderColor: paymentMethod === 'momo' ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: paymentMethod === 'momo' ? 'var(--color-primary-light)' : '#FFFFFF',
                  }}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="momo" 
                      checked={paymentMethod === 'momo'} 
                      onChange={() => setPaymentMethod('momo')} 
                      style={styles.radioInput}
                    />
                    <div style={styles.paymentInfo}>
                      <span style={styles.paymentTitle}>MTN Mobile Money (MoMo)</span>
                      <span style={styles.paymentSub}>Instant phone push prompt</span>
                    </div>
                  </label>

                  <label style={{
                    ...styles.paymentOption,
                    borderColor: paymentMethod === 'cod' ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: paymentMethod === 'cod' ? 'var(--color-primary-light)' : '#FFFFFF',
                  }}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')} 
                      style={styles.radioInput}
                    />
                    <div style={styles.paymentInfo}>
                      <span style={styles.paymentTitle}>Cash on Delivery (CoD)</span>
                      <span style={styles.paymentSub}>Pay when groceries arrive</span>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'momo' && (
                  <div style={styles.momoInputBlock}>
                    <label style={styles.inputLabel}>MoMo Registered MTN Number *</label>
                    <div style={styles.momoInputGroup}>
                      <Phone size={16} color="var(--color-text-secondary)" style={styles.phoneIcon} />
                      <input 
                        type="text" 
                        placeholder="e.g. 0788300300"
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        style={styles.inputTextMomo}
                        required
                      />
                    </div>
                    <span style={styles.momoTip}>We will dispatch a secure prompt request to this number automatically.</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '12.5px', color: 'var(--color-error)', cursor: 'pointer', fontWeight: '700' }}>
                      <input 
                        type="checkbox" 
                        checked={simulateFailure} 
                        onChange={(e) => setSimulateFailure(e.target.checked)}
                        style={{ accentColor: 'var(--color-error)' }}
                      />
                      <span>Simulate transaction failure (decline/timeout)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Submit CTA button */}
              <button 
                type="submit" 
                className="btn btn-primary"
                style={styles.placeOrderBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="spinner" size={18} />
                    <span>Processing Checkout...</span>
                  </>
                ) : (
                  <span>Place Order ({finalTotal.toLocaleString()} RWF)</span>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: CHECKOUT ORDER REVIEW SUMMARY */}
          <div style={styles.summaryColumn}>
            <div style={styles.reviewCard}>
              <h4 style={styles.reviewTitle}>Order Review</h4>
              <div style={styles.itemsReviewList}>
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} style={styles.reviewItem}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={styles.reviewQty}>{quantity}x</span>
                      <div style={styles.reviewNameBlock}>
                        <span style={styles.reviewName}>{product.name}</span>
                        <span style={styles.reviewUnit}>{product.unit}</span>
                      </div>
                    </div>
                    <span style={styles.reviewPrice}>{(product.price * quantity).toLocaleString()} RWF</span>
                  </div>
                ))}
              </div>

              <div style={styles.reviewDivider}></div>

              <div style={styles.reviewLine}>
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} RWF</span>
              </div>
              {bulkDiscount > 0 && (
                <div style={{ ...styles.reviewLine, color: 'var(--color-primary)' }}>
                  <span>Loyalty Discount</span>
                  <span>-{bulkDiscount.toLocaleString()} RWF</span>
                </div>
              )}
              <div style={styles.reviewLine}>
                <span>Delivery</span>
                <span>{shippingFee === 0 ? 'FREE' : `${shippingFee.toLocaleString()} RWF`}</span>
              </div>
              <div style={styles.reviewLine}>
                <span>VAT (5%)</span>
                <span>{vatAmount.toLocaleString()} RWF</span>
              </div>

              <div style={styles.reviewDivider}></div>

              <div style={styles.reviewTotal}>
                <span>Grand Total</span>
                <span>{finalTotal.toLocaleString()} RWF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MONEY LOADER MODAL DIALOG */}
      {isSubmitting && paymentMethod === 'momo' && (
        <div style={styles.momoModalOverlay}>
          <div style={styles.momoModal}>
            <div style={styles.momoIconSpinner}>
              {momoStep === 1 ? (
                <Loader2 className="spinner" size={48} color="#FFCC00" />
              ) : (
                <Sparkles size={48} color="var(--color-primary)" />
              )}
            </div>
            {momoStep === 1 ? (
              <>
                <h3 style={styles.modalTitle}>MoMo Prompt Dispatched</h3>
                <p style={styles.modalDesc}>
                  We have sent a push checkout request to <strong>+250 {momoNumber}</strong>. Please check your handset and enter your PIN to approve the transaction.
                </p>
                <div style={styles.modalSpinnerSub}>Waiting for approval confirmation...</div>
              </>
            ) : (
              <>
                <h3 style={styles.modalTitle}>PIN Approved!</h3>
                <p style={styles.modalDesc}>
                  Payment successfully authorized. Sourcing and packaging your order at Kigali Heights flagship...
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const rawStyles = {
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
  layout: {
    display: 'flex',
    gap: '40px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      flexDirection: 'column-reverse',
    },
  },
  formColumn: {
    flexGrow: 1,
    width: '100%',
  },
  checkoutForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 16px rgba(22, 58, 53, 0.01)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1.5px solid var(--color-border)',
    paddingBottom: '14px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
    margin: 0,
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px 20px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  inputText: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    fontSize: '14px',
    outline: 'none',
    color: 'var(--color-text)',
  },
  selectInput: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    color: 'var(--color-text)',
  },
  slotsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  slotCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    border: '1.5px solid var(--color-border)',
    borderRadius: '12px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s',
  },
  radioInput: {
    width: '18px',
    height: '18px',
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  slotDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  slotName: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  slotDesc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  paymentSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    border: '1.5px solid var(--color-border)',
    borderRadius: '12px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  paymentInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  paymentTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  paymentSub: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  momoInputBlock: {
    backgroundColor: '#FAFBFB',
    border: '1.5px dashed var(--color-border)',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  momoInputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  phoneIcon: {
    position: 'absolute',
    left: '12px',
  },
  inputTextMomo: {
    width: '100%',
    padding: '10px 12px 10px 38px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    fontSize: '14px',
    outline: 'none',
  },
  momoTip: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  placeOrderBtn: {
    width: '100%',
    padding: '16px 0',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-md)',
  },
  summaryColumn: {
    width: '360px',
    flexShrink: 0,
    position: 'sticky',
    top: '100px',
    '@media (max-width: 900px)': {
      width: '100%',
      position: 'static',
    },
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '24px',
  },
  reviewTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  itemsReviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    maxHeight: '300px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  reviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  reviewQty: {
    color: 'var(--color-primary-dark)',
    fontWeight: '700',
  },
  reviewNameBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  reviewName: {
    color: 'var(--color-text)',
    fontWeight: '700',
  },
  reviewUnit: {
    fontSize: '11px',
  },
  reviewPrice: {
    color: 'var(--color-text)',
  },
  reviewDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '16px 0',
  },
  reviewLine: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    marginBottom: '10px',
    fontWeight: '600',
  },
  reviewTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  errorPage: {
    textAlign: 'center',
    padding: '100px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  momoModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(22, 58, 53, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  momoModal: {
    backgroundColor: '#FFFFFF',
    padding: '40px',
    borderRadius: '24px',
    maxWidth: '460px',
    width: '90%',
    textAlign: 'center',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  momoIconSpinner: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#FFFDF0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  modalDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  modalSpinnerSub: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: '8px',
  },
};
export default CheckoutPage;
