// Base types
export interface BaseEntity {
  _id: string;
  created_at: string;
  updated_at: string;
}

// Address type
export interface Address {
  street?: string;
  address?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  attention?: string;
}

// Line item type
export interface LineItem {
  item_id?: string;
  name?: string;
  description?: string;
  quantity?: number;
  rate?: number;
  item_total?: number;
  tax_percentage?: number;
}

// Invoice types
export interface Invoice extends BaseEntity {
  invoice_id: string;
  invoice_number: string;
  date: string;
  due_date?: string;
  customer_id?: string;
  customer_name: string;
  tax_type?: string;
  status: string;
  payment_terms?: string;
  reference_number?: string;
  line_items: LineItem[];
  sub_total?: number;
  tax_total?: number;
  discount_total?: number;
  total: number;
  balance?: number;
  billing_address?: Address;
  shipping_address?: Address;
  documents?: string[];
  gst_treatment?: string;
  gst_no?: string;
  place_of_supply?: string;
}

// Agent step type
export interface AgentStep {
  step: string;
  timestamp: string;
  observation: string;
}

// Transaction types
export interface Transaction extends BaseEntity {
  transaction_id: string;
  date: string;
  amount: number;
  currency: string;
  party: string;
  reference?: string;
  category?: string;
  status: 'pending' | 'matched' | 'unmatched' | 'flagged' | 'reconciled';
  matched_invoice_id?: string;
  flags: string[];
  justification?: string;
  reconciled: boolean;
  agent_steps: AgentStep[];
}

// Reconciliation types
export interface ReconciliationSummary {
  total: number;
  matched: number;
  unmatched: number;
  flagged: number;
  reconciled: number;
}

export interface ReconciliationStatus {
  summary: ReconciliationSummary;
  transactions: Transaction[];
}

export interface ReconciliationReport {
  message: string;
  report: any;
  transactions: Transaction[];
}

export interface FlagDiscrepancyRequest {
  transactionId: string;
  flag: string;
  reason: string;
}

export interface ApproveTransactionRequest {
  transactionId: string;
}

export interface ExportReportRequest {
  transactionIds: string[];
}

export interface ExportReportResponse {
  message: string;
  pdfUrl: string;
  data: any;
}

// Transaction upload types
export interface TransactionUploadResponse {
  message: string;
  transactions: Transaction[];
}

export interface MatchTransactionsRequest {
  transactionIds: string[];
}

export interface MatchTransactionsResponse {
  message: string;
  transactions: Transaction[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Query parameter types
export interface InvoiceQueryParams {
  customerName?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TransactionQueryParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  party?: string;
}

export interface ReconciliationQueryParams {
  days?: number;
}

// File upload types
export interface FileUploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  message?: string;
}

// Agent status types
export interface AgentStatus {
  name: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress?: number;
  message?: string;
  lastUpdated: string;
}

// Dashboard types
export interface DashboardStats {
  totalInvoices: number;
  totalTransactions: number;
  pendingReconciliations: number;
  flaggedDiscrepancies: number;
  recentActivity: AgentStep[];
}