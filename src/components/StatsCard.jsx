import React from 'react';
import { motion } from 'framer-motion';

const AnimatedNumber = ({ value, prefix = '$' }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      {prefix}{value.toLocaleString()}
    </motion.span>
  );
};

const StatsCard = ({ title, stcg, ltcg, variant = 'white' }) => {
  const isBlue = variant === 'blue';
  
  // Calculations per requirements
  const netST = stcg.profits - stcg.losses;
  const netLT = ltcg.profits - ltcg.losses;
  const totalRealised = netST + netLT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '1.5rem',
        flex: 1,
        background: isBlue ? 'var(--primary)' : 'white',
        color: isBlue ? 'white' : 'var(--text-primary)',
        boxShadow: isBlue ? '0 10px 20px rgba(0, 82, 254, 0.15)' : 'var(--shadow)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        minWidth: '280px',
        border: isBlue ? 'none' : '1px solid var(--border)'
      }}
    >
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
        {title}
      </h3>

      <div style={{ width: '100%' }}>
        {/* Table Header */}
        <div style={{ display: 'flex', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ flex: 1, textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>Short-term</div>
          <div style={{ flex: 1, textAlign: 'right', fontSize: '0.85rem', fontWeight: 600 }}>Long-term</div>
        </div>

        {/* Profits Row */}
        <div style={{ display: 'flex', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <div style={{ flex: 1 }}>Profits</div>
          <div style={{ flex: 1, textAlign: 'right' }}><AnimatedNumber value={Math.abs(stcg.profits)} /></div>
          <div style={{ flex: 1, textAlign: 'right' }}><AnimatedNumber value={Math.abs(ltcg.profits)} /></div>
        </div>

        {/* Losses Row */}
        <div style={{ display: 'flex', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <div style={{ flex: 1 }}>Losses</div>
          <div style={{ flex: 1, textAlign: 'right' }}><AnimatedNumber value={Math.abs(stcg.losses)} /></div>
          <div style={{ flex: 1, textAlign: 'right' }}><AnimatedNumber value={Math.abs(ltcg.losses)} /></div>
        </div>

        {/* Net Capital Gains Row */}
        <div style={{ display: 'flex', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <div style={{ flex: 1 }}>Net Capital Gains</div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <AnimatedNumber value={Math.abs(netST)} prefix={netST < 0 ? '-$' : '$'} />
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <AnimatedNumber value={Math.abs(netLT)} prefix={netLT < 0 ? '-$' : '$'} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
          {isBlue ? 'Effective Capital Gains:' : 'Realised Capital Gains:'}
        </h3>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
          <AnimatedNumber value={Math.abs(totalRealised)} prefix={totalRealised < 0 ? '-$' : '$'} />
        </h3>
      </div>
    </motion.div>
  );
};

export default StatsCard;
