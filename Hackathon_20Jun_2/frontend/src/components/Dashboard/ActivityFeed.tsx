import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const activities = [
  {
    icon: FiCheckCircle,
    color: '#38a169',
    title: 'Reconciliation #1023 Completed',
    time: '2 mins ago',
    details: '89 transactions matched, 2 discrepancies found.',
  },
  {
    icon: FiInfo,
    color: '#3182ce',
    title: 'New Bank Feed Uploaded',
    time: '15 mins ago',
    details: 'Citibank-Aug2024.csv (1.2MB)',
  },
  {
    icon: FiAlertTriangle,
    color: '#dd6b20',
    title: 'Agent Warning: Invoice Matcher',
    time: '1 hour ago',
    details: 'Low confidence score for Invoice #INV-0456',
  },
  {
    icon: FiInfo,
    color: '#3182ce',
    title: 'User "alex@example.com" logged in',
    time: '3 hours ago',
    details: 'From IP: 192.168.1.10',
  },
];

const ActivityFeed: React.FC = () => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
      border: '1px solid #e2e8f0',
      height: '100%',
    }}>
      <h3 style={{
        color: '#1a202c',
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '1rem',
      }}>
        Activity Feed
      </h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
        {activities.map((activity, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '1.5rem' }}>
            <div style={{ marginRight: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${activity.color}20`,
              }}>
                <activity.icon size={20} color={activity.color} />
              </div>
            </div>
            <div>
              <p style={{
                fontWeight: '600',
                color: '#2d3748',
                margin: 0,
              }}>
                {activity.title}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#718096',
                margin: '0.25rem 0',
              }}>
                {activity.details}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#a0aec0',
                margin: 0,
              }}>
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;