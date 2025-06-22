const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  item_id: String,
  name: String,
  description: String,
  quantity: Number,
  rate: Number,
  item_total: Number,
  tax_percentage: Number,
  // Other fields as needed
});

const addressSchema = new mongoose.Schema({
  street: String,
  address: String,
  street2: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  phone: String,
  attention: String
});

const invoiceSchema = new mongoose.Schema({
  invoice_id: { type: String, unique: true, required: true },
  invoice_number: { type: String, required: true },
  date: { type: Date, required: true },
  due_date: Date,
  customer_id: String,
  customer_name: { type: String, required: true },
  tax_type: String,
  status: { type: String, required: true },
  payment_terms: String,
  reference_number: String,
  line_items: [lineItemSchema],
  sub_total: Number,
  tax_total: Number,
  discount_total: Number,
  total: { type: Number, required: true },
  balance: Number,
  billing_address: addressSchema,
  shipping_address: addressSchema,
  documents: [String],
  gst_treatment: String,
  gst_no: String,
  place_of_supply: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);