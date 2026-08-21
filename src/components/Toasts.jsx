import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

export const Toasts = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div style={styles.container}>
      {toasts.map((toast) => {
        const Icon = getIcon(toast.type);
        const colorStyles = getStyles(toast.type);

        return (
          <div
            key={toast.id}
            className="animate-toast"
            style={{
              ...styles.toast,
              ...colorStyles,
            }}
          >
            <Icon size={20} style={{ marginRight: '12px', flexShrink: 0 }} />
            <span style={styles.message}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={styles.closeBtn}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return AlertCircle;
    case 'info':
    default:
      return Info;
  }
};

const getStyles = (type) => {
  switch (type) {
    case 'success':
      return {
        backgroundColor: '#FFFFFF',
        borderLeft: '4px solid var(--color-primary)',
        color: 'var(--color-text)',
        boxShadow: '0 10px 30px rgba(8, 122, 75, 0.12)',
      };
    case 'warning':
      return {
        backgroundColor: '#FFFFFF',
        borderLeft: '4px solid var(--color-orange)',
        color: 'var(--color-text)',
        boxShadow: '0 10px 30px rgba(255, 159, 67, 0.12)',
      };
    case 'error':
      return {
        backgroundColor: '#FFFFFF',
        borderLeft: '4px solid var(--color-error)',
        color: 'var(--color-text)',
        boxShadow: '0 10px 30px rgba(255, 90, 95, 0.12)',
      };
    case 'info':
    default:
      return {
        backgroundColor: '#FFFFFF',
        borderLeft: '4px solid var(--color-info, #3B82F6)',
        color: 'var(--color-text)',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.12)',
      };
  }
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '380px',
    width: 'calc(100% - 48px)',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid var(--color-border)',
    boxSizing: 'border-box',
    width: '100%',
    position: 'relative',
  },
  message: {
    flexGrow: 1,
    marginRight: '8px',
    lineHeight: '1.4',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
};
export default Toasts;
