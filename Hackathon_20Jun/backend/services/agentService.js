const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const FASTAPI_URL = process.env.FASTAPI_URL;

const agentService = {
  extractTransactions: async (fileContent, fileType) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/extract-transactions`, {
        fileContent,
        fileType
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Agent extraction error:', error);
      throw new Error('Failed to extract transactions');
    }
  },

  matchInvoices: async (transactions) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/match-invoices`, {
        transactions
      });
      return response.data;
    } catch (error) {
      console.error('Agent matching error:', error);
      throw new Error('Failed to match invoices');
    }
  },

  categorizeTransactions: async (transactions) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/categorize`, {
        transactions
      });
      return response.data;
    } catch (error) {
      console.error('Agent categorization error:', error);
      throw new Error('Failed to categorize transactions');
    }
  },

  detectDiscrepancies: async (transactions) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/detect-discrepancies`, {
        transactions
      });
      return response.data;
    } catch (error) {
      console.error('Agent discrepancy detection error:', error);
      throw new Error('Failed to detect discrepancies');
    }
  },

  reconcileTransactions: async (transactions) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/reconcile`, {
        transactions
      });
      return response.data;
    } catch (error) {
      console.error('Agent reconciliation error:', error);
      throw new Error('Failed to reconcile transactions');
    }
  },

  fullReconciliation: async (fileContent, fileType) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/full-reconciliation`, {
        fileContent,
        fileType
      });
      return response.data;
    } catch (error) {
      console.error('Full reconciliation error:', error);
      throw new Error('Full reconciliation failed');
    }
  }
};

module.exports = agentService;