const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transaction_id: { type: String, unique: true, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  party: { type: String, required: true },
  reference: String,
  category: String,
  status: { 
    type: String, 
    enum: ['pending', 'matched', 'unmatched', 'flagged', 'reconciled'], 
    default: 'pending' 
  },
  matched_invoice_id: String,
  flags: [String],
  justification: String,
  reconciled: { type: Boolean, default: false },
  agent_steps: [{
    step: String,
    timestamp: Date,
    observation: String
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);