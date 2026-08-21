import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { Mail, Phone, MapPin, Send, Loader2, Clock } from 'lucide-react';

export const Contact = () => {
  const styles = useResponsiveStyles(rawStyles);
  const { addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast('Please fill out all contact form fields', 'warning');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setName('');
      setEmail('');
      setMessage('');
      addToast('Message received! Our team will respond in under 3 hours.', 'success');
    }, 1500);
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.badge}>GET IN TOUCH</span>
          <h1 style={styles.title}>Contact Freshio support</h1>
          <p style={styles.desc}>Have an issue with your MoMo billing? Need custom corporate deliveries? Drop us a line below.</p>
        </div>

        <div style={styles.layout}>
          {/* LEFT: FORM */}
          <div style={styles.formCol}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Send Us a Message</h3>
              <form onSubmit={handleSendMessage} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.inputBox}>
                    <label style={styles.label}>Your Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Jean-Luc"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.inputBox}>
                    <label style={styles.label}>Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="jeanluc@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <div style={styles.inputBox}>
                  <label style={styles.label}>Subject</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={styles.select}
                  >
                    <option value="Feedback">General Feedback</option>
                    <option value="Billing">MTN MoMo Billing Inquiry</option>
                    <option value="Delivery">Late Delivery Issue</option>
                    <option value="Corporate">Bulk/Corporate Sourcing</option>
                  </select>
                </div>

                <div style={styles.inputBox}>
                  <label style={styles.label}>Your Message *</label>
                  <textarea 
                    rows="5"
                    placeholder="Describe your inquiry details..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={styles.textarea}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={styles.submitBtn}
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="spinner" size={16} />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: HELPLINES */}
          <div style={styles.infoCol}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Helpline Channels</h3>
              
              <div style={styles.widget}>
                <Phone size={18} color="var(--color-primary-dark)" style={{ marginTop: '2px' }} />
                <div style={styles.widgetMeta}>
                  <span style={styles.wLabel}>Voice Call</span>
                  <span style={styles.wValue}>+250 788 310 120</span>
                </div>
              </div>

              <div style={styles.widget}>
                <Mail size={18} color="var(--color-primary-dark)" style={{ marginTop: '2px' }} />
                <div style={styles.widgetMeta}>
                  <span style={styles.wLabel}>Support Email</span>
                  <span style={styles.wValue}>support@freshio.rw</span>
                </div>
              </div>

              <div style={styles.widget}>
                <MapPin size={18} color="var(--color-primary-dark)" style={{ marginTop: '2px' }} />
                <div style={styles.widgetMeta}>
                  <span style={styles.wLabel}>Headquarters</span>
                  <span style={styles.wValue}>Kigali Heights, Ground Floor, KG 7 Ave, Kimihurura, Kigali</span>
                </div>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.widget}>
                <Clock size={18} color="var(--color-text-secondary)" style={{ marginTop: '2px' }} />
                <div style={styles.widgetMeta}>
                  <span style={styles.wLabel}>Supermarket Operating Hours</span>
                  <span style={styles.wValue}>Monday - Sunday: 08:00 AM - 10:00 PM</span>
                </div>
              </div>
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
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      flexDirection: 'column',
    },
  },
  formCol: {
    flexGrow: 1,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '20px',
    padding: '28px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-text)',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
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
  },
  select: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
  },
  textarea: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--color-border)',
    fontSize: '14px',
    outline: 'none',
    resize: 'none',
  },
  submitBtn: {
    width: 'fit-content',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  infoCol: {
    width: '360px',
    flexShrink: 0,
    '@media (max-width: 900px)': {
      width: '100%',
    },
  },
  widget: {
    display: 'flex',
    gap: '14px',
    alignItems: 'start',
    marginBottom: '20px',
  },
  widgetMeta: {
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
  wValue: {
    fontSize: '14px',
    color: 'var(--color-text)',
    lineHeight: '1.4',
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '20px 0',
  },
};
export default Contact;
