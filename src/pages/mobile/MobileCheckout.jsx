import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, Calendar, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileNavBar } from '../../components/mobile/MobileNavBar';

export const MobileCheckout = () => {
  const navigate = useNavigate();
  const {
    cart,
    getTotal,
    user,
    placeOrder,
    selectedLocation,
    addToast
  } = useApp();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/mobile');
    }
  }, [cart, navigate]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: `${selectedLocation}, Kigali, Rwanda`,
    deliverySlot: 'Today, 4:00 PM - 6:00 PM',
    paymentMethod: 'MTN Mobile Money'
  });

  const slots = [
    'Today, 4:00 PM - 6:00 PM',
    'Today, 6:00 PM - 8:00 PM',
    'Tomorrow, 9:00 AM - 11:00 AM',
    'Tomorrow, 11:00 AM - 1:00 PM',
    'Tomorrow, 2:00 PM - 4:00 PM'
  ];

  const paymentMethods = [
    { id: 'MTN Mobile Money', label: 'MTN Mobile Money (MoMo)', details: 'Instant pay mock request to +250 78x xxx' },
    { id: 'Credit/Debit Card', label: 'Credit/Debit Card', details: 'Visa, Mastercard, UnionPay' },
    { id: 'Cash on Delivery', label: 'Cash or MoMo on Delivery', details: 'Pay our courier at your door' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }
    if (!formData.phone.trim()) {
      addToast('Please enter your phone number', 'error');
      return;
    }
    if (!formData.address.trim()) {
      addToast('Please specify delivery address details', 'error');
      return;
    }

    const orderId = placeOrder(
      formData.address,
      formData.deliverySlot,
      formData.paymentMethod
    );
    navigate(`/mobile/order-success?orderId=${orderId}`);
  };

  return (
    <div style={styles.container}>
      <MobileNavBar title="Checkout Details" />

      <form onSubmit={handlePlaceOrderSubmit} style={styles.scrollContent}>
        {/* Contact info card */}
        <div style={styles.sectionCard}>
          <h3 style={styles.cardHeader}>1. Contact Information</h3>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={16} color="var(--color-text-secondary)" style={{ marginRight: 8 }} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <div style={styles.inputWrapper}>
              <Phone size={16} color="var(--color-text-secondary)" style={{ marginRight: 8 }} />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+250 788 000 000"
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Delivery Details card */}
        <div style={styles.sectionCard}>
          <h3 style={styles.cardHeader}>2. Delivery Details</h3>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Delivery Address</label>
            <div style={styles.inputWrapper}>
              <MapPin size={16} color="var(--color-text-secondary)" style={{ marginRight: 8, alignSelf: 'flex-start', marginTop: '10px' }} />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, House number, apartment info"
                style={styles.textarea}
                rows={3}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Delivery Slot</label>
            <div style={styles.inputWrapper}>
              <Calendar size={16} color="var(--color-text-secondary)" style={{ marginRight: 8 }} />
              <select
                name="deliverySlot"
                value={formData.deliverySlot}
                onChange={handleChange}
                style={styles.select}
              >
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Payment Methods card */}
        <div style={styles.sectionCard}>
          <h3 style={styles.cardHeader}>3. Payment Method</h3>
          <div style={styles.payList}>
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                style={{
                  ...styles.payLabel,
                  borderColor: formData.paymentMethod === method.id ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: formData.paymentMethod === method.id ? 'var(--color-primary-light)' : '#FFF',
                }}
              >
                <div style={styles.payRadioCol}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={handleChange}
                    style={styles.radioInput}
                  />
                  <div style={styles.payTextCol}>
                    <div style={styles.payName}>{method.label}</div>
                    <div style={styles.payDetails}>{method.details}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Review Items overview */}
        <div style={styles.sectionCard}>
          <h3 style={styles.cardHeader}>4. Review Items ({cart.length})</h3>
          <div style={styles.reviewList}>
            {cart.map((item) => (
              <div key={item.product.id} style={styles.reviewItem}>
                <span style={styles.reviewQty}>{item.quantity}x</span>
                <span style={styles.reviewName}>{item.product.name}</span>
                <span style={styles.reviewPrice}>{(item.product.price * item.quantity)} RWF</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div style={styles.stickyFooter}>
          <div style={styles.footerTextCol}>
            <span style={styles.footerTotalLabel}>ORDER TOTAL</span>
            <span style={styles.footerTotalVal}>{getTotal()} RWF</span>
          </div>
          <button type="submit" style={styles.submitBtn}>
            Place Order
            <ArrowRight size={16} style={{ marginLeft: 6 }} />
          </button>
        </div>
      </form>
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
    paddingBottom: '88px', // offset place order button
  },
  sectionCard: {
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
    marginBottom: '14px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '6px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '12px',
    '&:last-child': {
      marginBottom: 0,
    }
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '0 12px',
    height: '42px',
    backgroundColor: 'var(--color-bg)',
  },
  input: {
    flexGrow: 1,
    border: 'none',
    fontSize: '13px',
    color: 'var(--color-text)',
    backgroundColor: 'transparent',
    fontWeight: '500',
    outline: 'none',
  },
  textarea: {
    flexGrow: 1,
    border: 'none',
    fontSize: '13px',
    color: 'var(--color-text)',
    backgroundColor: 'transparent',
    fontWeight: '500',
    padding: '8px 0',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
  },
  select: {
    flexGrow: 1,
    border: 'none',
    fontSize: '13px',
    color: 'var(--color-text)',
    backgroundColor: 'transparent',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
  },
  payList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  payLabel: {
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s',
  },
  payRadioCol: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  radioInput: {
    marginTop: '3px',
    accentColor: 'var(--color-primary)',
  },
  payTextCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  payName: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  payDetails: {
    fontSize: '9px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  reviewItem: {
    display: 'flex',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  },
  reviewQty: {
    width: '28px',
    color: 'var(--color-primary)',
    fontWeight: '800',
  },
  reviewName: {
    flexGrow: 1,
    color: 'var(--color-text)',
  },
  reviewPrice: {
    fontWeight: '700',
    color: 'var(--color-text)',
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
  submitBtn: {
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

export default MobileCheckout;
