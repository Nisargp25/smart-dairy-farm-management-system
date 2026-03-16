const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['milk-sale', 'animal-sale', 'manure-sale', 'government-subsidy', 'other'], 
    required: true 
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, required: true },
  quantity: { type: Number },
  unit: { type: String },
  pricePerUnit: { type: Number },
  buyer: { type: String },
  paymentMethod: { type: String, enum: ['cash', 'bank', 'upi', 'cheque'], default: 'cash' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Income', IncomeSchema);
