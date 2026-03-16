const mongoose = require('mongoose');

const FeedInventorySchema = new mongoose.Schema({
  feedName: { type: String, required: true },
  category: { type: String, enum: ['hay', 'grain', 'silage', 'concentrate', 'mineral', 'other'], default: 'other' },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, enum: ['kg', 'ton', 'liter', 'bag'], default: 'kg' },
  costPerUnit: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  supplier: { type: String },
  purchaseDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  dailyConsumption: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

FeedInventorySchema.pre('save', function (next) {
  this.totalCost = this.quantity * this.costPerUnit;
  next();
});

module.exports = mongoose.model('FeedInventory', FeedInventorySchema);
