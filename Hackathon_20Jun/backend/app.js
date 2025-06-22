const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/invoiceRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reconciliationRoutes = require('./routes/reconciliationRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reconciliation', reconciliationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;