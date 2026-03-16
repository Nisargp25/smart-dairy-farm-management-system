const mongoose = require('mongoose');

const MilkProductionSchema = new mongoose.Schema({
  animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  date: { type: Date, required: true, default: Date.now },
  morningAmount: { type: Number, required: true, default: 0 },
  eveningAmount: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

MilkProductionSchema.pre('save', function (next) {
  this.totalAmount = this.morningAmount + this.eveningAmount;
  next();
});

module.exports = mongoose.model('MilkProduction', MilkProductionSchema);
