const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  vaccineName: { type: String, required: true },
  date: { type: Date, required: true },
  nextDueDate: { type: Date },
  administeredBy: { type: String },
  dosage: { type: String },
  notes: { type: String, default: '' },
  reminderSent: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Vaccination', VaccinationSchema);
