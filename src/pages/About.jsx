import React from 'react';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { Award, Leaf, Truck, ShieldCheck } from 'lucide-react';

export const About = () => {
  const styles = useResponsiveStyles(rawStyles);
  return (
    <div style={styles.page}>
      <div className="container">
        {/* Editorial Header */}
        <div style={styles.header}>
          <span style={styles.badge}>OUR BACKSTORY</span>
          <h1 style={styles.title}>About Freshio Market</h1>
          <p style={styles.desc}>
            Pioneering organic farm-direct grocery delivery inside Kigali sectors, connecting volcano-soil agricultural cooperatives directly to family households.
          </p>
        </div>

        {/* Narrative columns */}
        <div style={styles.layout}>
          <div style={styles.narrative}>
            <h2 style={styles.subTitle}>Fresh Sourcing, Sincere Pricing</h2>
            <p style={styles.para}>
              Founded in 2026, Freshio started as a boutique organic grocery stand at Kigali Heights. Our mission was simple: bypass the intermediate warehouses, cold rooms, and traders that deplete food nutrition, and establish a direct pathway from soil to shelf in under 24 hours.
            </p>
            <p style={styles.para}>
              Today, we operate four supermarket outlets across Kigali, sourcing dairy goods from Gishwati meadows, honey from Nyungwe forest boundaries, and volcanic potatoes from the peaks of Musanze. Every purchase directly empowers local cooperative farmers.
            </p>
          </div>
          <div style={styles.imageCard}>
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" 
              alt="Freshio Kigali Cooperative Farms Sourcing" 
              style={styles.img}
            />
          </div>
        </div>

        {/* Sourcing Stats metrics grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statDigit}>200+</span>
            <span style={styles.statLabel}>Cooperative Partners</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statDigit}>4 Outlets</span>
            <span style={styles.statLabel}>Kigali Locations</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statDigit}>15k+</span>
            <span style={styles.statLabel}>Monthly Deliveries</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statDigit}>100%</span>
            <span style={styles.statLabel}>Organic Sourced</span>
          </div>
        </div>

        {/* Pillars Section */}
        <div style={styles.pillarsSection}>
          <h3 style={styles.pillarsHeader}>Our Sourcing Pillars</h3>
          <div style={styles.pillarsGrid}>
            <div style={styles.pillarCard}>
              <div style={styles.iconCircle}><Leaf size={24} /></div>
              <h4 style={styles.pillarName}>Pesticide Free</h4>
              <p style={styles.pillarDesc}>We inspect farming methods daily to ensure zero chemical pesticides contaminate crops.</p>
            </div>
            
            <div style={styles.pillarCard}>
              <div style={styles.iconCircle}><Award size={24} /></div>
              <h4 style={styles.pillarName}>Fair Sourcing</h4>
              <p style={styles.pillarDesc}>We pay local cooperatives 25% above standard wholesale rates, supporting rural economies.</p>
            </div>

            <div style={styles.pillarCard}>
              <div style={styles.iconCircle}><Truck size={24} /></div>
              <h4 style={styles.pillarName}>Express Delivery</h4>
              <p style={styles.pillarDesc}>Couriers dispatch orders in thermal bags to lock in peak moisture and taste.</p>
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
  header: {
    textAlign: 'center',
    maxWidth: '680px',
    margin: '0 auto 48px auto',
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '48px',
    marginBottom: '64px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '32px',
    },
  },
  narrative: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  subTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  para: {
    fontSize: '14.5px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
  },
  imageCard: {
    borderRadius: '20px',
    overflow: 'hidden',
    height: '300px',
    border: '1.5px solid var(--color-border)',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '64px',
    borderTop: '1px solid var(--color-border)',
    borderBottom: '1px solid var(--color-border)',
    padding: '40px 0',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  statCard: {
    textAlign: 'center',
  },
  statDigit: {
    fontSize: '36px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    display: 'block',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  pillarsSection: {},
  pillarsHeader: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-text)',
    textAlign: 'center',
    marginBottom: '32px',
  },
  pillarsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  pillarCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarName: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-text)',
  },
  pillarDesc: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
  },
};
export default About;
