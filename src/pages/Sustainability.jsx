import React from 'react';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { ShieldCheck, Recycle, Heart, HelpCircle, TreePine, Sparkles } from 'lucide-react';

export const Sustainability = () => {
  const styles = useResponsiveStyles(rawStyles);
  return (
    <div style={styles.page}>
      <div className="container">
        {/* Banner Header */}
        <div style={styles.header}>
          <span style={styles.badge}>ECO COMMITMENTS</span>
          <h1 style={styles.title}>Sustaining Kigali's Soil</h1>
          <p style={styles.desc}>
            Grocery delivery that respects the planet. From biodegradable packing materials to optimizing delivery networks, sustainability is baked into every Freshio order.
          </p>
        </div>

        {/* Highlight Rows */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.iconWrapper}><Recycle size={28} /></div>
            <h3 style={styles.cardTitle}>100% Plastic Free</h3>
            <p style={styles.cardDesc}>
              Single-use plastics are banned at our supermarkets. We pack exclusively in compostable paper sacks, recycled boxes, and reusable cotton grocery carriers.
            </p>
          </div>

          <div style={styles.card}>
            <div style={styles.iconWrapper}><TreePine size={28} /></div>
            <h3 style={styles.cardTitle}>Carbon Neutral Courier</h3>
            <p style={styles.cardDesc}>
              Our delivery routes inside Kiyovu, Kacyiru and Kimihurura are optimized using algorithm batching. We are shifting 60% of our fleet to electric cargo bikes and e-motos by December 2026.
            </p>
          </div>

          <div style={styles.card}>
            <div style={styles.iconWrapper}><Heart size={28} /></div>
            <h3 style={styles.cardTitle}>Zero Food Waste</h3>
            <p style={styles.cardDesc}>
              Sourcing directly on customer demand means less food rotting in warehouse bins. Excess vegetables are composted or donated to community kitchens in Kigali.
            </p>
          </div>
        </div>

        {/* Sourcing values banner */}
        <div style={styles.coopBanner}>
          <div style={styles.coopMeta}>
            <Sparkles size={28} color="var(--color-primary-dark)" />
            <h3 style={styles.coopTitle}>Empowering Local Agricultural Cooperatives</h3>
            <p style={styles.coopDesc}>
              By bypassing wholesale brokers, we pay local cooperative farmers 25% higher margins, allowing them to reinvest in organic bio-fertilizers and clean crop watering systems.
            </p>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
    marginBottom: '48px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 16px rgba(22, 58, 53, 0.01)',
  },
  iconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '12px',
  },
  cardDesc: {
    fontSize: '13.5px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  coopBanner: {
    backgroundColor: 'var(--color-primary-light)',
    border: '1.5px solid var(--color-primary)',
    borderRadius: '24px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(39, 158, 83, 0.04)',
  },
  coopMeta: {
    maxWidth: '680px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  coopTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  coopDesc: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
  },
};
export default Sustainability;
