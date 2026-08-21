import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShoppingBag, Eye, Calendar, DollarSign, Clock } from 'lucide-react';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useApp();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#EBFCEE', text: 'var(--color-primary-dark)' };
      case 'Dispatched':
        return { bg: '#E3F2FD', text: '#0D47A1' };
      case 'Placed':
      default:
        return { bg: '#FFFDE7', text: '#F57F17' };
    }
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <button onClick={() => navigate('/account')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 style={styles.pageTitle}>Order History</h1>

        {orders.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>📦</div>
            <h3 style={styles.emptyTitle}>No Orders Yet</h3>
            <p style={styles.emptyDesc}>
              You haven't placed any grocery orders yet. Start shopping to fill your cupboard with Kigali's finest dairy and vegetables.
            </p>
            <button onClick={() => navigate('/shop')} className="btn btn-primary" style={styles.shopBtn}>
              Go to Storefront
            </button>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);

              return (
                <div key={order.id} style={styles.orderCard}>
                  {/* Left info column */}
                  <div style={styles.infoCol}>
                    <div style={styles.orderHeader}>
                      <span style={styles.orderId}>Order #{order.id}</span>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text
                      }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={styles.metaRow}>
                      <span style={styles.metaItem}>
                        <Calendar size={14} /> {order.date}
                      </span>
                      <span style={styles.metaItem}>
                        <Clock size={14} /> {order.deliverySlot}
                      </span>
                      <span style={styles.metaItem}>
                        <ShoppingBag size={14} /> {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  {/* Right summary and actions */}
                  <div style={styles.actionCol}>
                    <div style={styles.priceBlock}>
                      <span style={styles.totalLabel}>Total Paid</span>
                      <strong style={styles.totalVal}>{order.total.toLocaleString()} RWF</strong>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/account/orders/${order.id}`)}
                      className="btn btn-outline"
                      style={styles.viewBtn}
                    >
                      <Eye size={14} /> Track Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
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
  emptyCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '64px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    maxWidth: '540px',
    margin: '0 auto',
  },
  emptyIcon: {
    fontSize: '64px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  emptyDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  shopBtn: {
    borderRadius: '10px',
    padding: '10px 24px',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    boxShadow: '0 4px 12px rgba(22, 58, 53, 0.01)',
    transition: 'all 0.2s',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'start',
    },
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  orderId: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '8px',
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  actionCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    '@media (max-width: 600px)': {
      width: '100%',
      justifyContent: 'space-between',
      borderTop: '1px solid var(--color-border)',
      paddingTop: '16px',
      marginTop: '4px',
    },
  },
  priceBlock: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
    '@media (max-width: 600px)': {
      textAlign: 'left',
    },
  },
  totalLabel: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  totalVal: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  viewBtn: {
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
  },
};
export default OrdersPage;
