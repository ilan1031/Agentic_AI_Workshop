import React, { useState, useEffect } from 'react';
import { agentService } from '../../services/agentService';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertTriangle, 
  FiRefreshCw, 
  FiActivity,
  FiCpu,
  FiDatabase,
  FiZap,
  FiPlay,
  FiPause
} from 'react-icons/fi';

interface AgentStatusProps {
  refreshInterval?: number;
}

interface AgentInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  endpoint: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  message: string;
  lastChecked: Date | null;
}

export default function AgentStatus({ refreshInterval = 30000 }: AgentStatusProps) {
  const [agents, setAgents] = useState<AgentInfo[]>([
    {
      name: 'Transaction Extractor',
      description: 'Extracts transaction data from CSV/JSON files',
      icon: <FiDatabase size={20} />,
      endpoint: '/extract-transactions',
      status: 'unknown',
      message: 'Checking status...',
      lastChecked: null
    },
    {
      name: 'Invoice Matcher',
      description: 'Matches transactions with invoice records',
      icon: <FiCheckCircle size={20} />,
      endpoint: '/match-invoices',
      status: 'unknown',
      message: 'Checking status...',
      lastChecked: null
    },
    {
      name: 'Categorizer',
      description: 'Categorizes transactions by type and purpose',
      icon: <FiActivity size={20} />,
      endpoint: '/categorize',
      status: 'unknown',
      message: 'Checking status...',
      lastChecked: null
    },
    {
      name: 'Discrepancy Detector',
      description: 'Detects discrepancies in transaction data',
      icon: <FiAlertTriangle size={20} />,
      endpoint: '/detect-discrepancies',
      status: 'unknown',
      message: 'Checking status...',
      lastChecked: null
    },
    {
      name: 'Reconciliation Approver',
      description: 'Approves and finalizes reconciliation',
      icon: <FiZap size={20} />,
      endpoint: '/reconcile',
      status: 'unknown',
      message: 'Checking status...',
      lastChecked: null
    },
    {
      name: 'Full Workflow',
      description: 'Complete end-to-end reconciliation pipeline',
      icon: <FiCpu size={20} />,
      endpoint: '/full-reconciliation',
      status: 'unknown',
      message: 'Checking status...',
      lastChecked: null
    }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'healthy' | 'unhealthy' | 'unknown'>('unknown');

  const checkAgentHealth = async () => {
    try {
      setIsRefreshing(true);
      const healthData = await agentService.getAgentStatus();
      
      setAgents(prevAgents => prevAgents.map(agent => {
        let status: 'healthy' | 'unhealthy' = 'unhealthy';
        let message = 'Agent unavailable';
        
        if (healthData.agents[agent.name.toLowerCase().replace(/\s+/g, '_')]) {
          const agentStatus = healthData.agents[agent.name.toLowerCase().replace(/\s+/g, '_')];
          status = agentStatus.status;
          message = agentStatus.message;
        } else if (agent.name === 'Full Workflow') {
          // Full workflow status is derived from individual agents
          const individualAgents = ['transaction_extractor', 'invoice_matcher', 'categorizer', 'discrepancy_detector', 'reconciliation_approver'];
          const allHealthy = individualAgents.every(agentKey => 
            healthData.agents[agentKey]?.status === 'healthy'
          );
          status = allHealthy ? 'healthy' : 'unhealthy';
          message = allHealthy ? 'All agents ready' : 'Some agents unavailable';
        }
        
        return {
          ...agent,
          status,
          message,
          lastChecked: new Date()
        };
      }));
      
      setOverallStatus(healthData.healthy ? 'healthy' : 'unhealthy');
    } catch (error) {
      console.error('Failed to check agent health:', error);
      setAgents(prevAgents => prevAgents.map(agent => ({
        ...agent,
        status: 'unhealthy' as const,
        message: 'Connection failed',
        lastChecked: new Date()
      })));
      setOverallStatus('unhealthy');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkAgentHealth();
    const interval = setInterval(checkAgentHealth, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return '#22c55e';
      case 'unhealthy':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <FiCheckCircle size={16} color="#22c55e" />;
      case 'unhealthy':
        return <FiXCircle size={16} color="#ef4444" />;
      default:
        return <FiAlertTriangle size={16} color="#f59e0b" />;
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: getStatusColor(overallStatus),
            animation: overallStatus === 'unknown' ? 'pulse 2s infinite' : 'none'
          }} />
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1a202c',
            margin: 0
          }}>
            Agent Status
          </h3>
          <span style={{
            fontSize: '0.875rem',
            color: '#718096',
            fontWeight: 500
          }}>
            {overallStatus === 'healthy' ? 'All Systems Operational' : 
             overallStatus === 'unhealthy' ? 'Some Issues Detected' : 'Checking Status...'}
          </span>
        </div>
        
        <button
          onClick={checkAgentHealth}
          disabled={isRefreshing}
          style={{
            background: 'rgba(102, 126, 234, 0.1)',
            color: '#5a67d8',
            border: 'none',
            padding: '0.5rem',
            borderRadius: '8px',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: isRefreshing ? 0.6 : 1
          }}
        >
          <FiRefreshCw 
            size={16} 
            style={{ 
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none' 
            }} 
          />
          {isRefreshing ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {/* Agent Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {agents.map((agent, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              background: agent.status === 'healthy' ? 'rgba(34, 197, 94, 0.05)' : 
                         agent.status === 'unhealthy' ? 'rgba(239, 68, 68, 0.05)' : 
                         'rgba(245, 158, 11, 0.05)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  color: getStatusColor(agent.status)
                }}>
                  {agent.icon}
                </div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  margin: 0
                }}>
                  {agent.name}
                </h4>
              </div>
              {getStatusIcon(agent.status)}
            </div>
            
            <p style={{
              fontSize: '0.875rem',
              color: '#718096',
              margin: '0 0 0.5rem 0',
              lineHeight: '1.4'
            }}>
              {agent.description}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: '0.75rem',
                color: '#a0aec0',
                fontWeight: 500
              }}>
                {agent.message}
              </span>
              {agent.lastChecked && (
                <span style={{
                  fontSize: '0.75rem',
                  color: '#a0aec0'
                }}>
                  {agent.lastChecked.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Working Conditions Summary */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#1a202c',
          margin: '0 0 0.75rem 0'
        }}>
          Working Conditions
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCheckCircle size={14} color="#22c55e" />
            <span>Python FastAPI server running on port 8000</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCheckCircle size={14} color="#22c55e" />
            <span>All agent endpoints available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCheckCircle size={14} color="#22c55e" />
            <span>File upload support (CSV/JSON)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCheckCircle size={14} color="#22c55e" />
            <span>Real-time status monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}