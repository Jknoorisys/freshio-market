import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { useApp } from '../context/AppContext';
import { User, ShoppingBag, Heart, Award, MapPin, Key, LogOut, Check, Star } from 'lucide-react';

export const AccountPage = () => {
  const navigate = useNavigate();
  const styles = useResponsiveStyles(rawStyles);
  const { user, toggleMembership, orders, wishlist, addToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [profileName, setProfileName] = useState(user?.name || 'Jean-Luc Nkurunziza');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+250 788 310 120');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'jeanluc@gmail.com');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    addToast('Profile settings updated successfully!', 'success');
  };

  const handleLogout = () => {
    addToast('Logged out of Freshio prototype', 'info');
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.pageTitle}>My Customer Portal</h1>

        <div style={styles.layout}>
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside style={styles.sidebar}>
            <div style={styles.userBadgeCard}>
              <div style={styles.avatar}>
                {profileName.charAt(0)}
              </div>
              <h3 style={styles.badgeName}>{profileName}</h3>
              <span style={styles.badgeEmail}>{profileEmail}</span>
              {user?.membership && (
                <div style={styles.proLabel}>
                  <Award size={12} /> Freshio+ Member
                </div>
              )}
            </div>

            <nav style={styles.navMenu}>
              <button 
                onClick={() => setActiveSubTab('profile')} 
                style={{
                  ...styles.navItem,
                  backgroundColor: activeSubTab === 'profile' ? 'var(--color-primary-light)' : 'transparent',
                  color: activeSubTab === 'profile' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                }}
              >
                <User size={16} /> Profile Details
              </button>
              
              <button 
                onClick={() => navigate('/account/orders')} 
                style={styles.navItem}
              >
                <ShoppingBag size={16} /> My Orders ({orders.length})
              </button>

              <button 
                onClick={() => navigate('/account/wishlist')} 
                style={styles.navItem}
              >
                <Heart size={16} /> Wishlist ({wishlist.length})
              </button>

              <button 
                onClick={() => setActiveSubTab('membership')} 
                style={{
                  ...styles.navItem,
                  backgroundColor: activeSubTab === 'membership' ? 'var(--color-primary-light)' : 'transparent',
                  color: activeSubTab === 'membership' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                }}
              >
                <Award size={16} /> Freshio+ Benefits
              </button>

              <div style={styles.menuDivider}></div>

              <button onClick={handleLogout} style={styles.logoutBtn}>
                <LogOut size={16} /> Log Out
              </button>
            </nav>
          </aside>

          {/* RIGHT CANVAS WINDOW */}
          <main style={styles.mainCanvas}>
            {/* SUB-PANE 1: PROFILE DETAILS */}
            {activeSubTab === 'profile' && (
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Profile Information</h2>
                <form onSubmit={handleUpdateProfile} style={styles.form}>
                  <div style={styles.formRow}>
                    <div style={styles.inputBox}>
                      <label style={styles.label}>Full Name</label>
                      <input 
                        type="text" 
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.inputBox}>
                      <label style={styles.label}>Email Address</label>
                      <input 
                        type="email" 
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.inputBox}>
                      <label style={styles.label}>Mobile Helpline Contacts</label>
                      <input 
                        type="text" 
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.inputBox}>
                      <label style={styles.label}>Default Sector Address</label>
                      <input 
                        type="text" 
                        value="Kimihurura, Kigali, Rwanda"
                        disabled
                        style={{ ...styles.input, backgroundColor: '#FAFBFB', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={styles.saveBtn}>
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* SUB-PANE 2: MEMBERSHIP MANAGER */}
            {activeSubTab === 'membership' && (
              <div style={styles.card}>
                <div style={styles.membershipBanner}>
                  <div style={styles.mBadgeBadge}>Freshio+</div>
                  <h2 style={styles.mBadgeTitle}>Premium Sourcing Membership</h2>
                  <p style={styles.mBadgeDesc}>Become a valued member of our priority customer circles in Kigali. Enjoy free shipping, early batch entries, and special discounts.</p>
                </div>

                <div style={styles.benefitsGrid}>
                  <div style={styles.benefitCard}>
                    <Check size={18} color="var(--color-primary)" />
                    <div>
                      <h4 style={styles.bTitle}>Zero Shipping Surcharge</h4>
                      <p style={styles.bDesc}>Free shipping on all baskets above 15,000 RWF threshold.</p>
                    </div>
                  </div>

                  <div style={styles.benefitCard}>
                    <Check size={18} color="var(--color-primary)" />
                    <div>
                      <h4 style={styles.bTitle}>40% Member Sales</h4>
                      <p style={styles.bDesc}>Unlock members-only flash items seeded weekly.</p>
                    </div>
                  </div>

                  <div style={styles.benefitCard}>
                    <Check size={18} color="var(--color-primary)" />
                    <div>
                      <h4 style={styles.bTitle}>Double Points</h4>
                      <p style={styles.bDesc}>Accumulate loyalty stars redeemable at Kigali Heights checkouts.</p>
                    </div>
                  </div>

                  <div style={styles.benefitCard}>
                    <Check size={18} color="var(--color-primary)" />
                    <div>
                      <h4 style={styles.bTitle}>Priority Delivery</h4>
                      <p style={styles.bDesc}>Special courier timelines under 90 minutes inside central districts.</p>
                    </div>
                  </div>
                </div>

                <div style={styles.actionSection}>
                  {user?.membership ? (
                    <div style={styles.subActiveBlock}>
                      <span style={styles.activeLabel}>✓ Membership is Active</span>
                      <p style={styles.activeDesc}>You will be billed 2,999 RWF monthly. Next renewal: September 21, 2026.</p>
                      <button onClick={toggleMembership} style={styles.unsubscribeBtn}>
                        Unsubscribe from Freshio+
                      </button>
                    </div>
                  ) : (
                    <div style={styles.subInactiveBlock}>
                      <span style={styles.inactiveLabel}>Only 2,999 RWF / Month</span>
                      <p style={styles.inactiveDesc}>Join today to instantly unlock savings on your active basket checkouts.</p>
                      <button onClick={toggleMembership} className="btn btn-primary" style={styles.subscribeBtn}>
                        Join Freshio+ Loyalty Program
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const rawStyles = {
  page: {
    padding: '40px 0 80px 0',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '32px',
  },
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
    },
  },
  sidebar: {
    width: '260px',
    flexShrink: 0,
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(22, 58, 53, 0.01)',
    '@media (max-width: 900px)': {
      width: '100%',
    },
  },
  userBadgeCard: {
    textAlign: 'center',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    fontSize: '24px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  badgeName: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
    margin: '0 0 2px 0',
  },
  badgeEmail: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginBottom: '10px',
  },
  proLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)',
    fontSize: '11px',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '8px',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'none',
    border: 'none',
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  menuDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '12px 0',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'none',
    border: 'none',
    width: '100%',
    padding: '12px 14px',
    color: 'var(--color-error)',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'left',
  },
  mainCanvas: {
    flexGrow: 1,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 16px rgba(22, 58, 53, 0.01)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    fontSize: '14px',
    outline: 'none',
    color: 'var(--color-text)',
  },
  saveBtn: {
    width: 'fit-content',
    padding: '10px 24px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '12px',
  },
  membershipBanner: {
    backgroundImage: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #157A4C 100%)',
    padding: '32px',
    borderRadius: '16px',
    color: '#FFFFFF',
    marginBottom: '28px',
  },
  mBadgeBadge: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-primary-dark)',
    fontSize: '11px',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '6px',
    display: 'inline-block',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  mBadgeTitle: {
    fontSize: '24px',
    fontWeight: '800',
    marginBottom: '8px',
    color: '#FFFFFF',
  },
  mBadgeDesc: {
    fontSize: '13px',
    lineHeight: '1.5',
    color: 'rgba(255,255,255,0.85)',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '32px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  benefitCard: {
    display: 'flex',
    gap: '12px',
    alignItems: 'start',
  },
  bTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '4px',
  },
  bDesc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4',
  },
  actionSection: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: '24px',
  },
  subActiveBlock: {
    backgroundColor: 'var(--color-primary-light)',
    border: '1.5px solid var(--color-primary)',
    padding: '20px',
    borderRadius: '12px',
  },
  activeLabel: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    display: 'block',
    marginBottom: '4px',
  },
  activeDesc: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    marginBottom: '16px',
  },
  unsubscribeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-error)',
    fontSize: '12px',
    fontWeight: '700',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: 0,
  },
  subInactiveBlock: {
    backgroundColor: '#FAFBFB',
    border: '1.5px dashed var(--color-border)',
    padding: '24px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  inactiveLabel: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
    display: 'block',
    marginBottom: '4px',
  },
  inactiveDesc: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    marginBottom: '16px',
  },
  subscribeBtn: {
    borderRadius: '10px',
    padding: '10px 24px',
    fontSize: '13px',
    fontWeight: '700',
  },
};
export default AccountPage;
