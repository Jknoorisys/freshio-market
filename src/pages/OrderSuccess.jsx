import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Calendar, MapPin, Truck, HelpCircle } from 'lucide-react';

export const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve mock order object passed from checkout redirect state
  const order = location.state?.order || {
    id: `FR-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    total: 8600,
    paymentMethod: 'MTN MoMo',
    deliverySlot: 'Express (< 2 Hrs)',
    address: 'KG 7 Ave, Kimihurura, Kigali',
    items: [],
  };

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.page}>
      <div className="container" style={styles.cardContainer}>
        {/* Animated Check Shield */}
        <div style={styles.successIconShield} className="category-icon-pop">
          <div style={styles.iconCircle}>
            <Check size={40} color="#FFFFFF" strokeWidth={3} />
          </div>
        </div>

        <span style={styles.successBadge}>TRANSACTION CONFIRMED</span>
        <h1 style={styles.successTitle}>Thank You for Sourcing!</h1>
        <p style={styles.successDesc}>
          Your order has been received and is being sourced from our local farms. A MoMo transaction receipt has been sent to your phone.
        </p>

        {/* ORDER DETAILS RECEIPT CARD */}
        <div style={styles.receiptCard}>
          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Order Number</span>
            <strong style={styles.receiptValue}>{order.id}</strong>
          </div>
          
          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Date</span>
            <span style={styles.receiptValue}>{order.date}</span>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Amount Paid</span>
            <strong style={{ ...styles.receiptValue, color: 'var(--color-primary-dark)' }}>
              {order.total.toLocaleString()} RWF
            </strong>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Payment Method</span>
            <span style={styles.receiptValue}>{order.paymentMethod}</span>
          </div>

          <div style={styles.receiptRow}>
            <span style={styles.receiptLabel}>Delivery Slot</span>
            <span style={styles.receiptValue}>{order.deliverySlot}</span>
          </div>

          <div style={styles.receiptDivider}></div>

          <div style={styles.receiptInfoRow}>
            <MapPin size={16} color="var(--color-text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={styles.receiptInfoBlock}>
              <span style={styles.infoTitle}>Delivery Address</span>
              <span style={styles.infoText}>{order.address}</span>
            </div>
          </div>
        </div>

        {/* ORDER TIMELINE TRACKER */}
        <div style={styles.trackerBlock}>
          <h3 style={styles.trackerTitle}>Delivery Progress</h3>
          <div style={styles.timeline}>
            <div style={styles.timelineStep}>
              <div style={{ ...styles.stepDot, backgroundColor: 'var(--color-primary)' }}>
                <Check size={10} color="#FFFFFF" />
              </div>
              <div style={styles.stepContent}>
                <span style={{ ...styles.stepName, fontWeight: '800', color: 'var(--color-text)' }}>Order Placed</span>
                <span style={styles.stepDesc}>We have received your payment check</span>
              </div>
            </div>

            <div style={styles.timelineStep}>
              <div style={{ ...styles.stepDot, backgroundColor: 'var(--color-primary)' }}>
                <div style={styles.pulseInner}></div>
              </div>
              <div style={styles.stepContent}>
                <span style={{ ...styles.stepName, fontWeight: '800', color: 'var(--color-text)' }}>Sourcing Fresh Produce</span>
                <span style={styles.stepDesc}>Shoppers are packing items from cold counters</span>
              </div>
            </div>

            <div style={styles.timelineStep}>
              <div style={styles.stepDot}></div>
              <div style={styles.stepContent}>
                <span style={styles.stepName}>Out for Delivery</span>
                <span style={styles.stepDesc}>Express rider dispatching to your sector</span>
              </div>
            </div>
          </div>
        </div>

        {/* Redirect Action CTAs */}
        <div style={styles.actions}>
          <button 
            onClick={() => navigate('/account')} 
            className="btn btn-primary"
            style={styles.historyBtn}
          >
            Track Order In History
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-outline"
            style={styles.homeBtn}
          >
            Continue Shopping
          </button>
        </div>

        {/* Helplines */}
        <div style={styles.helpBlock}>
          <HelpCircle size={14} color="var(--color-text-secondary)" />
          <span>Need help? Dial our Kigali Heights helpline: <strong>+250 788 310 120</strong></span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '64px 0 96px 0',
  },
  cardContainer: {
    maxWidth: '560px',
    margin: '0 auto',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '24px',
    padding: '48px 36px',
    boxShadow: '0 8px 32px rgba(22, 58, 53, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successIconShield: {
    marginBottom: '20px',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(39, 158, 83, 0.25)',
  },
  successBadge: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--color-primary)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '12px',
  },
  successDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
    marginBottom: '32px',
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#FAFBFB',
    border: '1.5px solid var(--color-border)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
    textAlign: 'left',
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    marginBottom: '10px',
    fontWeight: '600',
  },
  receiptLabel: {},
  receiptValue: {
    color: 'var(--color-text)',
  },
  receiptDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '16px 0',
  },
  receiptInfoRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'start',
  },
  receiptInfoBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  infoTitle: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text)',
    textTransform: 'uppercase',
  },
  infoText: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
  },
  trackerBlock: {
    width: '100%',
    textAlign: 'left',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '16px',
    padding: '20px 24px',
    marginBottom: '36px',
  },
  trackerTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    position: 'relative',
    paddingLeft: '16px',
    borderLeft: '2px solid var(--color-border)',
    marginLeft: '6px',
  },
  timelineStep: {
    display: 'flex',
    gap: '16px',
    position: 'relative',
  },
  stepDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    border: '2px solid var(--color-border)',
    position: 'absolute',
    left: '-24px',
    top: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    animation: 'pulse 1.5s infinite',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  stepName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  },
  stepDesc: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
  },
  actions: {
    display: 'flex',
    gap: '16px',
    width: '100%',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  historyBtn: {
    flexGrow: 1,
    padding: '12px 0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  homeBtn: {
    flexGrow: 1,
    padding: '12px 0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
  },
  helpBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
};
export default OrderSuccess;
