import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle2, Leaf, Heart, ShieldAlert, ChevronRight, HelpCircle } from 'lucide-react';
import { MobileNavBar } from '../../components/mobile/MobileNavBar';
import { useApp } from '../../context/AppContext';
import { FAQS } from '../../data/mockData';

export const MobileStaticPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { addToast } = useApp();

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      addToast('Please fill out all fields', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Message sent! We will contact you soon.', 'success');
  };

  // FAQ toggle state
  const [activeFaq, setActiveFaq] = useState(null);

  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <div style={styles.content}>
            <div style={styles.logoSection}>
              <div style={styles.logoBadge}>🛍️</div>
              <h2 style={styles.title}>About Freshio Market</h2>
              <p style={styles.subtitle}>Kigali's Premium Grocer Partner</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Our Story</h3>
              <p style={styles.paragraph}>
                Freshio was founded in 2026 to connect local organic farming cooperatives across Rwanda with urban families in Kigali. By partnering with leading local supermarkets like **Sawa Citi**, we offer swift, temperature-controlled 2-hour grocery deliveries straight to your door.
              </p>
              <p style={styles.paragraph}>
                Every product listed in our mobile application is sourced directly from shelves in Kigali Heights, Nyarutarama, and Downtown Kiyovu branches.
              </p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Our Values</h3>
              <ul style={styles.list}>
                <li style={styles.listItem}>
                  <Heart size={16} color="var(--color-primary)" style={{ marginRight: 8, flexShrink: 0 }} />
                  <span><strong>100% Quality:</strong> Only the freshest produce from Musanze hills.</span>
                </li>
                <li style={styles.listItem}>
                  <Leaf size={16} color="var(--color-primary)" style={{ marginRight: 8, flexShrink: 0 }} />
                  <span><strong>Supporting Farmers:</strong> Direct fair trade with local agricultural co-ops.</span>
                </li>
                <li style={styles.listItem}>
                  <CheckCircle2 size={16} color="var(--color-primary)" style={{ marginRight: 8, flexShrink: 0 }} />
                  <span><strong>Swift Logistics:</strong> Under 2 hours delivery dispatch throughout Kigali.</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'sustainability':
        return (
          <div style={styles.content}>
            <div style={styles.headerBanner}>
              <Leaf size={48} color="var(--color-primary)" />
              <h2 style={styles.title}>Green Kigali Sourcing</h2>
              <p style={styles.subtitle}>Our Environmental & Local Pledge</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Local Organic Produce</h3>
              <p style={styles.paragraph}>
                We prioritize sourcing fruits and vegetables from farmers in Northern and Eastern provinces (Rulindo, Musanze, Rwamagana). This keeps shipping routes short and supports local rural livelihoods.
              </p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Zero-Plastic Packaging</h3>
              <p style={styles.paragraph}>
                Freshio deliveries are packed in reusable kraft paper bags and recyclable crates. In partnership with Sawa Citi, we are committed to eliminating single-use plastics from Kigali's grocery ecosystem.
              </p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Nyungwe Forest Carbon Offset</h3>
              <p style={styles.paragraph}>
                For every delivery slot booked, a portion of the fee supports the Nyungwe Forest national park buffer zone reforestation program, offsetting our delivery riders' carbon footprint.
              </p>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div style={styles.content}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Get In Touch</h3>
              <p style={styles.paragraph}>Have questions about your Sawa Citi order or delivery times in Kigali? Send us a message!</p>
              {submitted ? (
                <div style={styles.successBox}>
                  <CheckCircle2 size={24} color="var(--color-success)" style={{ marginBottom: 8 }} />
                  <h4>Message Received!</h4>
                  <p>Our Kigali Heights support team will reply in under 30 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={styles.form}>
                  <div style={styles.inputBox}>
                    <label style={styles.label}>Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputBox}>
                    <label style={styles.label}>Email Address</label>
                    <input
                      type="email"
                      placeholder="name@kigali.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputBox}>
                    <label style={styles.label}>Message</label>
                    <textarea
                      placeholder="Type details..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      style={styles.textarea}
                      rows={4}
                    />
                  </div>
                  <button type="submit" style={styles.submitBtn}>Send Message</button>
                </form>
              )}
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Kigali Headquarters</h3>
              <div style={styles.contactItem}>
                <MapPin size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>Kigali Heights, Floor 3, Kimihurura, Kigali</span>
              </div>
              <div style={{ ...styles.contactItem, marginTop: '8px' }}>
                <Phone size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>+250 788 310 120 (Support Hotlines)</span>
              </div>
              <div style={{ ...styles.contactItem, marginTop: '8px' }}>
                <Mail size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>kigali-support@freshio.market</span>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div style={styles.content}>
            <div style={styles.logoSection}>
              <HelpCircle size={44} color="var(--color-primary)" />
              <h2 style={styles.title}>FAQ Help Center</h2>
              <p style={styles.subtitle}>Frequently Asked Questions</p>
            </div>
            <div style={styles.faqList}>
              {FAQS.map((faq, idx) => (
                <div key={faq.id} style={styles.faqCard}>
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    style={styles.faqHeader}
                  >
                    <span style={styles.faqQuestion}>{faq.question}</span>
                    <span style={{
                      transform: activeFaq === idx ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      fontWeight: '800'
                    }}>
                      <ChevronRight size={18} />
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <div style={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div style={styles.errorContainer}>
            <h2>Page Not Found</h2>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (type) {
      case 'about': return 'About Freshio';
      case 'sustainability': return 'Sustainability Pledge';
      case 'contact': return 'Contact Us';
      case 'faq': return 'FAQ Center';
      default: return 'Information';
    }
  };

  return (
    <div style={styles.container}>
      <MobileNavBar title={getPageTitle()} />
      <div style={styles.scrollable}>
        {renderContent()}
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
  scrollable: {
    flexGrow: 1,
    overflowY: 'auto',
    paddingBottom: '30px',
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: '16px 0',
  },
  logoBadge: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '12px',
  },
  headerBanner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: '16px 0',
    backgroundColor: '#EAF8F0',
    padding: '24px 16px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid #CDEEDD',
  },
  title: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-primary-dark)',
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '4px',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: '18px 16px',
    boxShadow: 'var(--shadow-sm)',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '12px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '6px',
  },
  paragraph: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    marginBottom: '10px',
    '&:last-child': {
      marginBottom: 0,
    }
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  contactItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
  },
  successBox: {
    backgroundColor: 'var(--color-primary-light)',
    border: '1px solid var(--color-primary)',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
  },
  input: {
    height: '38px',
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '0 12px',
    fontSize: '13px',
    outline: 'none',
    backgroundColor: 'var(--color-bg)',
  },
  textarea: {
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    outline: 'none',
    resize: 'none',
    backgroundColor: 'var(--color-bg)',
    fontFamily: 'inherit',
  },
  submitBtn: {
    height: '42px',
    backgroundColor: 'var(--color-primary)',
    color: '#FFF',
    fontWeight: '800',
    fontSize: '13px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  },
  faqHeader: {
    width: '100%',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
  },
  faqQuestion: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text)',
    paddingRight: '12px',
  },
  faqAnswer: {
    padding: '0 16px 16px 16px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '12px',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
  }
};

export default MobileStaticPage;
