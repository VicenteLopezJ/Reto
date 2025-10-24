import React from 'react';

const StatsCard = ({ title, value, bgColor = 'bg-white' }) => {
  return (
    <div style={{
      backgroundColor: '#cbd5e1',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }}>
      <h3 style={{
        fontSize: '2.5rem',
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: '0.5rem',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        letterSpacing: '-0.02em'
      }}>{value}</h3>
      <p style={{
        fontSize: '0.875rem',
        fontWeight: '800',
        color: '#334155',
        letterSpacing: '0.01em'
      }}>{title}</p>
    </div>
  );
};

export default StatsCard;