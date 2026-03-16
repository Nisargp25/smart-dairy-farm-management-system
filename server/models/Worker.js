const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  salary: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now },
  address: { type: String },
  idNumber: { type: String },
  emergencyContact: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  notes: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Worker', WorkerSchema);
