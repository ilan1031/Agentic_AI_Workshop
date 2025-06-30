import { api } from './api';
import { Invoice, InvoiceQueryParams } from '../types';

export const invoiceService = {
  // Get all invoices with optional filters
  getInvoices: async (params?: InvoiceQueryParams): Promise<Invoice[]> => {
    return api.get<Invoice[]>('/invoices', params);
  },

  // Get a single invoice by ID
  getInvoiceById: async (id: string): Promise<Invoice> => {
    return api.get<Invoice>(`/invoices/${id}`);
  },

  // Create a new invoice
  createInvoice: async (invoice: Omit<Invoice, '_id' | 'created_at' | 'updated_at'>): Promise<Invoice> => {
    return api.post<Invoice>('/invoices', invoice);
  },

  // Update an existing invoice
  updateInvoice: async (id: string, invoice: Partial<Invoice>): Promise<Invoice> => {
    return api.put<Invoice>(`/invoices/${id}`, invoice);
  },

  // Delete an invoice
  deleteInvoice: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/invoices/${id}`);
  },

  // Get invoice statistics for dashboard
  getInvoiceStats: async (): Promise<{
    total: number;
    byStatus: Record<string, number>;
    recentInvoices: Invoice[];
  }> => {
    const invoices = await api.get<Invoice[]>('/invoices');
    
    const byStatus = invoices.reduce((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentInvoices = invoices
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      total: invoices.length,
      byStatus,
      recentInvoices,
    };
  },
};