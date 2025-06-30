const express = require('express');
const router = express.Router();
const multer = require('multer');
const agentService = require('../services/agentService');

const upload = multer();

// Health check for agents
router.get('/health', async (req, res) => {
  try {
    const health = await agentService.checkAgentHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Extract transactions using Transaction Extractor agent
router.post('/extract', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileType = req.file.mimetype.includes('csv') ? 'csv' : 'json';
    const result = await agentService.extractTransactions(req.file.buffer, fileType);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Match invoices using Invoice Matcher agent
router.post('/match', async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ message: 'Transactions array is required' });
    }
    
    const result = await agentService.matchInvoices(transactions);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Categorize transactions using Categorizer agent
router.post('/categorize', async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ message: 'Transactions array is required' });
    }
    
    const result = await agentService.categorizeTransactions(transactions);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Detect discrepancies using Discrepancy Detector agent
router.post('/detect-discrepancies', async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ message: 'Transactions array is required' });
    }
    
    const result = await agentService.detectDiscrepancies(transactions);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reconcile transactions using Reconciliation Approver agent
router.post('/reconcile', async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ message: 'Transactions array is required' });
    }
    
    const result = await agentService.reconcileTransactions(transactions);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Run full reconciliation workflow
router.post('/full-reconciliation', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileType = req.file.mimetype.includes('csv') ? 'csv' : 'json';
    const result = await agentService.fullReconciliation(req.file.buffer, fileType);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 