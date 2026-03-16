const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  animalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female'], default: 'female' },
  weight: { type: Number },
  healthStatus: { type: String, enum: ['healthy', 'sick', 'recovering', 'pregnant'], default: 'healthy' },
  photoUrl: { type: String, default: '' },
  qrCode: { type: String, default: '' },
  purchaseDate: { type: Date },
  purchasePrice: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Animal', AnimalSchema);
