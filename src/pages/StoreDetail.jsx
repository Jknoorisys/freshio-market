import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STORES } from '../data/mockData';
import { ArrowLeft, MapPin, Phone, Clock, Compass, CheckCircle2, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';

export const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLocation, addToast } = useApp();

  // Find store by route ID parameter
  const store = useMemo(() => {
    return STORES.find(s => s.id === id) || STORES[0];
  }, [id]);

  const handleSelectStore = () => {
    const sectorName = store.name.replace('Freshio ', '').replace(' Downtown', '').replace(' Heights', '').replace(' Express', '');
    setLocation(sectorName);
    addToast(`Active location set to ${sectorName}!`, 'success');
    navigate('/shop');
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Back Link */}
        <button onClick={() => navigate('/stores')} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Outlets
        </button>

        {/* Store Detail Header Banner */}
        <div style={styles.storeBanner}>
          <img 
            src={store.image} 
            alt={store.name} 
            style={styles.bannerImg}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/></svg>';
            }}
          />
          <div style={styles.bannerOverlay}>
            <span style={styles.badge}>OUTLET DETAILED VIEW</span>
            <h1 style={styles.storeTitle}>{store.name}</h1>
            <span style={styles.distanceBadge}>{store.distance}</span>
          </div>
        </div>

        {/* Info Layout */}
        <div style={styles.layout}>
          {/* LEFT: MAIN DETAILS */}
          <div style={styles.detailsCol}>
            <div style={styles.card}>
              <h2 style={styles.cardHeader}>About the Outlet</h2>
              <p style={styles.description}>{store.description}</p>

              <h3 style={styles.subHeader}>Unique Store Services</h3>
              <div style={styles.servicesGrid}>
                {store.services.map(serv => (
                  <div key={serv} style={styles.serviceItem}>
                    <CheckCircle2 size={18} color="var(--color-primary)" />
                    <span style={styles.serviceText}>{serv} Sourced & Certified</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MANAGER CARD */}
            <div style={styles.card}>
              <h2 style={styles.cardHeader}>Store Management</h2>
              <div style={styles.managerBlock}>
                <div style={styles.avatar}>M</div>
                <div style={styles.managerMeta}>
                  <h4 style={styles.managerName}>Maurice Mugisha</h4>
                  <span style={styles.managerTitle}>Store Manager - {store.name}</span>
                  <div style={styles.managerContact}>
                    <span style={styles.contactLine}><Mail size={13} /> maurice@freshio.rw</span>
                    <span style={styles.contactLine}><Phone size={13} /> +250 788 120 440</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT / BUSINESS METRICS CARD */}
          <div style={styles.sidebarCol}>
            <div style={styles.card}>
              <h3 style={styles.cardHeader}>Operations</h3>

              <div style={styles.widget}>
                <MapPin size={16} color="var(--color-text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={styles.widgetText}>
                  <span style={styles.wLabel}>Location</span>
                  <span style={styles.wVal}>{store.address}</span>
                </div>
              </div>

              <div style={styles.widget}>
                <Clock size={16} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
                <div style={styles.widgetText}>
                  <span style={styles.wLabel}>Business Hours</span>
                  <span style={styles.wVal}>{store.hours}</span>
                </div>
              </div>

              <div style={styles.widget}>
                <Phone size={16} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
                <div style={styles.widgetText}>
                  <span style={styles.wLabel}>Supermarket Help Desk</span>
                  <span style={styles.wVal}>{store.phone}</span>
                </div>
              </div>

              <div style={styles.divider}></div>

              <button 
                onClick={handleSelectStore}
                className="btn btn-primary"
                style={styles.selectBtn}
              >
                Set as Active Store
              </button>
            </div>
          </div>
        </div>
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
  storeBanner: {
    height: '320px',
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    marginBottom: '40px',
    boxShadow: '0 8px 24px rgba(22, 58, 53, 0.04)',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(22, 58, 53, 0.65)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '40px',
    color: '#FFFFFF',
  },
  badge: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--color-accent)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  storeTitle: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '12px',
    color: '#FFFFFF',
  },
  distanceBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(4px)',
    color: '#FFFFFF',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    width: 'fit-content',
  },
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
    },
  },
  detailsCol: {
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
  },
  cardHeader: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  description: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  subHeader: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '16px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '8px',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  serviceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  serviceText: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  managerBlock: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    fontSize: '20px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  managerMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  managerName: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
    margin: '0 0 2px 0',
  },
  managerTitle: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
  },
  managerContact: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  contactLine: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  sidebarCol: {
    width: '360px',
    flexShrink: 0,
    position: 'sticky',
    top: '100px',
    '@media (max-width: 900px)': {
      width: '100%',
      position: 'static',
    },
  },
  widget: {
    display: 'flex',
    gap: '12px',
    alignItems: 'start',
    marginBottom: '16px',
  },
  widgetText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  wLabel: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  wVal: {
    fontSize: '13.5px',
    color: 'var(--color-text)',
    lineHeight: '1.4',
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '20px 0',
  },
  selectBtn: {
    width: '100%',
    padding: '12px 0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};
export default StoreDetail;
