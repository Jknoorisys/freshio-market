import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Calendar, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileNavBar } from '../../components/mobile/MobileNavBar';

export const MobileOrders = () => {
  const navigate = useNavigate();
  const { orders } = useApp();

  return (
    <div style={styles.container}>
      <MobileNavBar title="Order History" />

      <div style={styles.scrollContent}>
        {orders && orders.length > 0 ? (
          <div style={styles.listContainer}>
            {orders.map((order) => {
              // Create item summary text
              const firstItem = order.items?.[0];
              const otherCount = (order.items?.length || 1) - 1;
              const summaryText = firstItem
                ? `${firstItem.product.name}${otherCount > 0 ? ` + ${otherCount} more item${otherCount > 1 ? 's' : ''}` : ''}`
                : 'Grocery Order';

              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/mobile/orders/${order.id}`)}
                  style={styles.orderCard}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.orderIdRow}>
                      <ShoppingBag size={14} color="var(--color-primary)" style={{ marginRight: 6 }} />
                      <span style={styles.orderIdVal}>{order.id}</span>
                    </div>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: order.status === 'Delivered' ? '#E6F8EF' : '#FFF5EC',
                        color: order.status === 'Delivered' ? 'var(--color-success)' : 'var(--color-orange)',
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div style={styles.cardBody}>
                    <h4 style={styles.summaryText}>{summaryText}</h4>
                    <p style={styles.dateText}>
                      <Calendar size={11} style={{ marginRight: 4 }} />
                      {order.date}
                    </p>
                  </div>

                  <div style={styles.cardFooter}>
                    <span style={styles.totalPriceLabel}>Total Amount:</span>
                    <div style={styles.priceRow}>
                      <span style={styles.totalPriceVal}>{order.total} RWF</span>
                      <ChevronRight size={16} color="var(--color-text-secondary)" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIconCircle}>
              <ShoppingBag size={44} color="var(--color-text-secondary)" />
            </div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any grocery orders yet. Start shopping and stock your pantry!</p>
            <button onClick={() => navigate('/mobile/shop')} style={styles.shopBtn}>
              Start Shopping
            </button>
          </div>
        )}
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
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: '14px 16px',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '8px',
  },
  orderIdRow: {
    display: 'flex',
    alignItems: 'center',
  },
  orderIdVal: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  statusBadge: {
    fontSize: '10px',
    fontWeight: '800',
    padding: '4px 8px',
    borderRadius: '100px',
  },
  cardBody: {
    padding: '12px 0',
  },
  summaryText: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  dateText: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    marginTop: '4px',
    fontWeight: '600',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '8px',
    fontSize: '12px',
  },
  totalPriceLabel: {
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  totalPriceVal: {
    fontSize: '13px',
    fontWeight: '900',
    color: 'var(--color-primary-dark)',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    marginTop: '40px',
  },
  emptyIconCircle: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    backgroundColor: '#EAECEE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  shopBtn: {
    marginTop: '20px',
    padding: '10px 24px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-primary)',
    color: '#FFF',
    fontWeight: '700',
    fontSize: '13px',
    border: 'none',
    cursor: 'pointer',
  }
};

export default MobileOrders;
