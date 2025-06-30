const axios = require('axios');
const dotenv = require('dotenv');
const FormData = require('form-data');
const { Readable } = require('stream');

dotenv.config();

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://0.0.0.0:8000';

// Utility: Ensure each transaction has `_id`
function patchTransactions(transactions) {
  return transactions.map(tx => ({
    _id: tx._id || tx.transaction_id || undefined,
    ...tx
  }));
}

const agentService = {
  // Extract transactions from file
  extractTransactions: async (fileBuffer, fileType) => {
    try {
      const formData = new FormData();
      formData.append('file', Readable.from(fileBuffer), {
        filename: `transactions.${fileType}`,
        contentType: fileType === 'csv' ? 'text/csv' : 'application/json'
      });

      const response = await axios.post(`${FASTAPI_URL}/extract-transactions`, formData, {
        headers: formData.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Agent extraction error:', error?.response?.data || error.message);
      throw new Error('Failed to extract transactions');
    }
  },

  // Match invoices
  matchInvoices: async (transactions) => {
    try {
      const patched = patchTransactions(transactions);
      const response = await axios.post(`${FASTAPI_URL}/match-invoices`, {
        transactions: patched
      });
      return response.data;
    } catch (error) {
      console.error('Agent matching error:', error?.response?.data || error.message);
      throw new Error('Failed to match invoices');
    }
  },

  // Categorize
  categorizeTransactions: async (transactions) => {
    try {
      const patched = patchTransactions(transactions);
      const response = await axios.post(`${FASTAPI_URL}/categorize`, {
        transactions: patched
      });
      return response.data;
    } catch (error) {
      console.error('Agent categorization error:', error?.response?.data || error.message);
      throw new Error('Failed to categorize transactions');
    }
  },

  // Discrepancy detection
  detectDiscrepancies: async (transactions) => {
    try {
      const patched = patchTransactions(transactions);
      const response = await axios.post(`${FASTAPI_URL}/detect-discrepancies`, {
        transactions: patched
      });
      return response.data;
    } catch (error) {
      console.error('Agent discrepancy detection error:', error?.response?.data || error.message);
      throw new Error('Failed to detect discrepancies');
    }
  },

  // Final Reconciliation
  reconcileTransactions: async (transactions) => {
    try {
      const patched = patchTransactions(transactions);
      const response = await axios.post(`${FASTAPI_URL}/reconcile`, {
        transactions: patched
      });
      return response.data;
    } catch (error) {
      console.error('Agent reconciliation error:', error?.response?.data || error.message);
      throw new Error('Failed to reconcile transactions');
    }
  },

  // Full Workflow
  fullReconciliation: async (fileBuffer, fileType) => {
    try {
      const formData = new FormData();
      formData.append('file', Readable.from(fileBuffer), {
        filename: `reconciliation.${fileType}`,
        contentType: fileType === 'csv' ? 'text/csv' : 'application/json'
      });

      const response = await axios.post(`${FASTAPI_URL}/full-reconciliation`, formData, {
        headers: formData.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Full reconciliation error:', error?.response?.data || error.message);
      throw new Error('Full reconciliation failed');
    }
  },

  // Agent health check
  checkAgentHealth: async () => {
    try {
      const response = await axios.get(`${FASTAPI_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Agent health check error:', error?.response?.data || error.message);
      throw new Error('Agent health check failed');
    }
  }
};

module.exports = agentService;