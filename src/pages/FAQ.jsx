import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQ = () => {
  // Store ID of the active expanded FAQ accordion
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  return (
    <div style={styles.page}>
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <HelpCircle size={40} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
          <h1 style={styles.title}>Frequently Asked Questions</h1>
          <p style={styles.desc}>Need help with billing, refunds, or delivery times in Kigali? Find quick answers below.</p>
        </div>

        {/* FAQ list */}
        <div style={styles.faqList}>
          {FAQS.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div 
                key={faq.id} 
                style={{
                  ...styles.faqCard,
                  borderColor: isExpanded ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              >
                <button 
                  onClick={() => toggleFaq(faq.id)} 
                  style={styles.faqQuestionRow}
                >
                  <span style={{
                    ...styles.faqQuestion,
                    color: isExpanded ? 'var(--color-primary-dark)' : 'var(--color-text)',
                  }}>{faq.question}</span>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {isExpanded && (
                  <div style={styles.faqAnswerBlock}>
                    <p style={styles.faqAnswer}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '40px 0 80px 0',
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--color-border)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(22, 58, 53, 0.01)',
    transition: 'border-color 0.2s',
  },
  faqQuestionRow: {
    width: '100%',
    padding: '20px 24px',
    background: 'none',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    cursor: 'pointer',
    outline: 'none',
  },
  faqQuestion: {
    fontSize: '15px',
    fontWeight: '800',
    lineHeight: '1.4',
    paddingRight: '16px',
  },
  faqAnswerBlock: {
    padding: '0 24px 20px 24px',
    borderTop: '1px dashed var(--color-border)',
    paddingTop: '16px',
    backgroundColor: '#FAFBFB',
  },
  faqAnswer: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    margin: 0,
  },
};
export default FAQ;
