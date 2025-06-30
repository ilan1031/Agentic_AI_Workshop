import { api } from './api';
import { 
  Transaction, 
  TransactionQueryParams, 
  TransactionUploadResponse, 
  MatchTransactionsRequest, 
  MatchTransactionsResponse,
  FileUploadProgress 
} from '../types';

export const transactionService = {
  // Get all transactions with optional filters
  getTransactions: async (params?: TransactionQueryParams): Promise<Transaction[]> => {
    return api.get<Transaction[]>('/transactions', params);
  },

  // Upload bank feed file (integrates with Python Transaction Extractor agent)
  uploadBankFeed: async (
    file: File, 
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<TransactionUploadResponse> => {
    return api.upload<TransactionUploadResponse>(
      '/transactions/upload', 
      file, 
      (progress) => {
        if (onProgress) {
          onProgress({
            progress,
            status: progress === 100 ? 'completed' : 'uploading',
            message: progress === 100 ? 'File processed successfully' : 'Processing file...'
          });
        }
      }
    );
  },

  // Match transactions with invoices (integrates with Python Invoice Matcher agent)
  matchTransactions: async (request: MatchTransactionsRequest): Promise<MatchTransactionsResponse> => {
    return api.post<MatchTransactionsResponse>('/transactions/match', request);
  },

  // Get transaction statistics for dashboard
  getTransactionStats: async (): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    recentTransactions: Transaction[];
  }> => {
    const transactions = await api.get<Transaction[]>('/transactions');
    
    const byStatus = transactions.reduce((acc, tx) => {
      acc[tx.status] = (acc[tx.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = transactions.reduce((acc, tx) => {
      if (tx.category) {
        acc[tx.category] = (acc[tx.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    return {
      total: transactions.length,
      byStatus,
      byCategory,
      recentTransactions,
    };
  },

  // Get transactions that need attention
  getTransactionsNeedingAttention: async (): Promise<Transaction[]> => {
    const transactions = await api.get<Transaction[]>('/transactions');
    return transactions.filter(tx => 
      tx.status === 'flagged' || tx.status === 'unmatched'
    );
  },

  // Get transaction processing history (agent steps)
  getTransactionHistory: async (transactionId: string): Promise<{
    transaction: Transaction;
    agentSteps: Array<{
      step: string;
      timestamp: string;
      observation: string;
    }>;
  }> => {
    const transactions = await api.get<Transaction[]>('/transactions');
    const transaction = transactions.find(tx => tx._id === transactionId);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return {
      transaction,
      agentSteps: transaction.agent_steps.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    };
  },

  // Get transaction processing timeline
  getTransactionTimeline: async (): Promise<Array<{
    date: string;
    transactions: Transaction[];
    agentActivity: Array<{
      agent: string;
      action: string;
      count: number;
    }>;
  }>> => {
    const transactions = await api.get<Transaction[]>('/transactions');
    
    // Group by date
    const timeline = transactions.reduce((acc, tx) => {
      const date = new Date(tx.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, transactions: [], agentActivity: [] };
      }
      acc[date].transactions.push(tx);
      return acc;
    }, {} as Record<string, any>);

    // Add agent activity for each date
    Object.values(timeline).forEach((day: any) => {
      const agentSteps = day.transactions.flatMap((tx: Transaction) => tx.agent_steps);
      const agentActivity = agentSteps.reduce((acc: any, step: any) => {
        const agent = step.step.split(' ')[0]; // Extract agent name from step
        const existing = acc.find((a: any) => a.agent === agent);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ agent, action: step.step, count: 1 });
        }
        return acc;
      }, []);
      day.agentActivity = agentActivity;
    });

    return Object.values(timeline).sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  // Get transaction processing metrics
  getTransactionMetrics: async (): Promise<{
    processingTime: {
      average: number;
      min: number;
      max: number;
    };
    successRate: number;
    agentEfficiency: Record<string, number>;
  }> => {
    const transactions = await api.get<Transaction[]>('/transactions');
    
    // Calculate processing time based on agent steps
    const processingTimes = transactions.map(tx => {
      if (tx.agent_steps.length < 2) return 0;
      const firstStep = new Date(tx.agent_steps[0].timestamp);
      const lastStep = new Date(tx.agent_steps[tx.agent_steps.length - 1].timestamp);
      return (lastStep.getTime() - firstStep.getTime()) / 1000; // in seconds
    }).filter(time => time > 0);

    const average = processingTimes.length > 0 
      ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
      : 0;

    // Calculate success rate
    const successRate = transactions.length > 0 
      ? (transactions.filter(tx => tx.status === 'matched' || tx.status === 'reconciled').length / transactions.length) * 100
      : 0;

    // Calculate agent efficiency
    const agentEfficiency = transactions.reduce((acc, tx) => {
      tx.agent_steps.forEach(step => {
        const agent = step.step.split(' ')[0];
        acc[agent] = (acc[agent] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      processingTime: {
        average,
        min: processingTimes.length > 0 ? Math.min(...processingTimes) : 0,
        max: processingTimes.length > 0 ? Math.max(...processingTimes) : 0,
      },
      successRate,
      agentEfficiency,
    };
  },
}; 