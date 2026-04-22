import React from 'react';

const SummaryBox = ({ harvestedLoss, taxSavings, assetsCount }) => {
  if (assetsCount === 0) return null;

  return (
    <div style={{ 
      marginTop: '1.5rem', 
      padding: '1.5rem 2rem', 
      background: 'var(--card-bg)', 
      borderRadius: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1.5rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid var(--border)'
    }}>
      <div style={{ flex: 1, minWidth: '240px' }}>
        <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Ready to optimize?</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
          You've identified <strong style={{ color: 'var(--primary)' }}>{assetsCount} assets</strong> to harvest. 
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL HARVESTED LOSS</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--danger)', letterSpacing: '-0.02em' }}>${harvestedLoss.toLocaleString()}</p>
        </div>
        <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border)' }} className="desktop-nav"></div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EST. TAX SAVINGS</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--success)', letterSpacing: '-0.02em' }}>${taxSavings.toLocaleString()}</p>
        </div>
        <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border)' }} className="desktop-nav"></div>
        <button style={{ 
          background: 'var(--primary-gradient)', 
          color: 'white', 
          padding: '0.75rem 1.75rem', 
          borderRadius: '12px', 
          fontWeight: 800,
          fontSize: '0.9rem',
          boxShadow: '0 8px 15px rgba(0, 82, 254, 0.15)',
          transition: 'transform 0.2s'
        }}>
          Harvest Losses Now
        </button>
      </div>
    </div>
  );
};

export default SummaryBox;
