import React from 'react';
import { motion } from 'framer-motion';

const TaxSavingsChart = ({ savings }) => {
  const [hoverIndex, setHoverIndex] = React.useState(null);
  const [timeframe, setTimeframe] = React.useState('1M');

  // Dynamic data points based on timeframe
  const dataMap = {
    '1W': [40, 35, 50, 45, 65, 60, 80],
    '1M': [30, 45, 35, 60, 55, 80, 75, 90, 85]
  };

  const baseData = dataMap[timeframe];
  // Calculate a reasonable scale for the current savings
  const currentVal = Math.min((savings / 10000) * 100, 100);
  const data = [...baseData, currentVal || 20];
  
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - val}`).join(' ');
  const areaPoints = `0,100 ${points} 100,100`;

  const getTooltipPos = () => {
    const idx = hoverIndex !== null ? hoverIndex : data.length - 1;
    const x = (idx / (data.length - 1)) * 100;
    const y = 100 - data[idx];
    return { x: `${x}%`, y: `${y}%` };
  };

  const tooltipPos = getTooltipPos();

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem', 
      borderRadius: '20px', 
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border)',
      flex: 1,
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tax Savings Trend
          </h3>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>
            {savings > 0 ? `+${((savings/5000)*100).toFixed(0)}% Growth` : 'Steady Trend'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setTimeframe('1W')}
            style={{ 
              padding: '0.25rem 0.6rem', 
              backgroundColor: timeframe === '1W' ? 'var(--primary)' : '#F3F4F6', 
              color: timeframe === '1W' ? 'white' : 'var(--text-secondary)',
              borderRadius: '6px', 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              border: 'none', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            1W
          </button>
          <button 
            onClick={() => setTimeframe('1M')}
            style={{ 
              padding: '0.25rem 0.6rem', 
              backgroundColor: timeframe === '1M' ? 'var(--primary)' : '#F3F4F6', 
              color: timeframe === '1M' ? 'white' : 'var(--text-secondary)',
              borderRadius: '6px', 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              border: 'none', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            1M
          </button>
        </div>
      </div>

      <div 
        style={{ position: 'relative', height: '140px', width: '100%', marginTop: '1rem', cursor: 'crosshair' }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Vertical Grid Lines */}
          {data.map((_, i) => (
            <line 
              key={i}
              x1={(i / (data.length - 1)) * 100}
              y1="0"
              x2={(i / (data.length - 1)) * 100}
              y2="100"
              stroke="#F1F5F9"
              strokeWidth="0.5"
            />
          ))}

          <motion.polyline
            key={timeframe}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            vectorEffect="non-scaling-stroke"
          />
          
          <motion.polygon
            key={`area-${timeframe}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            fill="url(#chartGradient)"
            points={areaPoints}
          />

          {/* Interactive hit areas */}
          {data.map((_, i) => (
            <rect
              key={i}
              x={((i - 0.5) / (data.length - 1)) * 100}
              y="0"
              width={`${100 / (data.length - 1)}%`}
              height="100%"
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
              style={{ cursor: 'pointer' }}
            />
          ))}

          {/* Hover point */}
          {hoverIndex !== null && (
            <circle 
              cx={(hoverIndex / (data.length - 1)) * 100} 
              cy={100 - data[hoverIndex]} 
              r="3" 
              fill="var(--primary)" 
              stroke="white" 
              strokeWidth="1.5" 
            />
          )}
        </svg>

        {/* Floating Tooltip */}
        <motion.div 
          animate={{ 
            left: tooltipPos.x,
            top: tooltipPos.y,
            opacity: 1
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -130%)',
            backgroundColor: 'var(--text-primary)',
            color: 'white',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 800,
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
        >
          ${hoverIndex !== null ? (data[hoverIndex] * 120.5).toLocaleString() : savings.toLocaleString()}
          <div style={{ 
            position: 'absolute', 
            bottom: '-4px', 
            left: '50%', 
            transform: 'translateX(-50%) rotate(45deg)', 
            width: '8px', 
            height: '8px', 
            backgroundColor: 'var(--text-primary)' 
          }} />
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>PREDICTED</p>
          <p style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--success)' }}>${(savings * 1.5 + 2000).toLocaleString()}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>EFFICIENCY</p>
          <p style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>{savings > 0 ? '98.2%' : '84.5%'}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>RANK</p>
          <p style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>Top 2%</p>
        </div>
      </div>
    </div>
  );
};

export default TaxSavingsChart;
