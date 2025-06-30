exports.validateInvoice = (req, res, next) => {
    const { customer_name, total, date } = req.body;
    if (!customer_name || !total || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    next();
  };
  
  exports.validateTransaction = (req, res, next) => {
    const { amount, party, date } = req.body;
    if (!amount || !party || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    next();
  };