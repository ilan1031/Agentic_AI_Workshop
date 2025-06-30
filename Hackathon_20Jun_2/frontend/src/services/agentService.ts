import { api } from './api';
import { FileUploadProgress } from '../types';

export interface AgentHealth {
  status: string;
  agents: Record<string, string>;
  workflow: string;
}

export interface AgentResult {
  transactions?: any[];
  matched_results?: any[];
  categorized_results?: any[];
  discrepancy_results?: any[];
  report?: any;
  message?: string;
}

export const agentService = {
  // Check agent health
  checkHealth: async (): Promise<AgentHealth> => {
    return api.get<AgentHealth>('/agents/health');
  },

  // Extract transactions using Transaction Extractor agent
  extractTransactions: async (
    file: File, 
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<AgentResult> => {
    return api.upload<AgentResult>(
      '/agents/extract', 
      file, 
      (progress) => {
        if (onProgress) {
          onProgress({
            progress,
            status: progress === 100 ? 'completed' : 'uploading',
            message: progress === 100 ? 'Transactions extracted' : 'Extracting transactions...'
          });
        }
      }
    );
  },

  // Match invoices using Invoice Matcher agent
  matchInvoices: async (transactions: any[]): Promise<AgentResult> => {
    return api.post<AgentResult>('/agents/match', { transactions });
  },

  // Categorize transactions using Categorizer agent
  categorizeTransactions: async (transactions: any[]): Promise<AgentResult> => {
    return api.post<AgentResult>('/agents/categorize', { transactions });
  },

  // Detect discrepancies using Discrepancy Detector agent
  detectDiscrepancies: async (transactions: any[]): Promise<AgentResult> => {
    return api.post<AgentResult>('/agents/detect-discrepancies', { transactions });
  },

  // Reconcile transactions using Reconciliation Approver agent
  reconcileTransactions: async (transactions: any[]): Promise<AgentResult> => {
    return api.post<AgentResult>('/agents/reconcile', { transactions });
  },

  // Run full reconciliation workflow
  runFullReconciliation: async (
    file: File, 
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<AgentResult> => {
    return api.upload<AgentResult>(
      '/agents/full-reconciliation', 
      file, 
      (progress) => {
        if (onProgress) {
          onProgress({
            progress,
            status: progress === 100 ? 'completed' : 'uploading',
            message: progress === 100 ? 'Full reconciliation completed' : 'Running full reconciliation...'
          });
        }
      }
    );
  },

  // Get agent status for monitoring
  getAgentStatus: async (): Promise<{
    healthy: boolean;
    agents: Record<string, { status: 'healthy' | 'unhealthy'; message: string }>;
  }> => {
    try {
      const health = await api.get<AgentHealth>('/agents/health');
      return {
        healthy: health.status === 'healthy',
        agents: Object.entries(health.agents).reduce((acc, [name, status]) => {
          acc[name] = {
            status: status === 'available' ? 'healthy' : 'unhealthy',
            message: status === 'available' ? 'Agent responding' : 'Agent unavailable'
          };
          return acc;
        }, {} as Record<string, { status: 'healthy' | 'unhealthy'; message: string }>)
      };
    } catch (error) {
      return {
        healthy: false,
        agents: {
          'transaction_extractor': { status: 'unhealthy', message: 'Connection failed' },
          'invoice_matcher': { status: 'unhealthy', message: 'Connection failed' },
          'categorizer': { status: 'unhealthy', message: 'Connection failed' },
          'discrepancy_detector': { status: 'unhealthy', message: 'Connection failed' },
          'reconciliation_approver': { status: 'unhealthy', message: 'Connection failed' },
        },
      };
    }
  },
}; 