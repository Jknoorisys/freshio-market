import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, MapPin, Calendar, Clock, CreditCard, ChevronLeft, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileNavBar } from '../../components/mobile/MobileNavBar';

export const MobileOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useApp();

  const order = useMemo(() => {
    return (orders || []).find((o) => String(o.id) === String(id));
  }, [orders, id]);

  if (!order) {
    return (
      <div style={styles.errorContainer}>
        <MobileNavBar title="Order Details" />
        <div style={styles.errorContent}>
          <h2>Order Not Found</h2>
          <p>We couldn't retrieve the details for order {id}.</p>
          <button onClick={() => navigate('/mobile/orders')} style={styles.errorBtn}>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Tracking status indicators logic
  const isDelivered = order.status === 'Delivered';
  const steps = [
    { label: 'Order Placed', desc: 'Sawa Citi has received your order', completed: true, active: false },
    { label: 'Packed & Ready', desc: 'Shopper selected fresh items', completed: true, active: false },
    { label: 'Out For Delivery', desc: 'Courier is heading to your Kigali address', completed: isDelivered, active: !isDelivered },
    { label: 'Delivered', desc: order.deliverySlot || 'Delivered to your doorstep', completed: isDelivered, active: false }
  ];

  return (
    <div style={styles.container}>
      <MobileNavBar title={`Order details: ${order.id}`} />

      <div style={styles.scrollContent}>
        {/* Track Timeline Status Card */}
        <div style={styles.sectionCard}>
          <h3 style={styles.cardHeader}>Delivery Progress</h3>
          <div style={styles.timeline}>
            {steps.map((step, idx) => (
              <div key={idx} style={styles.timelineItem}>
                <div style={styles.timelineLeftCol}>
                  <div
                    style={{
                      ...styles.timelineDot,
                      backgroundColor: step.completed
                        ? 'var(--color-primary)'
                        : step.active
                        ? 'var(--color-orange)'
                        : 'var(--color-border)',
                      border: step.active ? '3px solid var(--color-orange-light)' : 'none',
                    }}
                  >
                    {step.completed && <span style={styles.timelineCheck}>✓</span>}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      style={{
                        ...styles.timelineLine,
                        backgroundColor: step.completed ? 'var(--color-primary)' : 'var(--color-border)',
                      }}
                    />
                  )}
                </div>
                <div style={styles.timelineRightCol}>
                  <div
                    style={{
                      ...styles.stepLabel,
                      fontWeight: step.active || step.completed ? '800' : '600',
                      color: step.active
                        ? 'var(--color-orange)'
                        : step.completed
                        ? 'var(--color-text)'
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    {step.label}
                  </div>
                  <div style={styles.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courier dispatch card */}
        <div style={styles.courierCard}>
          <Truck size={20} color="var(--color-primary)" />
          <div style={styles.courierInfo}>
            <div style={styles.courierTitle}>Sawa Citi Kigali Courier</div>
            <div style={styles.courierDesc}>Status: {order.status} • Delivery ETA: 2h</div>
          </div>
        </div>

        {/* Delivery Details */}
        <div style={styles.sectionCard}>
          <h3 style={styles.cardHeader}>Delivery Information</h3>
          
          <div style={styles.infoRow}>
            <MapPin size={16} color="var(--color-text-secondary)" style={{ marginRight: 8, marginTop: '2px' }} />
            <div>
              <div style={styles.infoTitle}>Delivery Address</div>
              <div style={styles.infoDesc}>{order.address}</div>
            </div>
          </div>

          <div style={{ ...styles.infoRow, marginTop: '12px' }}>
            <Calendar size={16} color="var(--color-text-secondary)" style={{ marginRight: 8, marginTop: '2px' }} />
            <div>
              <div style={styles.infoTitle}>Delivery Time Window</div>
              <div style={styles.infoDesc}>{order.deliverySlot || 'Today, 2h Delivery Run'}</div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div style={styles.sectionCard}>
          <h3 style={styles.cardHeader}>Payment Information</h3>
          <div style={styles.infoRow}>
            <CreditCard size={16} color="var(--color-text-secondary)" style={{ marginRight: 8, marginTop: '2px' }} />
            <div>
              <div style={styles.infoTitle}>Payment Method</div>
              <div style={styles.infoDesc}>{order.paymentMethod}</div>
            </div>
          </div>
        </div>

        {/* Order Items Receipt list */}
        <div style={styles.sectionCard}>
          <h3 style={styles.cardHeader}>Receipt Details</h3>
          <div style={styles.itemsList}>
            {order.items?.map((item) => (
              <div key={item.product.id} style={styles.itemRow}>
                <div style={styles.itemLeft}>
                  <img src={item.product.image} alt={item.product.name} style={styles.itemImg} />
                  <div>
                    <div style={styles.itemName}>{item.product.name}</div>
                    <div style={styles.itemUnit}>{item.product.unit} • {item.quantity}x</div>
                  </div>
                </div>
                <span style={styles.itemPriceVal}>
                  {(item.product.price * item.quantity)} RWF
                </span>
              </div>
            ))}
          </div>

          <div style={styles.receiptSummary}>
            <div style={styles.receiptRow}>
              <span>Subtotal</span>
              <span>{order.subtotal} RWF</span>
            </div>
            {order.discount > 0 && (
              <div style={{ ...styles.receiptRow, color: 'var(--color-success)' }}>
                <span>Discounts</span>
                <span>-{order.discount} RWF</span>
              </div>
            )}
            <div style={styles.receiptRow}>
              <span>Delivery Fee</span>
              <span>{order.delivery === 0 ? 'FREE' : `${order.delivery} RWF`}</span>
            </div>
            <div style={styles.receiptRow}>
              <span>GST (5%)</span>
              <span>{order.tax} RWF</span>
            </div>
            <div style={{ ...styles.receiptRow, ...styles.receiptTotalRow }}>
              <span>Grand Total</span>
              <span>{order.total} RWF</span>
            </div>
          </div>
        </div>

        {/* Need Help trigger */}
        <button
          onClick={() => alert('Support request submitted for order: ' + order.id)}
          style={styles.supportBtn}
        >
          <HelpCircle size={16} style={{ marginRight: 8 }} />
          Need Help with this Order?
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#F7F9FA',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContent: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '16px',
    boxSizing: 'border-box',
    paddingBottom: '32px',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '16px',
  },
  cardHeader: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '16px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '8px',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '8px',
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
    minHeight: '60px',
  },
  timelineLeftCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '24px',
  },
  timelineDot: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    zIndex: 2,
  },
  timelineCheck: {
    fontSize: '10px',
    fontWeight: 'bold',
  },
  timelineLine: {
    width: '3px',
    flexGrow: 1,
    marginTop: '-4px',
    marginBottom: '-4px',
    zIndex: 1,
  },
  timelineRightCol: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '16px',
  },
  stepLabel: {
    fontSize: '12px',
    color: 'var(--color-text)',
  },
  stepDesc: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
    lineHeight: '1.4',
  },
  courierCard: {
    backgroundColor: 'var(--color-primary-light)',
    border: '1px solid var(--color-primary)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  courierInfo: {},
  courierTitle: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  courierDesc: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    marginTop: '1px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  infoTitle: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
  },
  infoDesc: {
    fontSize: '12px',
    color: 'var(--color-text)',
    marginTop: '2px',
    fontWeight: '600',
    lineHeight: '1.4',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderBottom: '1.5px dashed var(--color-border)',
    paddingBottom: '16px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  itemImg: {
    width: '40px',
    height: '40px',
    objectFit: 'contain',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: '#FFF',
  },
  itemName: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  itemUnit: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    marginTop: '1px',
    fontWeight: '600',
  },
  itemPriceVal: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  receiptSummary: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  receiptTotalRow: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: '10px',
    marginTop: '6px',
    fontSize: '14px',
    fontWeight: '900',
    color: 'var(--color-text)',
  },
  supportBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    fontWeight: '800',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  errorContainer: {
    backgroundColor: '#FFF',
    height: '100%',
  },
  errorContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
    marginTop: '60px',
  },
  errorBtn: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: 'var(--color-primary)',
    color: '#FFF',
    fontWeight: '700',
    borderRadius: '8px',
  }
};

export default MobileOrderDetail;
