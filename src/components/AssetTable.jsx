import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TradingViewChart from './TradingViewChart';

const INITIAL_VISIBLE_COUNT = 10;

const AssetTable = ({ assets, selectedIds, onToggle, onToggleAll }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'shortTermPerformance',
    direction: 'asc'
  });
  const [expandedAssetId, setExpandedAssetId] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => {
      // 1. Prioritize selected assets
      const aSelected = selectedIds.includes(a.id);
      const bSelected = selectedIds.includes(b.id);
      
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      // 2. Prioritize most recently added assets (timestamp)
      if (a.timestamp !== b.timestamp) {
        return b.timestamp - a.timestamp;
      }

      // 3. Apply sort config
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      
      let aValue = a[key];
      let bValue = b[key];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [assets, selectedIds, sortConfig]);

  const isAllSelected = sortedAssets.length > 0 && selectedIds.length === sortedAssets.length;
  const displayedAssets = (showAll || sortedAssets.length <= INITIAL_VISIBLE_COUNT + 2) ? sortedAssets : sortedAssets.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = sortedAssets.length > displayedAssets.length;

  const renderSortIcon = (key) => {
    if (sortConfig?.key !== key) return <ChevronDown size={12} style={{ opacity: 0.4 }} />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div className="table-container" style={{ border: 'none', background: 'transparent' }}>
      <table style={{ borderSpacing: '0 4px', borderCollapse: 'separate' }}>
        <thead>
          <tr>
            <th style={{ width: '32px', textAlign: 'center', background: 'transparent', border: 'none' }}>
              <div 
                onClick={onToggleAll}
                style={{ 
                   width: '18px', 
                   height: '18px', 
                   borderRadius: '5px', 
                   border: `2px solid ${isAllSelected ? 'var(--primary)' : 'var(--border)'}`,
                   backgroundColor: isAllSelected ? 'var(--primary)' : 'transparent',
                   cursor: 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   transition: 'all 0.2s'
                }}
              >
                {isAllSelected && <div style={{ width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '1px' }} />}
              </div>
            </th>
            <th style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => handleSort('name')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ASSET {renderSortIcon('name')}
              </div>
            </th>
            <th style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => handleSort('holdings')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                HOLDINGS {renderSortIcon('holdings')}
              </div>
            </th>
            <th style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => handleSort('price')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                CURRENT PRICE {renderSortIcon('price')}
              </div>
            </th>
            <th style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => handleSort('shortTermPerformance')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                SHORT-TERM {renderSortIcon('shortTermPerformance')}
              </div>
            </th>
            <th style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => handleSort('longTermPerformance')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                LONG-TERM {renderSortIcon('longTermPerformance')}
              </div>
            </th>
            <th style={{ textAlign: 'right', background: 'transparent', border: 'none' }}>AMOUNT TO SELL</th>
          </tr>
        </thead>
        <tbody>
          {displayedAssets.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontWeight: 600, backgroundColor: 'var(--card-bg)', borderRadius: '12px' }}>
                No coins found matching your search.
              </td>
            </tr>
          ) : (
            displayedAssets.map((asset) => {
              const isSelected = selectedIds.includes(asset.id);
              const stValue = asset.type === 'ST' ? asset.shortTermPerformance : 0;
              const ltValue = asset.type === 'LT' ? asset.longTermPerformance : 0;
              
              return (
                <React.Fragment key={asset.id}>
                  <tr 
                    onClick={() => setExpandedAssetId(expandedAssetId === asset.id ? null : asset.id)}
                    style={{ 
                      backgroundColor: 'var(--card-bg)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                      borderRadius: '10px',
                      boxShadow: isSelected ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'var(--shadow)',
                      transform: isSelected ? 'scale(1.002)' : 'none',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                      position: 'relative',
                      zIndex: expandedAssetId === asset.id ? 2 : 1
                    }}
                    className="premium-row"
                  >
                    <td style={{ textAlign: 'center', borderRadius: '10px 0 0 10px', padding: '0.85rem 0.5rem' }} onClick={(e) => e.stopPropagation()}>
                      <div 
                        onClick={() => onToggle(asset.id)}
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '5px', 
                          border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                          backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                          margin: '0 auto',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        {isSelected && <div style={{ width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '1px' }} />}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#F8FAFC', borderRadius: '8px', overflow: 'hidden', padding: '3px', border: '1px solid #F1F5F9' }}>
                          <img 
                            src={asset.icon} 
                            alt={asset.name} 
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${asset.symbol}&background=random`; }}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{asset.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{asset.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{asset.holdings.toLocaleString()} {asset.symbol}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>${(asset.price * 0.9).toLocaleString()}/{asset.symbol}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        ${asset.price > 1000 ? (asset.price / 1000).toFixed(2) + 'K' : asset.price.toLocaleString()}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: stValue >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {stValue >= 0 ? '+' : '-'}${Math.abs(stValue).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {asset.type === 'ST' ? asset.holdings.toLocaleString() : 0} {asset.symbol}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: ltValue >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {ltValue >= 0 ? '+' : '-'}${Math.abs(ltValue).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {asset.type === 'LT' ? asset.holdings.toLocaleString() : 0} {asset.symbol}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', borderRadius: '0 10px 10px 0', padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <div style={{ 
                          padding: '0.4rem', 
                          borderRadius: '8px', 
                          backgroundColor: expandedAssetId === asset.id ? 'var(--primary-light)' : 'transparent',
                          color: expandedAssetId === asset.id ? 'var(--primary)' : 'var(--text-secondary)',
                          transition: 'all 0.2s'
                        }}>
                          <TrendingUp size={16} />
                        </div>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Chart Row */}
                  <AnimatePresence>
                    {expandedAssetId === asset.id && (
                      <tr style={{ background: 'transparent' }}>
                        <td colSpan="7" style={{ padding: '0 0.5rem 1rem 0.5rem' }}>
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ 
                              overflow: 'hidden',
                              backgroundColor: 'white',
                              borderRadius: '0 0 16px 16px',
                              border: '1px solid var(--border)',
                              borderTop: 'none',
                              padding: '1.5rem',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                              marginTop: '-4px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                  <BarChart2 size={18} style={{ color: 'var(--primary)' }} />
                                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Advanced Market Analysis</h4>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Real-time data and technical indicators for {asset.name}</p>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                                  ${asset.price.toLocaleString()}
                                </span>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.1rem' }}>
                                  LIVE MARKET DATA
                                </div>
                              </div>
                            </div>
                            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f3f6', height: '450px' }}>
                              <TradingViewChart symbol={asset.symbol} />
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
      
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1.5rem' }}>
          <button 
            onClick={() => setShowAll(!showAll)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontWeight: 700,
              color: 'var(--primary)',
              transition: 'all 0.2s',
              boxShadow: 'var(--shadow)',
              fontSize: '0.875rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={18} />
              </>
            ) : (
              <>
                View All Assets <ChevronDown size={18} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AssetTable;
