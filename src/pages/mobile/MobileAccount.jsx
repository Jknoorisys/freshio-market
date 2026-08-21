import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Sparkles, ChevronRight, LogOut, FileText, Heart, Shield, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MobileNavBar } from '../../components/mobile/MobileNavBar';

export const MobileAccount = () => {
  const navigate = useNavigate();
  const {
    user,
    login,
    register,
    logout,
    toggleMembership,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('login'); // login, register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      addToast('Please enter your email', 'error');
      return;
    }
    const success = login(formData.email, formData.password);
    if (success) {
      setFormData({ name: '', email: '', phone: '', password: '' });
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast('Name and Email are required', 'error');
      return;
    }
    const success = register(formData.name, formData.email, formData.phone, formData.password);
    if (success) {
      setFormData({ name: '', email: '', phone: '', password: '' });
    }
  };

  return (
    <div style={styles.container}>
      <MobileNavBar title="My Account" showBack={false} />

      <div style={styles.scrollContent}>
        {user ? (
          /* Profile Dashboard (Logged In) */
          <div style={styles.dashboard}>
            {/* Header info */}
            <div style={styles.profileHeader}>
              <div style={styles.avatarCircle}>
                <img src={user.avatar} alt={user.name} style={styles.avatarImg} />
              </div>
              <h2 style={styles.profileName}>{user.name}</h2>
              <p style={styles.profileEmail}>{user.email}</p>
              <span style={styles.joinedTag}>Member since {user.joinedDate}</span>
            </div>

            {/* Freshio+ Membership Section */}
            <div
              style={{
                ...styles.memberCard,
                background: user.membership
                  ? 'linear-gradient(135deg, #163A35 0%, #279E53 100%)'
                  : 'linear-gradient(135deg, #FF9F43 0%, #FF5A5F 100%)',
              }}
            >
              <div style={styles.memberLeft}>
                <Sparkles size={24} color="#FFF" />
                <div style={styles.memberTextCol}>
                  <h3 style={styles.memberName}>
                    {user.membership ? 'Freshio+ Kigali Member' : 'Join Freshio+ Loyalty'}
                  </h3>
                  <p style={styles.memberDesc}>
                    {user.membership
                      ? 'Free delivery active! Double rewards points.'
                      : 'Unlimited free delivery for 2,999 RWF/month.'}
                  </p>
                </div>
              </div>
              <button onClick={toggleMembership} style={styles.memberBtn}>
                {user.membership ? 'Cancel' : 'Activate'}
              </button>
            </div>

             {/* Navigation List links */}
             <div style={styles.navListCard}>
               <button onClick={() => navigate('/mobile/orders')} style={styles.navListItem}>
                 <div style={styles.navListLeft}>
                   <FileText size={18} color="var(--color-primary)" style={{ marginRight: 12 }} />
                   <span>My Order History</span>
                 </div>
                 <ChevronRight size={16} color="var(--color-text-secondary)" />
               </button>
 
               <button onClick={() => navigate('/mobile/wishlist')} style={styles.navListItem}>
                 <div style={styles.navListLeft}>
                   <Heart size={18} color="#FF5A5F" style={{ marginRight: 12 }} />
                   <span>My Loved Items</span>
                 </div>
                 <ChevronRight size={16} color="var(--color-text-secondary)" />
               </button>
 
               <button onClick={() => navigate('/mobile/page/about')} style={styles.navListItem}>
                 <div style={styles.navListLeft}>
                   <User size={18} color="var(--color-primary)" style={{ marginRight: 12 }} />
                   <span>About Freshio Market</span>
                 </div>
                 <ChevronRight size={16} color="var(--color-text-secondary)" />
               </button>

               <button onClick={() => navigate('/mobile/page/sustainability')} style={styles.navListItem}>
                 <div style={styles.navListLeft}>
                   <Shield size={18} color="var(--color-primary)" style={{ marginRight: 12 }} />
                   <span>Sustainability Pledge</span>
                 </div>
                 <ChevronRight size={16} color="var(--color-text-secondary)" />
               </button>

               <button onClick={() => navigate('/mobile/page/faq')} style={styles.navListItem}>
                 <div style={styles.navListLeft}>
                   <HelpCircle size={18} color="var(--color-primary)" style={{ marginRight: 12 }} />
                   <span>FAQ Help Center</span>
                 </div>
                 <ChevronRight size={16} color="var(--color-text-secondary)" />
               </button>

               <button
                 onClick={() => navigate('/mobile/page/contact')}
                 style={{ ...styles.navListItem, borderBottom: 'none' }}
               >
                 <div style={styles.navListLeft}>
                   <Mail size={18} color="var(--color-primary)" style={{ marginRight: 12 }} />
                   <span>Contact Kigali Support</span>
                 </div>
                 <ChevronRight size={16} color="var(--color-text-secondary)" />
               </button>
             </div>

            {/* Log out */}
            <button onClick={logout} style={styles.logoutBtn}>
              <LogOut size={16} style={{ marginRight: 8 }} />
              Sign Out
            </button>
          </div>
        ) : (
          /* Sign In / Sign Up Forms (Logged Out) */
          <div style={styles.authContainer}>
            {/* Logo details */}
            <div style={styles.logoHeader}>
              <div style={styles.logoCircle}>🛍️</div>
              <h2 style={styles.logoTitle}>Freshio Kigali</h2>
              <p style={styles.logoDesc}>Kigali's finest Sawa Citi groceries at your fingertips.</p>
            </div>

            {/* Tab switchers */}
            <div style={styles.tabContainer}>
              <button
                onClick={() => setActiveTab('login')}
                style={{
                  ...styles.tabBtn,
                  color: activeTab === 'login' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderBottom: activeTab === 'login' ? '3px solid var(--color-primary)' : '3px solid transparent',
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                style={{
                  ...styles.tabBtn,
                  color: activeTab === 'register' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderBottom: activeTab === 'register' ? '3px solid var(--color-primary)' : '3px solid transparent',
                }}
              >
                Create Account
              </button>
            </div>

            {activeTab === 'login' ? (
              /* Sign In Form */
              <form onSubmit={handleLoginSubmit} style={styles.form}>
                <div style={styles.inputBox}>
                  <label style={styles.label}>Email Address</label>
                  <div style={styles.fieldWrapper}>
                    <Mail size={16} color="var(--color-text-secondary)" style={{ marginRight: 8 }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. name@kigali.com"
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.inputBox}>
                  <label style={styles.label}>Password</label>
                  <div style={styles.fieldWrapper}>
                    <Lock size={16} color="var(--color-text-secondary)" style={{ marginRight: 8 }} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      style={styles.input}
                    />
                  </div>
                </div>

                <button type="submit" style={styles.authSubmitBtn}>
                  Sign In
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} style={styles.form}>
                <div style={styles.inputBox}>
                  <label style={styles.label}>Full Name</label>
                  <div style={styles.fieldWrapper}>
                    <User size={16} color="var(--color-text-secondary)" style={{ marginRight: 8 }} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Keza Gisa"
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.inputBox}>
                  <label style={styles.label}>Email Address</label>
                  <div style={styles.fieldWrapper}>
                    <Mail size={16} color="var(--color-text-secondary)" style={{ marginRight: 8 }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@kigali.com"
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.inputBox}>
                  <label style={styles.label}>Phone Number</label>
                  <div style={styles.fieldWrapper}>
                    <Phone size={16} color="var(--color-text-secondary)" style={{ marginRight: 8 }} />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+250 788 123 456"
                      style={styles.input}
                    />
                  </div>
                </div>

                <button type="submit" style={styles.authSubmitBtn}>
                  Create Account
                </button>
              </form>
            )}
            
            <p style={styles.guestNote}>
              Note: You can write any email address and password to log in. No actual backend authentication is required.
            </p>
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
  },
  dashboard: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  avatarCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid var(--color-primary)',
    backgroundColor: 'var(--color-primary-light)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileName: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginTop: '12px',
  },
  profileEmail: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
  },
  joinedTag: {
    fontSize: '9px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-bg)',
    padding: '4px 10px',
    borderRadius: '100px',
    border: '1.5px solid var(--color-border)',
    marginTop: '10px',
  },
  memberCard: {
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#FFFFFF',
    boxShadow: 'var(--shadow-md)',
  },
  memberLeft: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexGrow: 1,
  },
  memberTextCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  memberName: {
    fontSize: '13px',
    fontWeight: '900',
  },
  memberDesc: {
    fontSize: '10px',
    opacity: 0.85,
    marginTop: '2px',
  },
  memberBtn: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    backgroundColor: '#FFFFFF',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    cursor: 'pointer',
    flexShrink: 0,
    boxShadow: 'var(--shadow-sm)',
  },
  navListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: '4px 16px',
    boxShadow: 'var(--shadow-sm)',
  },
  navListItem: {
    width: '100%',
    padding: '16px 0',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  navListLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  logoutBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--color-error)',
    color: 'var(--color-error)',
    fontWeight: '800',
    fontSize: '13px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8px',
    marginBottom: '20px',
  },
  
  // Auth view styles
  authContainer: {
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '24px',
    marginTop: '10px',
  },
  logoCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    boxShadow: 'var(--shadow-sm)',
  },
  logoTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
    marginTop: '12px',
  },
  logoDesc: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    marginTop: '4px',
  },
  tabContainer: {
    display: 'flex',
    width: '100%',
    borderBottom: '2px solid var(--color-border)',
    marginBottom: '20px',
  },
  tabBtn: {
    width: '50%',
    padding: '12px 0',
    fontSize: '14px',
    fontWeight: '800',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
  },
  fieldWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '0 12px',
    height: '42px',
    backgroundColor: 'var(--color-bg)',
  },
  input: {
    flexGrow: 1,
    border: 'none',
    fontSize: '13px',
    color: 'var(--color-text)',
    backgroundColor: 'transparent',
    fontWeight: '500',
    outline: 'none',
  },
  authSubmitBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-primary)',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
    marginTop: '8px',
  },
  guestNote: {
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
    textAlign: 'center',
    marginTop: '20px',
    maxWidth: '280px',
  }
};

export default MobileAccount;
