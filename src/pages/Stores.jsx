import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { useApp } from '../context/AppContext';
import { STORES } from '../data/mockData';
import { MapPin, Phone, Clock, Compass, Check, ArrowRight } from 'lucide-react';

export const Stores = () => {
  const navigate = useNavigate();
  const styles = useResponsiveStyles(rawStyles);
  const { setLocation, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('all');

  const handleSelectStore = (store) => {
    // Extract sector name from address or store name
    const sectorName = store.name.replace('Freshio ', '').replace(' Downtown', '').replace(' Heights', '').replace(' Express', '');
    setLocation(sectorName);
    addToast(`Active shopping location changed to ${sectorName}!`, 'success');
    navigate('/shop');
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Header Title */}
        <div style={styles.header}>
          <span style={styles.badge}>OUTLET LOCATOR</span>
          <h1 style={styles.title}>Visit Freshio In Kigali</h1>
          <p style={styles.desc}>We have four fully stocked physical supermarkets around Kigali sectors. Pick up orders, grab fresh juices, or shop in person.</p>
        </div>

        {/* Filters */}
        <div style={styles.tabsRow}>
          <button 
            onClick={() => setActiveTab('all')} 
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'all' ? 'var(--color-primary-dark)' : 'transparent',
              color: activeTab === 'all' ? '#FFFFFF' : 'var(--color-text-secondary)',
              borderColor: activeTab === 'all' ? 'var(--color-primary-dark)' : 'var(--color-border)',
            }}
          >
            All Branches
          </button>
          <button 
            onClick={() => setActiveTab('express')} 
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'express' ? 'var(--color-primary-dark)' : 'transparent',
              color: activeTab === 'express' ? '#FFFFFF' : 'var(--color-text-secondary)',
              borderColor: activeTab === 'express' ? 'var(--color-primary-dark)' : 'var(--color-border)',
            }}
          >
            Express Outlets
          </button>
        </div>

        {/* Store Grid */}
        <div style={styles.storesGrid}>
          {STORES.map((store) => {
            const isExpress = store.services.includes('Drive-Thru') || store.name.includes('Express');
            if (activeTab === 'express' && !isExpress) return null;

            return (
              <div key={store.id} style={styles.storeCard}>
                <div style={styles.imgWrapper}>
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    style={styles.storeImg}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23EAF8F0"/></svg>';
                    }}
                  />
                  <div style={styles.distanceBadge}>
                    <Compass size={12} /> <span>{store.distance}</span>
                  </div>
                </div>

                <div style={styles.storeContent}>
                  <h3 style={styles.storeName}>{store.name}</h3>
                  
                  <div style={styles.infoLines}>
                    <div style={styles.infoLine}>
                      <MapPin size={15} color="var(--color-text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={styles.infoText}>{store.address}</span>
                    </div>

                    <div style={styles.infoLine}>
                      <Clock size={15} color="var(--color-text-secondary)" />
                      <span style={styles.infoText}>{store.hours}</span>
                    </div>

                    <div style={styles.infoLine}>
                      <Phone size={15} color="var(--color-text-secondary)" />
                      <span style={styles.infoText}>{store.phone}</span>
                    </div>
                  </div>

                  {/* Services badges */}
                  <div style={styles.servicesRow}>
                    {store.services.map(serv => (
                      <span key={serv} style={styles.serviceBadge}>
                        <Check size={10} /> {serv}
                      </span>
                    ))}
                  </div>

                  {/* CTA Actions */}
                  <div style={styles.actions}>
                    <button 
                      onClick={() => handleSelectStore(store)}
                      className="btn btn-primary"
                      style={styles.shopBtn}
                    >
                      Shop This Store
                    </button>
                    
                    <button 
                      onClick={() => navigate(`/stores/${store.id}`)}
                      className="btn btn-outline"
                      style={styles.detailBtn}
                    >
                      Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const rawStyles = {
  page: {
    padding: '40px 0 80px 0',
  },
  header: {
    textAlign: 'center',
    maxWidth: '680px',
    margin: '0 auto 40px auto',
  },
  badge: {
    fontSize: '9px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'inline-block',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '12px',
  },
  desc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  tabsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  tabBtn: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: '1.5px solid',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  storesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  storeCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(22, 58, 53, 0.01)',
    display: 'flex',
    flexDirection: 'column',
  },
  imgWrapper: {
    height: '240px',
    position: 'relative',
    backgroundColor: '#FAFBFB',
  },
  storeImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    backgroundColor: 'rgba(22, 58, 53, 0.85)',
    backdropFilter: 'blur(4px)',
    color: '#FFFFFF',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  storeContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  storeName: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  infoLines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  infoLine: {
    display: 'flex',
    alignItems: 'start',
    gap: '12px',
  },
  infoText: {
    fontSize: '13.5px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
    fontWeight: '600',
  },
  servicesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
    borderTop: '1px dashed var(--color-border)',
    paddingTop: '16px',
  },
  serviceBadge: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    padding: '4px 10px',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
  },
  shopBtn: {
    flexGrow: 1,
    padding: '10px 0',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  detailBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};
export default Stores;
