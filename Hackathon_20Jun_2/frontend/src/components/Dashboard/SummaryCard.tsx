import React from 'react';
import { IconType } from 'react-icons';

interface SummaryCardProps {
  icon: IconType;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  iconBgColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon: Icon, title, value, change, changeType, iconBgColor }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
    }}
    className="hover:-translate-y-1 hover:shadow-xl"
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: iconBgColor,
          marginRight: '1rem',
        }}>
          <Icon size={24} color="white" />
        </div>
        <div>
          <h3 style={{
            color: '#4a5568',
            fontSize: '1rem',
            fontWeight: '600',
            margin: 0,
          }}>{title}</h3>
          <p style={{
            color: '#1a202c',
            fontSize: '1.75rem',
            fontWeight: '700',
            margin: 0,
          }}>{value}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{
          color: changeType === 'increase' ? '#38a169' : '#e53e3e',
          fontSize: '0.875rem',
          fontWeight: '600',
          background: changeType === 'increase' ? 'rgba(56, 161, 105, 0.1)' : 'rgba(229, 62, 62, 0.1)',
          padding: '0.25rem 0.5rem',
          borderRadius: '8px',
          marginRight: '0.5rem'
        }}>
          {change}
        </span>
        <span style={{ color: '#718096', fontSize: '0.875rem' }}>vs last month</span>
      </div>
    </div>
  );
};

export default SummaryCard;