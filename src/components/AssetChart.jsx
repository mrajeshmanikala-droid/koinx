import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const AssetChart = ({ data, color = '#0052FE' }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        No price data available
      </div>
    );
  }

  // Transform sparkline array to Recharts format
  const chartData = data.map((price, index) => ({
    time: index,
    price: price
  }));

  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);

  return (
    <div style={{ width: '100%', height: '180px', marginTop: '1rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis hide dataKey="time" />
          <YAxis 
            hide 
            domain={[minPrice * 0.99, maxPrice * 1.01]} 
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div style={{ 
                    backgroundColor: 'var(--text-primary)', 
                    color: 'white', 
                    padding: '0.4rem 0.75rem', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    ${payload[0].value.toLocaleString()}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetChart;
