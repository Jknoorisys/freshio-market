import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Clock, MapPin, CreditCard, Check } from 'lucide-react';

export const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const styles = useResponsiveStyles(rawStyles);
  const { orders } = useApp();

  // Find matching order in user session history, or fallback to mock order
  const order = useMemo(() => {
    return orders.find(o => o.id === id) || {
      id: id || 'FR-82914',
      date: 'August 21, 2026',
      total: 8600,
      status: 'Placed',
      paymentMethod: 'MTN MoMo',
      deliverySlot: 'Express (< 2 Hrs)',
      address: 'KG 7 Ave, Kimihurura, Kigali, Rwanda',
      items: [
        {
          quantity: 2,
          product: { id: 'p9', name: 'Inyange Fresh Whole Milk 1L', price: 1100, unit: '1L bottle', brand: 'Inyange Industries', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80' }
        },
        {
          quantity: 1,
          product: { id: 'p26', name: 'Akabanga Chili Oil 100ml', price: 2000, unit: '100ml dropper bottle', brand: 'Sina Gerard (Urwibutso)', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' }
        },
        {
          quantity: 2,
          product: { id: 'p12', name: 'Local Free-Range Farm Eggs', price: 2200, unit: 'carton of 12', brand: 'Bugesera Farm', image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80' }
        }
      ]
    };
  }, [id, orders]);

  // Status mapping to timeline steps
  const steps = [
    { name: 'Order Placed', desc: 'MoMo transaction verified', status: 'completed' },
    { name: 'Preparing', desc: 'Shoppers collecting fresh crops at Kigali Heights', status: 'completed' },
    { name: 'Packing', desc: 'Sealed inside biodegradable thermal pouches', status: 'pending' },
    { name: 'On the Way', desc: 'Courier dispatching to your sector', status: 'pending' },
    { name: 'Delivered', desc: 'Received at doorstep', status: 'pending' }
  ];

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <button onClick={() => navigate('/account/orders')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Track Order #{order.id}</h1>
            <span style={styles.dateText}>Placed on {order.date}</span>
          </div>
          <span style={styles.statusBadge}>{order.status}</span>
        </div>

        <div style={styles.layout}>
          {/* LEFT: TIMELINE TRACKER */}
          <div style={styles.timelineColumn}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Real-time Tracker</h3>
              
              <div style={styles.timeline}>
                {steps.map((step, idx) => (
                  <div key={idx} style={styles.timelineStep}>
                    <div style={{
                      ...styles.stepIndicator,
                      borderColor: step.status === 'completed' ? 'var(--color-primary)' : 'var(--color-border)',
                      backgroundColor: step.status === 'completed' ? 'var(--color-primary)' : '#FFFFFF'
                    }}>
                      {step.status === 'completed' ? (
                        <Check size={10} color="#FFFFFF" />
                      ) : null}
                    </div>
                    <div style={styles.stepContent}>
                      <span style={{
                        ...styles.stepName,
                        color: step.status === 'completed' ? 'var(--color-text)' : 'var(--color-text-secondary)',
                        fontWeight: step.status === 'completed' ? '800' : '600'
                      }}>
                        {step.name}
                      </span>
                      <span style={styles.stepDesc}>{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ORDER ITEMS TABLE */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Items Sourced</h3>
              <div style={styles.itemsList}>
                {order.items.map(({ product, quantity }, idx) => (
                  <div key={idx} style={styles.itemRow}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={styles.itemImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/></svg>';
                        }}
                      />
                      <div style={styles.itemMeta}>
                        <span style={styles.itemBrand}>{product.brand}</span>
                        <h4 style={styles.itemName}>{product.name}</h4>
                        <span style={styles.itemQty}>{quantity}x &bull; {product.unit}</span>
                      </div>
                    </div>
                    <span style={styles.itemPrice}>
                      {(product.price * quantity).toLocaleString()} RWF
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: SHIPPING / PAYMENT DETAILS CARD */}
          <div style={styles.detailsColumn}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Shipping & Payment</h3>
              
              <div style={styles.infoWidget}>
                <MapPin size={18} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
                <div style={styles.widgetTextCol}>
                  <span style={styles.widgetLabel}>Delivery Address</span>
                  <span style={styles.widgetValue}>{order.address}</span>
                </div>
              </div>

              <div style={styles.infoWidget}>
                <Clock size={18} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
                <div style={styles.widgetTextCol}>
                  <span style={styles.widgetLabel}>Delivery Slot</span>
                  <span style={styles.widgetValue}>{order.deliverySlot}</span>
                </div>
              </div>

              <div style={styles.infoWidget}>
                <CreditCard size={18} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
                <div style={styles.widgetTextCol}>
                  <span style={styles.widgetLabel}>Billing Details</span>
                  <span style={styles.widgetValue}>{order.paymentMethod} checkout</span>
                </div>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.summaryLine}>
                <span>Order Subtotal</span>
                <span>{order.total.toLocaleString()} RWF</span>
              </div>
              <div style={styles.summaryLine}>
                <span>Delivery Charge</span>
                <span>FREE</span>
              </div>
              <div style={styles.totalLine}>
                <span>Total Amount</span>
                <strong>{order.total.toLocaleString()} RWF</strong>
              </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--color-text)',
    margin: '0 0 6px 0',
  },
  dateText: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
  },
  statusBadge: {
    backgroundColor: '#FFFDE7',
    color: '#F57F17',
    padding: '6px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '800',
  },
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
    },
  },
  timelineColumn: {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 4px 16px rgba(22, 58, 53, 0.01)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '20px',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingLeft: '16px',
    borderLeft: '2px solid var(--color-border)',
    marginLeft: '6px',
  },
  timelineStep: {
    display: 'flex',
    gap: '16px',
    position: 'relative',
  },
  stepIndicator: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    position: 'absolute',
    left: '-24px',
    top: '3px',
    border: '2px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  stepName: {
    fontSize: '14px',
  },
  stepDesc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px dashed var(--color-border)',
    paddingBottom: '16px',
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
  },
  itemImage: {
    width: '50px',
    height: '50px',
    objectFit: 'contain',
    border: '1.5px solid var(--color-border)',
    borderRadius: '8px',
    padding: '2px',
    backgroundColor: '#FFFFFF',
  },
  itemMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemBrand: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
    margin: '2px 0',
  },
  itemQty: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  itemPrice: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  detailsColumn: {
    width: '360px',
    flexShrink: 0,
    position: 'sticky',
    top: '100px',
    '@media (max-width: 900px)': {
      width: '100%',
      position: 'static',
    },
  },
  infoWidget: {
    display: 'flex',
    gap: '12px',
    alignItems: 'start',
    marginBottom: '20px',
  },
  widgetTextCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  widgetLabel: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  widgetValue: {
    fontSize: '14px',
    color: 'var(--color-text)',
    lineHeight: '1.4',
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '20px 0',
  },
  summaryLine: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13.5px',
    color: 'var(--color-text-secondary)',
    marginBottom: '10px',
    fontWeight: '600',
  },
  totalLine: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginTop: '12px',
  },
};
export default OrderDetail;
