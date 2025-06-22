const Invoice = require('../models/Invoice');

const invoiceController = {
  createInvoice: async (req, res) => {
    try {
      const newInvoice = new Invoice(req.body);
      await newInvoice.save();
      res.status(201).json(newInvoice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getInvoices: async (req, res) => {
    try {
      const { customerName, status, dateFrom, dateTo } = req.query;
      const query = {};
      
      if (customerName) query.customer_name = customerName;
      if (status) query.status = status;
      if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
      }
      
      const invoices = await Invoice.find(query).sort({ date: -1 });
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getInvoiceById: async (req, res) => {
    try {
      const invoice = await Invoice.findById(req.params.id);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateInvoice: async (req, res) => {
    try {
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedInvoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(updatedInvoice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteInvoice: async (req, res) => {
    try {
      const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
      if (!deletedInvoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json({ message: 'Invoice deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = invoiceController;