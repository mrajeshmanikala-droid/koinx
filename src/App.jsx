import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import AssetTable from './components/AssetTable';
import TableSkeleton from './components/TableSkeleton';
import SummaryBox from './components/SummaryBox';
import { MOCK_ASSETS, INITIAL_GAINS } from './data';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Info } from 'lucide-react';
import TaxSavingsChart from './components/TaxSavingsChart';
import Auth from './components/Auth';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('koinx_auth') === 'true';
  });
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isBannerExpanded, setIsBannerExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSuggestions, setGlobalSuggestions] = useState([]);
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch Real-time Coins from CoinGecko
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true');
        const data = await response.json();

        const transformedAssets = data.map((coin, index) => {
          // Generate mock portfolio data for the live coins
          const mockHoldings = (Math.random() * 10).toFixed(2);
          const mockLoss = Math.random() > 0.5 ? -(Math.random() * 1000) : (Math.random() * 500);

          return {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            icon: coin.image,
            holdings: parseFloat(mockHoldings),
            price: coin.current_price,
            value: parseFloat(mockHoldings) * coin.current_price,
            shortTermPerformance: index % 2 === 0 ? mockLoss : 0,
            longTermPerformance: index % 2 !== 0 ? mockLoss : 0,
            type: index % 2 === 0 ? 'ST' : 'LT',
            timestamp: Date.now() - (index * 1000), // Ensure stable order
            sparkline: coin.sparkline_in_7d?.price || []
          };
        });

        setAssets(transformedAssets);
        // Do not automatically select any assets
        setSelectedIds([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching coins:', error);
        setAssets(MOCK_ASSETS); // Fallback to mock data
        setSelectedIds([]);
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // Global Search Effect
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setGlobalSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingGlobal(true);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchQuery}`);
        const data = await response.json();
        
        // Filter out coins already in our assets list
        const existingIds = new Set(assets.map(a => a.id));
        const newSuggestions = data.coins
          .filter(coin => !existingIds.has(coin.id))
          .slice(0, 5); // Limit to 5 suggestions
        
        setGlobalSuggestions(newSuggestions);
      } catch (error) {
        console.error('Global search error:', error);
      } finally {
        setIsSearchingGlobal(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, assets]);

  const handleAddGlobalAsset = async (coinId) => {
    setIsLoading(true);
    setShowSuggestions(false);
    setSearchQuery('');
    
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&sparkline=true`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const coin = data[0];
        const mockHoldings = (Math.random() * 5).toFixed(2);
        const mockLoss = Math.random() > 0.5 ? -(Math.random() * 500) : (Math.random() * 200);

        const newAsset = {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          icon: coin.image,
          holdings: parseFloat(mockHoldings),
          price: coin.current_price,
          value: parseFloat(mockHoldings) * coin.current_price,
          shortTermPerformance: mockLoss,
          longTermPerformance: 0,
          type: 'ST',
          timestamp: Date.now(),
          sparkline: coin.sparkline_in_7d?.price || []
        };

        setAssets(prev => [newAsset, ...prev]);
        setSelectedIds(prev => [...prev, newAsset.id]); // Automatically select the new asset
      }
    } catch (error) {
      console.error('Error adding global asset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (id) => {
    console.log('Toggling asset:', id);
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    console.log('Toggling all assets');
    setSelectedIds(prev =>
      prev.length === assets.length ? [] : assets.map(a => a.id)
    );
  };

  // Calculations per Notion requirements
  const calculations = useMemo(() => {
    // 1. Pre-Harvesting State (Initial API state)
    const preSTCG = { ...INITIAL_GAINS.stcg };
    const preLTCG = { ...INITIAL_GAINS.ltcg };
    const preRealised = (preSTCG.profits - preSTCG.losses) + (preLTCG.profits - preLTCG.losses);

    // 2. Post-Harvesting State
    let postSTCG = { ...INITIAL_GAINS.stcg };
    let postLTCG = { ...INITIAL_GAINS.ltcg };

    const selectedAssets = assets.filter(a => selectedIds.includes(a.id));

    selectedAssets.forEach(asset => {
      // Add ST performance
      if (asset.shortTermPerformance > 0) {
        postSTCG.profits += asset.shortTermPerformance;
      } else if (asset.shortTermPerformance < 0) {
        postSTCG.losses += Math.abs(asset.shortTermPerformance);
      }

      // Add LT performance
      if (asset.longTermPerformance > 0) {
        postLTCG.profits += asset.longTermPerformance;
      } else if (asset.longTermPerformance < 0) {
        postLTCG.losses += Math.abs(asset.longTermPerformance);
      }
    });

    const postRealised = (postSTCG.profits - postSTCG.losses) + (postLTCG.profits - postLTCG.losses);

    // 3. Savings Calculation
    const realisedDifference = preRealised - postRealised;
    const taxSavings = realisedDifference > 0 ? realisedDifference * 0.3 : 0;

    // 4. Total Harvested Loss (for SummaryBox)
    let totalHarvestedLoss = 0;
    selectedAssets.forEach(asset => {
      if (asset.shortTermPerformance < 0) totalHarvestedLoss += Math.abs(asset.shortTermPerformance);
      if (asset.longTermPerformance < 0) totalHarvestedLoss += Math.abs(asset.longTermPerformance);
    });

    return {
      preSTCG,
      preLTCG,
      postSTCG,
      postLTCG,
      taxSavings,
      totalHarvestedLoss
    };
  }, [selectedIds, assets]);

  if (!isAuthenticated) {
    return <Auth onLogin={() => {
      setIsAuthenticated(true);
      localStorage.setItem('koinx_auth', 'true');
    }} />;
  }

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => {
          setIsAuthenticated(false);
          localStorage.removeItem('koinx_auth');
        }}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {activeTab === 'Dashboard' && (
          <>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Tax Optimisation</h1>
                <a 
                  href="javascript:void(0)" 
                  onClick={() => setShowHowItWorks(!showHowItWorks)}
                  style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'underline' }}
                >
                  How it works?
                </a>
              </div>

              <AnimatePresence>
                {showHowItWorks && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        left: '0', 
                        marginTop: '0.75rem',
                        background: 'white', 
                        padding: '1.25rem', 
                        borderRadius: '16px', 
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        width: '320px',
                        zIndex: 100,
                        border: '1px solid #F1F5F9',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div 
                        style={{ 
                          position: 'absolute', 
                          top: '-8px', 
                          left: '120px', 
                          width: '0', 
                          height: '0', 
                          borderLeft: '8px solid transparent', 
                          borderRight: '8px solid transparent', 
                          borderBottom: '8px solid white'
                        }} 
                      />
                      <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontWeight: 500, fontSize: '0.85rem' }}>
                        <li>See your capital gains for FY 2024-25 in the left card</li>
                        <li>Check boxes for assets you plan on selling to reduce your tax liability</li>
                        <li>Instantly see your updated tax liability in the right card</li>
                      </ul>
                      <p style={{ marginTop: '1rem', fontWeight: 700, color: 'var(--text-secondary)', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', fontSize: '0.8rem' }}>
                        💡 Pro tip: Experiment with different combinations of your holdings to optimize your tax liability
                      </p>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <div 
                onClick={() => setIsBannerExpanded(!isBannerExpanded)}
                style={{
                  backgroundColor: 'rgba(0, 82, 254, 0.05)',
                  border: '1px solid rgba(0, 82, 254, 0.2)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      backgroundColor: 'rgba(0, 82, 254, 0.1)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <Info size={14} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Important Notes And Disclaimers</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isBannerExpanded ? 180 : 0 }}
                  >
                    <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isBannerExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #F1F5F9', marginTop: '0.85rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 900 }}>•</span>
                          <p>
                            <strong style={{ color: 'var(--text-primary)' }}>Price Source Disclaimer:</strong> Please note that the current price of your coins may differ from the prices listed on specific exchanges. This is because we use <strong style={{ color: 'var(--text-primary)' }}>CoinGecko</strong> as our default price source for certain exchanges, rather than fetching prices directly from the exchange.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 900 }}>•</span>
                          <p>
                            <strong style={{ color: 'var(--text-primary)' }}>Country-specific Availability:</strong> Tax loss harvesting may <strong style={{ color: 'var(--text-primary)' }}>not be supported in all countries</strong>. We strongly recommend consulting with your local tax advisor or accountant before performing any related actions on your exchange.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 900 }}>•</span>
                          <p>
                            <strong style={{ color: 'var(--text-primary)' }}>Utilization of Losses:</strong> Tax loss harvesting typically allows you to offset capital gains. However, if you have <strong style={{ color: 'var(--text-primary)' }}>zero or no applicable crypto capital gains</strong>, the usability of these harvested losses may be limited. Kindly confirm with your tax advisor how such losses can be applied in your situation.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {isLoading ? (
                <>
                  <div style={{ height: '240px', background: 'white', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: '240px', background: 'white', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ height: '240px', background: 'white', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
                </>
              ) : (
                <>
                  <StatsCard
                    title="Pre-Harvesting Status"
                    stcg={calculations.preSTCG}
                    ltcg={calculations.preLTCG}
                    variant="white"
                  />
                  <StatsCard 
                    title="After Harvesting Status"
                    stcg={calculations.postSTCG}
                    ltcg={calculations.postLTCG}
                    variant="blue"
                    taxSavings={calculations.taxSavings}
                  />
                  <TaxSavingsChart savings={calculations.taxSavings} />
                </>
              )}
            </div>

            <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                backgroundColor: 'rgba(0, 82, 254, 0.1)',
                border: '1px solid rgba(0, 82, 254, 0.2)',
                padding: '1rem 1.5rem',
                borderRadius: '16px',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '1.5rem' }}>💡</div>
                <div>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '0.1rem', fontSize: '0.95rem', fontWeight: 800 }}>Maximize Your Returns</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
                    Select underperforming assets to realize losses and offset your capital gains.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Select Assets to Harvest</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Identify unrealized losses in your portfolio.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Search Bar */}
                  <div style={{ 
                    position: 'relative',
                    minWidth: '240px'
                  }}>
                    <Search 
                      size={18} 
                      style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)',
                        opacity: 0.7
                      }} 
                    />
                    <input 
                      type="text" 
                      placeholder="Search or add any coin..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                        e.target.style.boxShadow = '0 0 0 4px rgba(0, 82, 254, 0.1)';
                        setShowSuggestions(true);
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = 'var(--shadow)';
                        // Small timeout to allow clicking suggestions
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        borderRadius: '14px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        outline: 'none',
                        transition: 'all 0.3s',
                        boxShadow: 'var(--shadow)'
                      }}
                    />

                    {/* Search Suggestions Dropdown */}
                    <AnimatePresence>
                      {showSuggestions && (globalSuggestions.length > 0 || isSearchingGlobal) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '0.5rem',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            border: '1px solid var(--border)',
                            zIndex: 1000,
                            overflow: 'hidden'
                          }}
                        >
                          {isSearchingGlobal && (
                            <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              Searching for more coins...
                            </div>
                          )}
                          {!isSearchingGlobal && globalSuggestions.map(coin => (
                            <div
                              key={coin.id}
                              onClick={() => handleAddGlobalAsset(coin.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                borderBottom: '1px solid #f1f5f9'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <img src={coin.thumb} alt={coin.name} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{coin.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{coin.symbol}</div>
                              </div>
                              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                                Add
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div
                    onClick={() => setShowAll(!showAll)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      cursor: 'pointer',
                      userSelect: 'none',
                      backgroundColor: 'var(--card-bg)',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '14px',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow)'
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 700 }}>Show All Assets</span>
                    <div style={{
                      width: '44px',
                      height: '24px',
                      backgroundColor: showAll ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      position: 'relative',
                      transition: 'background-color 0.3s'
                    }}>
                      <motion.div
                        animate={{ x: showAll ? 22 : 2 }}
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: '2px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <TableSkeleton />
              ) : (
                <>
                  <SummaryBox
                    harvestedLoss={calculations.totalHarvestedLoss}
                    taxSavings={calculations.taxSavings}
                    assetsCount={selectedIds.length}
                  />
                  <AssetTable
                    assets={assets.filter(a => {
                      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                          a.symbol.toLowerCase().includes(searchQuery.toLowerCase());
                      
                      if (searchQuery.trim()) return matchesSearch;
                      
                      return showAll ? true : (a.shortTermPerformance + a.longTermPerformance) < 0;
                    })}
                    selectedIds={selectedIds}
                    onToggle={handleToggle}
                    onToggleAll={handleToggleAll}
                  />
                </>
              )}
            </section>
          </>
        )}

        {activeTab === 'Taxes' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>Tax Reports & Documents</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              
              {/* 2024 Tax Card */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Tax Year 2026</h3>
                  <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>Current</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Total Realised Gains</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>$12,450.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Est. Tax Liability</span>
                    <span style={{ fontWeight: 700, color: 'var(--danger)' }}>$2,800.00</span>
                  </div>
                </div>

                <button style={{ width: '100%', background: 'var(--primary-gradient)', color: 'white', padding: '0.75rem', borderRadius: '10px', fontWeight: 700 }}>
                  Generate Report
                </button>
              </div>

              {/* 2023 Tax Card */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Tax Year 2025</h3>
                  <span style={{ background: '#F1F5F9', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>Filed</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Total Realised Gains</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>$45,210.50</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Taxes Paid</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>$9,450.00</span>
                  </div>
                </div>

                <button style={{ width: '100%', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '0.75rem', borderRadius: '10px', fontWeight: 700 }}>
                  Download IRS Form 8949
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Portfolio' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>Portfolio Overview</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Total Balance</h3>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>$145,230.00</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ background: 'var(--success)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>+12.5%</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Past 30 days</span>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1rem' }}>Asset Allocation</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '45%', height: '100%', background: '#F7931A' }}></div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', minWidth: '80px' }}>BTC 45%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '30%', height: '100%', background: '#627EEA' }}></div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', minWidth: '80px' }}>ETH 30%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '15%', height: '100%', background: '#14F195' }}></div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', minWidth: '80px' }}>SOL 15%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer style={{ marginTop: '6rem', padding: '4rem 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '1.5rem' }}>
          <a href="javascript:void(0)" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Privacy Policy</a>
          <a href="javascript:void(0)" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Terms of Service</a>
          <a href="javascript:void(0)" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Security</a>
        </div>
        <p style={{ fontWeight: 500, opacity: 0.6 }}>© 2026 KoinX Inc. Empowering global crypto investors.</p>
      </footer>
    </div>
  );
}

export default App;
