const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['feed', 'medicine', 'salary', 'equipment', 'maintenance', 'utilities', 'veterinary', 'other'], 
    required: true 
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cash', 'bank', 'upi', 'cheque'], default: 'cash' },
  receiptUrl: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
