const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  unit: { type: String, required: true }, // e.g., Litre, kg, Packet
  category: { type: String, enum: ['milk', 'ghee', 'paneer', 'curd', 'other'], default: 'milk' },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String },
  isAvailable: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
