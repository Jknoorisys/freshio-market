import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, X, Navigation, Search } from 'lucide-react';

export const LocationSelector = ({ isOpen, onClose }) => {
  const { selectedLocation, changeLocation } = useApp();
  const [typedLocation, setTypedLocation] = useState('');

  if (!isOpen) return null;

  const popularCities = ['Nyarutarama', 'Kimihurura', 'Kiyovu', 'Kacyiru', 'Remera', 'Kibagabaga'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typedLocation.trim()) {
      changeLocation(typedLocation.trim());
      onClose();
    }
  };

  const handleSelect = (city) => {
    changeLocation(city);
    onClose();
  };

  const detectLocation = () => {
    changeLocation('Nyarutarama'); // Mocking GPS detection
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <MapPin size={22} color="var(--color-primary)" />
            <h3 style={styles.title}>Where should we deliver?</h3>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.body}>
          <p style={styles.subtitle}>
            Enter your city, street, or pincode to check service availability and delivery times.
          </p>

          <form onSubmit={handleSubmit} style={styles.searchContainer}>
            <div style={styles.inputWrapper}>
              <Search size={18} color="var(--color-text-secondary)" style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Enter your location..."
                value={typedLocation}
                onChange={(e) => setTypedLocation(e.target.value)}
                style={styles.input}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
              Check
            </button>
          </form>

          <button onClick={detectLocation} style={styles.detectBtn}>
            <Navigation size={16} />
            <span>Detect Current Location</span>
          </button>

          <div style={styles.divider} />

          <h4 style={styles.sectionTitle}>Popular Sectors</h4>
          <div style={styles.cityGrid}>
            {popularCities.map((city) => {
              const isSelected = selectedLocation.toLowerCase().includes(city.toLowerCase());
              return (
                <button
                  key={city}
                  onClick={() => handleSelect(city)}
                  style={{
                    ...styles.cityCard,
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary-light)' : '#FFFFFF',
                    color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-text)',
                  }}
                >
                  <MapPin size={14} style={{ marginRight: '6px' }} />
                  {city}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 37, 31, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    boxShadow: '0 20px 50px rgba(23, 37, 31, 0.15)',
    width: '100%',
    maxWidth: '480px',
    animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--color-text)',
    margin: 0,
  },
  closeBtn: {
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '50%',
    backgroundColor: '#F3F6F4',
    transition: 'background-color 0.2s',
  },
  body: {
    padding: '24px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  searchContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid var(--color-border)',
    borderRadius: '12px',
    padding: '0 14px',
    flexGrow: 1,
    backgroundColor: '#FFFDFB',
    transition: 'border-color 0.2s',
    '&:focus-within': {
      borderColor: 'var(--color-primary)',
    },
  },
  searchIcon: {
    marginRight: '8px',
  },
  input: {
    width: '100%',
    height: '44px',
    fontSize: '14px',
    fontWeight: '500',
  },
  submitBtn: {
    borderRadius: '12px',
    padding: '0 20px',
    fontSize: '14px',
  },
  detectBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px dashed var(--color-primary)',
    color: 'var(--color-primary-dark)',
    fontWeight: '600',
    fontSize: '14px',
    backgroundColor: 'var(--color-primary-light)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '24px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '12px',
  },
  cityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  cityCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    justifyContent: 'flex-start',
  },
};

export default LocationSelector;
