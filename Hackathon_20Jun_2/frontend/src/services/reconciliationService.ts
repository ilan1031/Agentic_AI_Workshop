import { api } from './api';
import { 
  ReconciliationStatus, 
  ReconciliationReport, 
  FlagDiscrepancyRequest, 
  ApproveTransactionRequest, 
  ExportReportRequest, 
  ExportReportResponse,
  ReconciliationQueryParams,
  FileUploadProgress 
} from '../types';

export const reconciliationService = {
  // Get reconciliation status and summary
  getReconciliationStatus: async (params?: ReconciliationQueryParams): Promise<ReconciliationStatus> => {
    return api.get<ReconciliationStatus>('/reconciliation/status', params);
  },

  // Run full reconciliation with file upload (integrates with Python agents)
  runFullReconciliation: async (
    file: File, 
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<ReconciliationReport> => {
    return api.upload<ReconciliationReport>(
      '/reconciliation/run', 
      file, 
      (progress) => {
        if (onProgress) {
          onProgress({
            progress,
            status: progress === 100 ? 'completed' : 'uploading',
            message: progress === 100 ? 'Reconciliation completed' : 'Processing file...'
          });
        }
      }
    );
  },

  // Flag a discrepancy in a transaction
  flagDiscrepancy: async (request: FlagDiscrepancyRequest): Promise<any> => {
    return api.post('/reconciliation/flag', request);
  },

  // Approve a transaction
  approveTransaction: async (request: ApproveTransactionRequest): Promise<any> => {
    return api.post('/reconciliation/approve', request);
  },

  // Export reconciliation report
  exportReport: async (request: ExportReportRequest): Promise<ExportReportResponse> => {
    return api.post<ExportReportResponse>('/reconciliation/export', request);
  },

  // Get reconciliation statistics for dashboard
  getReconciliationStats: async (): Promise<{
    summary: {
      total: number;
      matched: number;
      unmatched: number;
      flagged: number;
      reconciled: number;
    };
    recentActivity: any[];
  }> => {
    const status = await api.get<ReconciliationStatus>('/reconciliation/status', { days: 30 });
    
    // Get recent agent activity from transactions
    const recentActivity = status.transactions
      .flatMap(tx => tx.agent_steps)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      summary: status.summary,
      recentActivity,
    };
  },

  // Get transactions that need attention (flagged or unmatched)
  getTransactionsNeedingAttention: async (): Promise<any[]> => {
    const status = await api.get<ReconciliationStatus>('/reconciliation/status');
    return status.transactions.filter(tx => 
      tx.status === 'flagged' || tx.status === 'unmatched'
    );
  },

  // Get reconciliation progress for a specific time period
  getReconciliationProgress: async (days: number = 7): Promise<{
    dailyProgress: Array<{
      date: string;
      total: number;
      matched: number;
      flagged: number;
    }>;
  }> => {
    const status = await api.get<ReconciliationStatus>('/reconciliation/status', { days });
    
    // Group transactions by date
    const dailyProgress = status.transactions.reduce((acc, tx) => {
      const date = new Date(tx.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, total: 0, matched: 0, flagged: 0 };
      }
      acc[date].total++;
      if (tx.status === 'matched') acc[date].matched++;
      if (tx.status === 'flagged') acc[date].flagged++;
      return acc;
    }, {} as Record<string, any>);

    return {
      dailyProgress: Object.values(dailyProgress).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    };
  },
};