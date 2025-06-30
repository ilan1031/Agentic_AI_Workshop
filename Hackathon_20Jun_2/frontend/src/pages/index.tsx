import React from 'react';
import Layout from '../components/Layout';
import { 
  FiDollarSign, 
  FiCheckSquare, 
  FiTrendingUp, 
  FiUsers, 
  FiGrid, 
  FiPlusCircle, 
  FiList, 
  FiRefreshCw, 
  FiCpu 
} from 'react-icons/fi';
import Link from 'next/link';
import AgentStatus from '../components/Agents/AgentStatus';
import SummaryCard from '../components/Dashboard/SummaryCard';
import ActivityFeed from '../components/Dashboard/ActivityFeed';

const DashboardPage: React.FC = () => {

  const quickActionCards = [
    { href: '/invoices/create', icon: FiPlusCircle, title: 'New Invoice', desc: 'Create a single invoice' },
    { href: '/invoices/list', icon: FiList, title: 'View Invoices', desc: 'Browse & manage invoices' },
    { href: '/reconcile/upload', icon: FiRefreshCw, title: 'Reconcile Data', desc: 'Match transactions' },
    { href: '/agents/status', icon: FiCpu, title: 'Monitor Agents', desc: 'Check AI agent status' },
  ];
  
  const summaryData = [
    {
      icon: FiDollarSign,
      title: "Total Reconciled",
      value: "$124,530",
      change: "+12.5%",
      changeType: 'increase' as 'increase' | 'decrease',
      iconBgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: FiCheckSquare,
      title: "Invoices Matched",
      value: "1,480",
      change: "+3.2%",
      changeType: 'increase' as 'increase' | 'decrease',
      iconBgColor: "linear-gradient(135deg, #38a169 0%, #2f855a 100%)"
    },
    {
      icon: FiTrendingUp,
      title: "Auto-Reconciled Rate",
      value: "89%",
      change: "-1.8%",
      changeType: 'decrease' as 'decrease' | 'decrease',
      iconBgColor: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)"
    },
    {
      icon: FiUsers,
      title: "Active Agents",
      value: "5",
      change: "Stable",
      changeType: 'increase' as 'increase' | 'decrease',
      iconBgColor: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
    }
  ];

  return (
    <Layout title="Dashboard">
      <div style={{ padding: '2rem 1.5rem', backgroundColor: '#f7fafc' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#1a202c',
              margin: 0
            }}>
              Welcome Back!
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#718096',
              margin: '0.25rem 0 0 0'
            }}>
              Here's a snapshot of your financial activities.
            </p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            cursor: 'pointer'
          }}>
            Download Report
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          {summaryData.map((card, index) => (
            <SummaryCard
              key={index}
              icon={card.icon}
              title={card.title}
              value={card.value}
              change={card.change}
              changeType={card.changeType}
              iconBgColor={card.iconBgColor}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
          alignItems: 'flex-start'
        }}>

          {/* Activity Feed */}
          <div style={{ gridColumn: 'span 1' }}>
            <ActivityFeed />
          </div>
          
          {/* Quick Actions & Agent Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
                border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                color: '#1a202c',
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
              }}>Quick Actions</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
              }}>
                {quickActionCards.map(action => (
                  <Link href={action.href} key={action.title}>
                    <div style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }} className="hover:border-indigo-400 hover:bg-indigo-50">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          marginRight: '1rem',
                          display: 'inline-flex'
                        }}>
                          <action.icon size={20} color="white" />
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', color: '#2d3748', margin: 0 }}>{action.title}</p>
                          <p style={{ fontSize: '0.875rem', color: '#718096', margin: 0 }}>{action.desc}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <AgentStatus refreshInterval={30000} />
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default DashboardPage;