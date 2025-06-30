import { api } from './api';
import { AgentStatus } from '../types';

export const agentStatusService = {
  // Get status of all agents (this would need to be implemented in the backend)
  getAgentStatus: async (): Promise<AgentStatus[]> => {
    // For now, we'll return a mock status since the backend doesn't have this endpoint yet
    // In a real implementation, this would call the backend to get agent status
    return [
      {
        name: 'Transaction Extractor',
        status: 'idle',
        progress: 0,
        message: 'Ready to process files',
        lastUpdated: new Date().toISOString(),
      },
      {
        name: 'Invoice Matcher',
        status: 'idle',
        progress: 0,
        message: 'Ready to match transactions',
        lastUpdated: new Date().toISOString(),
      },
      {
        name: 'Categorizer',
        status: 'idle',
        progress: 0,
        message: 'Ready to categorize transactions',
        lastUpdated: new Date().toISOString(),
      },
      {
        name: 'Discrepancy Detector',
        status: 'idle',
        progress: 0,
        message: 'Ready to detect discrepancies',
        lastUpdated: new Date().toISOString(),
      },
      {
        name: 'Reconciliation Approver',
        status: 'idle',
        progress: 0,
        message: 'Ready to approve reconciliations',
        lastUpdated: new Date().toISOString(),
      },
    ];
  },

  // Get agent activity from transaction agent steps
  getAgentActivity: async (): Promise<{
    recentSteps: Array<{
      agent: string;
      step: string;
      timestamp: string;
      observation: string;
      transactionId: string;
    }>;
    agentStats: Record<string, { totalSteps: number; lastActivity: string }>;
  }> => {
    // This would typically call the backend to get agent activity
    // For now, we'll return mock data
    return {
      recentSteps: [
        {
          agent: 'Transaction Extractor',
          step: 'Extraction',
          timestamp: new Date().toISOString(),
          observation: 'Successfully extracted 150 transactions from CSV file',
          transactionId: 'tx_001',
        },
        {
          agent: 'Invoice Matcher',
          step: 'Matching',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          observation: 'Matched 45 transactions with existing invoices',
          transactionId: 'tx_002',
        },
        {
          agent: 'Discrepancy Detector',
          step: 'Detection',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          observation: 'Flagged 3 transactions for manual review',
          transactionId: 'tx_003',
        },
      ],
      agentStats: {
        'Transaction Extractor': {
          totalSteps: 25,
          lastActivity: new Date().toISOString(),
        },
        'Invoice Matcher': {
          totalSteps: 18,
          lastActivity: new Date(Date.now() - 60000).toISOString(),
        },
        'Categorizer': {
          totalSteps: 12,
          lastActivity: new Date(Date.now() - 300000).toISOString(),
        },
        'Discrepancy Detector': {
          totalSteps: 8,
          lastActivity: new Date(Date.now() - 120000).toISOString(),
        },
        'Reconciliation Approver': {
          totalSteps: 5,
          lastActivity: new Date(Date.now() - 600000).toISOString(),
        },
      },
    };
  },

  // Get agent performance metrics
  getAgentPerformance: async (): Promise<{
    processingTime: Record<string, number>;
    successRate: Record<string, number>;
    errorRate: Record<string, number>;
  }> => {
    // Mock performance data
    return {
      processingTime: {
        'Transaction Extractor': 2.5,
        'Invoice Matcher': 1.8,
        'Categorizer': 1.2,
        'Discrepancy Detector': 0.8,
        'Reconciliation Approver': 1.5,
      },
      successRate: {
        'Transaction Extractor': 98.5,
        'Invoice Matcher': 92.3,
        'Categorizer': 95.7,
        'Discrepancy Detector': 89.2,
        'Reconciliation Approver': 96.8,
      },
      errorRate: {
        'Transaction Extractor': 1.5,
        'Invoice Matcher': 7.7,
        'Categorizer': 4.3,
        'Discrepancy Detector': 10.8,
        'Reconciliation Approver': 3.2,
      },
    };
  },

  // Check if agents are healthy and responsive
  checkAgentHealth: async (): Promise<{
    healthy: boolean;
    agents: Record<string, { status: 'healthy' | 'unhealthy'; message: string }>;
  }> => {
    try {
      // In a real implementation, this would ping the Python FastAPI server
      // For now, we'll assume the agents are healthy
      return {
        healthy: true,
        agents: {
          'Transaction Extractor': { status: 'healthy', message: 'Agent responding' },
          'Invoice Matcher': { status: 'healthy', message: 'Agent responding' },
          'Categorizer': { status: 'healthy', message: 'Agent responding' },
          'Discrepancy Detector': { status: 'healthy', message: 'Agent responding' },
          'Reconciliation Approver': { status: 'healthy', message: 'Agent responding' },
        },
      };
    } catch (error) {
      return {
        healthy: false,
        agents: {
          'Transaction Extractor': { status: 'unhealthy', message: 'Connection failed' },
          'Invoice Matcher': { status: 'unhealthy', message: 'Connection failed' },
          'Categorizer': { status: 'unhealthy', message: 'Connection failed' },
          'Discrepancy Detector': { status: 'unhealthy', message: 'Connection failed' },
          'Reconciliation Approver': { status: 'unhealthy', message: 'Connection failed' },
        },
      };
    }
  },
};