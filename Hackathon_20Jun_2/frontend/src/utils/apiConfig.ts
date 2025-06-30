// API Configuration for the application
export const apiConfig = {
  // Backend API configuration
  backend: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 30000, // 30 seconds
    endpoints: {
      invoices: '/invoices',
      transactions: '/transactions',
      reconciliation: '/reconciliation',
      health: '/health',
    },
  },

  // Python Agents API configuration
  agents: {
    baseURL: process.env.NEXT_PUBLIC_AGENT_API_URL || 'http://localhost:8000',
    timeout: 60000, // 60 seconds for agent processing
    endpoints: {
      extractTransactions: '/extract-transactions',
      matchInvoices: '/match-invoices',
      categorize: '/categorize',
      detectDiscrepancies: '/detect-discrepancies',
      reconcile: '/reconcile',
      fullReconciliation: '/full-reconciliation',
    },
  },

  // File upload configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['text/csv', 'application/json'],
    allowedExtensions: ['.csv', '.json'],
  },

  // Pagination configuration
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // Polling configuration for long-running operations
  polling: {
    interval: 5000, // 5 seconds
    maxAttempts: 60, // 5 minutes max
  },

  // Error handling configuration
  errorHandling: {
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
};

// Helper functions for API configuration
export const getApiUrl = (endpoint: string): string => {
  return `${apiConfig.backend.baseURL}${endpoint}`;
};

export const getAgentUrl = (endpoint: string): string => {
  return `${apiConfig.agents.baseURL}${endpoint}`;
};

export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > apiConfig.upload.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${apiConfig.upload.maxFileSize / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!apiConfig.upload.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not supported. Please upload CSV or JSON files.`,
    };
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !apiConfig.upload.allowedExtensions.includes(`.${extension}`)) {
    return {
      valid: false,
      error: `File extension not supported. Please upload .csv or .json files.`,
    };
  }

  return { valid: true };
};

// Environment configuration
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Feature flags
export const featureFlags = {
  enableAgentMonitoring: true,
  enableRealTimeUpdates: isDevelopment,
  enableDetailedLogging: isDevelopment,
  enablePerformanceMetrics: true,
};