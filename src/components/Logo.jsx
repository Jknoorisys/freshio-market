import React from 'react';

export const Logo = ({ variant = 'dark', height = 32, showTagline = false }) => {
  if (variant === 'icon') {
    return (
      <img
        src="/icon.png"
        alt="Freshio Icon"
        style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }}
      />
    );
  }

  // Render the full brand logo image
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', alignItems: 'flex-start' }}>
      <img
        src="/logo.png"
        alt="Freshio Market Logo"
        style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', display: 'block' }}
      />
      {showTagline && (
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            letterSpacing: '1px',
            marginTop: '3px',
            textTransform: 'uppercase',
            paddingLeft: '2px'
          }}
        >
          Kigali's Fresh Choice
        </span>
      )}
    </div>
  );
};

export default Logo;
