import React from 'react';
import { HelpCircle, Bell, User } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '1.5rem',
      padding: '0.5rem 1.25rem',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: '1rem',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <div 
          onClick={() => setActiveTab('Dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'var(--primary-gradient)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.1rem',
            boxShadow: '0 4px 10px rgba(0, 82, 254, 0.3)'
          }}>K</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>KoinX</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '2.5rem' }} className="desktop-nav">
          <a 
            href="javascript:void(0)" 
            onClick={() => setActiveTab('Dashboard')} 
            style={{ fontSize: '0.9rem', fontWeight: 700, color: activeTab === 'Dashboard' ? 'var(--primary)' : 'var(--text-primary)', transition: 'color 0.2s' }}
          >
            Dashboard
          </a>
          <a 
            href="javascript:void(0)" 
            onClick={() => setActiveTab('Taxes')} 
            style={{ fontSize: '0.9rem', fontWeight: 700, color: activeTab === 'Taxes' ? 'var(--primary)' : 'var(--text-secondary)', transition: 'all 0.2s' }}
          >
            Taxes
          </a>
          <a 
            href="javascript:void(0)" 
            onClick={() => setActiveTab('Portfolio')} 
            style={{ fontSize: '0.9rem', fontWeight: 700, color: activeTab === 'Portfolio' ? 'var(--primary)' : 'var(--text-secondary)', transition: 'all 0.2s' }}
          >
            Portfolio
          </a>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <a href="javascript:void(0)" onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
          <HelpCircle size={18} />
          <span className="desktop-nav">Help Center</span>
        </a>
        <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border)' }} className="desktop-nav"></div>
        <Bell size={20} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} className="desktop-nav" />
        <div 
          onClick={onLogout}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'white', 
            borderRadius: '12px', 
            padding: '0.45rem 1rem',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--danger)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }} className="desktop-nav">Logout</span>
          <div style={{ 
            width: '28px', 
            height: '28px', 
            background: '#F8FAFC', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <User size={16} style={{ color: 'var(--text-secondary)' }} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
