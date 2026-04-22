import React from 'react';

const TableSkeleton = () => {
  return (
    <div className="table-container" style={{ opacity: 0.6 }}>
      <table>
        <thead>
          <tr>
            <th style={{ width: '60px' }}></th>
            <th>ASSET</th>
            <th>HOLDINGS</th>
            <th>TOTAL VALUE</th>
            <th>POTENTIAL LOSS</th>
            <th style={{ textAlign: 'right' }}>ACTIONABLE AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              <td style={{ textAlign: 'center' }}>
                <div style={{ width: '18px', height: '18px', backgroundColor: '#E2E8F0', borderRadius: '4px', margin: '0 auto' }} />
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', backgroundColor: '#E2E8F0', borderRadius: '50%' }} />
                  <div>
                    <div style={{ width: '80px', height: '12px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '4px' }} />
                    <div style={{ width: '40px', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px' }} />
                  </div>
                </div>
              </td>
              <td>
                <div style={{ width: '100px', height: '12px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '4px' }} />
                <div style={{ width: '60px', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px' }} />
              </td>
              <td>
                <div style={{ width: '80px', height: '12px', backgroundColor: '#E2E8F0', borderRadius: '4px' }} />
              </td>
              <td>
                <div style={{ width: '60px', height: '12px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '4px' }} />
                <div style={{ width: '80px', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px' }} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ width: '120px', height: '36px', backgroundColor: '#E2E8F0', borderRadius: '8px', float: 'right' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
