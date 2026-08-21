import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const MobileNavBar = ({ title, showBack = true, onBack, rightElement }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div style={styles.header}>
      <div style={styles.left}>
        {showBack && (
          <button onClick={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color="var(--color-text)" />
          </button>
        )}
      </div>
      <div style={styles.center}>
        <h1 style={styles.title}>{title}</h1>
      </div>
      <div style={styles.right}>
        {rightElement || <div style={{ width: 24 }} />}
      </div>
    </div>
  );
};

const styles = {
  header: {
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid var(--color-border)',
    position: 'sticky',
    top: 0,
    zIndex: 900,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    width: '40px',
  },
  center: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--color-text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '40px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '-4px',
    transition: 'background-color 0.2s',
  },
};

export default MobileNavBar;
