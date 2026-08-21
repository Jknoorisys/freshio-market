import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Clipboard, ArrowRight, ShoppingCart, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileNavBar } from '../../components/mobile/MobileNavBar';

export const MobileOrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast, orders } = useApp();

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const orderId = queryParams.get('orderId') || 'FR-99881';

  const orderData = useMemo(() => {
    return orders.find((o) => o.id === orderId) || {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      total: 5400,
      address: 'Kigali Heights, Kimihurura, Kigali',
      paymentMethod: 'MTN Mobile Money',
      deliverySlot: 'Today, 4:00 PM - 6:00 PM',
    };
  }, [orders, orderId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderId);
    addToast('Order ID copied to clipboard!', 'success');
  };

  return (
    <div style={styles.container}>
      <MobileNavBar title="Order Success" showBack={false} />

      <div style={styles.content}>
        {/* Animated Checkmark Circle */}
        <div style={styles.successCircle}>
          <Check size={40} color="#FFFFFF" strokeWidth={3} />
        </div>

        <h2 style={styles.title}>Thank You!</h2>
        <h3 style={styles.subtitle}>Order Placed Successfully</h3>
        <p style={styles.desc}>
          Your order has been sent to our Sawa Citi Kigali heights shopper. You'll receive delivery updates shortly.
        </p>

        {/* Order Details Receipt Card */}
        <div style={styles.receiptCard}>
          <div style={styles.receiptHeader}>
            <span>Order ID</span>
            <div style={styles.orderIdRow}>
              <span style={styles.orderIdVal}>{orderId}</span>
              <button onClick={copyToClipboard} style={styles.copyBtn}>
                <Clipboard size={14} color="var(--color-primary)" />
              </button>
            </div>
          </div>
          
          <div style={styles.receiptRow}>
            <span style={styles.rLabel}>Delivery Slot</span>
            <span style={styles.rVal}>{orderData.deliverySlot}</span>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.rLabel}>Payment Method</span>
            <span style={styles.rVal}>{orderData.paymentMethod}</span>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.rLabel}>Address</span>
            <span style={{ ...styles.rVal, textAlign: 'right', maxWidth: '160px' }}>{orderData.address}</span>
          </div>

          <div style={{ ...styles.receiptRow, ...styles.totalRow }}>
            <span style={styles.totalLabel}>Total Paid</span>
            <span style={styles.totalVal}>{orderData.total} RWF</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate(`/mobile/orders/${orderId}`)}
          style={styles.trackBtn}
        >
          Track Your Delivery
          <ArrowRight size={16} style={{ marginLeft: 8 }} />
        </button>

        {/* Secondary Action button */}
        <button
          onClick={() => navigate('/mobile')}
          style={styles.homeBtn}
        >
          <Home size={16} style={{ marginRight: 8 }} />
          Back To Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#FFFDF7',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 24px',
    textAlign: 'center',
    flexGrow: 1,
    overflowY: 'auto',
  },
  successCircle: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-success)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(32, 184, 107, 0.3)',
    marginBottom: '20px',
    marginTop: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginTop: '4px',
  },
  desc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    marginTop: '8px',
    maxWidth: '280px',
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    width: '100%',
    marginTop: '28px',
    boxShadow: 'var(--shadow-sm)',
    boxSizing: 'border-box',
  },
  receiptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px dashed var(--color-border)',
    paddingBottom: '10px',
    marginBottom: '10px',
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
  },
  orderIdRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  orderIdVal: {
    fontSize: '13px',
    color: 'var(--color-text)',
    fontWeight: '900',
  },
  copyBtn: {
    border: 'none',
    backgroundColor: 'var(--color-primary-light)',
    padding: '4px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  rLabel: {
    color: 'var(--color-text-secondary)',
  },
  rVal: {
    color: 'var(--color-text)',
    fontWeight: '700',
  },
  totalRow: {
    borderTop: '1px solid var(--color-border)',
    marginTop: '8px',
    paddingTop: '10px',
  },
  totalLabel: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  totalVal: {
    fontSize: '15px',
    fontWeight: '900',
    color: 'var(--color-primary-dark)',
  },
  trackBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-md)',
  },
  homeBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: '#FFFFFF',
    color: 'var(--color-text-secondary)',
    fontWeight: '700',
    fontSize: '13px',
    border: '1.5px solid var(--color-border)',
    cursor: 'pointer',
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default MobileOrderSuccess;
