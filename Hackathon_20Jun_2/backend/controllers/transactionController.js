const Transaction = require('../models/Transaction');
const fileProcessor = require('../services/fileProcessor');
const agentService = require('../services/agentService');

const transactionController = {
  uploadBankFeed: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const fileBuffer = req.file.buffer;
      const fileType = req.file.mimetype.includes('csv') ? 'csv' : 'json';
      
      // Process file based on type
      let transactions;
      if (fileType === 'csv') {
        transactions = await fileProcessor.processCSV(fileBuffer);
      } else if (fileType === 'json') {
        transactions = await fileProcessor.processJSON(fileBuffer);
      } else {
        return res.status(400).json({ message: 'Unsupported file type' });
      }
      
      // Add initial agent step
      const processedTransactions = transactions.map(tx => ({
        ...tx,
        agent_steps: [{
          step: 'Uploaded',
          timestamp: new Date(),
          observation: 'Bank feed uploaded successfully'
        }]
      }));
      
      // Save to database
      const savedTransactions = await Transaction.insertMany(processedTransactions);
      
      // Send to Python agent for extraction
      const extractionResult = await agentService.extractTransactions(
        JSON.stringify(transactions), 
        fileType
      );
      
      // Update transactions with extraction results
      for (const [index, tx] of extractionResult.transactions.entries()) {
        const transaction = savedTransactions[index];
        transaction.agent_steps.push({
          step: 'Extraction',
          timestamp: new Date(),
          observation: 'Transaction data extracted'
        });
        await transaction.save();
      }
      
      res.status(201).json({
        message: 'File processed successfully',
        transactions: savedTransactions
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const { status, dateFrom, dateTo, party } = req.query;
      const query = {};
      
      if (status) query.status = status;
      if (party) query.party = new RegExp(party, 'i');
      if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
      }
      
      const transactions = await Transaction.find(query).sort({ date: -1 });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  matchTransactions: async (req, res) => {
    try {
      const { transactionIds } = req.body;
      const transactions = await Transaction.find({ _id: { $in: transactionIds } });
      
      // Send to Python agent for matching
      const matchingResult = await agentService.matchInvoices(transactions);
      
      // Update transactions with matching results
      for (const transaction of transactions) {
        const match = matchingResult.matched_results.find(m => 
          m.transaction_id === transaction.transaction_id
        );
        
        if (match) {
          transaction.matched_invoice_id = match.matched_invoice_id;
          transaction.status = match.status;
          transaction.justification = match.justification;
          
          transaction.agent_steps.push({
            step: 'Matching',
            timestamp: new Date(),
            observation: match.justification || `Matched with invoice ${match.matched_invoice_id}`
          });
          
          await transaction.save();
        }
      }
      
      res.json({ message: 'Matching completed', transactions });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = transactionController;