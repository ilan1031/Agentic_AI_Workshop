const Transaction = require('../models/Transaction');
const agentService = require('../services/agentService');

const reconciliationController = {
  getReconciliationStatus: async (req, res) => {
    try {
      const { days = 7 } = req.query;
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);
      
      const transactions = await Transaction.find({
        updated_at: { $gte: dateThreshold }
      }).sort({ updated_at: -1 });
      
      // Group by status for summary
      const summary = {
        total: transactions.length,
        matched: transactions.filter(t => t.status === 'matched').length,
        unmatched: transactions.filter(t => t.status === 'unmatched').length,
        flagged: transactions.filter(t => t.status === 'flagged').length,
        reconciled: transactions.filter(t => t.reconciled).length
      };
      
      res.json({ summary, transactions });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  runFullReconciliation: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const fileBuffer = req.file.buffer;
      const fileType = req.file.mimetype.includes('csv') ? 'csv' : 'json';
      
      // Process file
      let transactions;
      if (fileType === 'csv') {
        transactions = await fileProcessor.processCSV(fileBuffer);
      } else if (fileType === 'json') {
        transactions = await fileProcessor.processJSON(fileBuffer);
      } else {
        return res.status(400).json({ message: 'Unsupported file type' });
      }
      
      // Send to Python agent for full reconciliation
      const result = await agentService.fullReconciliation(
        JSON.stringify(transactions), 
        fileType
      );
      
      // Save results to database
      const savedTransactions = await Transaction.insertMany(
        result.transactions.map(tx => ({
          ...tx,
          agent_steps: tx.agent_steps || []
        }))
      );
      
      res.status(201).json({
        message: 'Full reconciliation completed',
        report: result.report,
        transactions: savedTransactions
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  flagDiscrepancy: async (req, res) => {
    try {
      const { transactionId, flag, reason } = req.body;
      const transaction = await Transaction.findById(transactionId);
      
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      if (!transaction.flags.includes(flag)) {
        transaction.flags.push(flag);
      }
      
      transaction.agent_steps.push({
        step: 'Manual Flag',
        timestamp: new Date(),
        observation: `${flag}: ${reason}`
      });
      
      await transaction.save();
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  approveTransaction: async (req, res) => {
    try {
      const { transactionId } = req.body;
      const transaction = await Transaction.findById(transactionId);
      
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      transaction.reconciled = true;
      transaction.agent_steps.push({
        step: 'Approval',
        timestamp: new Date(),
        observation: 'Manually approved by finance reviewer'
      });
      
      await transaction.save();
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  exportReport: async (req, res) => {
    try {
      const { transactionIds } = req.body;
      const transactions = await Transaction.find({ _id: { $in: transactionIds } });
      
      // Generate PDF (simplified for this example)
      const pdfData = {
        date: new Date().toISOString().split('T')[0],
        transactions: transactions.map(tx => ({
          id: tx.transaction_id,
          date: tx.date.toISOString().split('T')[0],
          amount: tx.amount,
          party: tx.party,
          status: tx.status,
          invoice: tx.matched_invoice_id
        })),
        summary: {
          total: transactions.length,
          matched: transactions.filter(t => t.status === 'matched').length,
          flagged: transactions.filter(t => t.flags.length > 0).length
        }
      };
      
      // In a real implementation, this would generate an actual PDF
      res.json({
        message: 'PDF report generated',
        pdfUrl: `/reports/${Date.now()}.pdf`,
        data: pdfData
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = reconciliationController;