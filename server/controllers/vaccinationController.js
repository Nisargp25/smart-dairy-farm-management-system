const Vaccination = require('../models/Vaccination');
const { sendSMS } = require('../utils/sms');

// @GET /api/vaccinations
const getVaccinations = async (req, res, next) => {
  try {
    const { animalId, page = 1, limit = 20 } = req.query;
    const query = { owner: req.user._id };
    if (animalId) query.animal = animalId;
    const total = await Vaccination.countDocuments(query);
    const vaccinations = await Vaccination.find(query).populate('animal', 'name animalId').sort({ date: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, vaccinations, total });
  } catch (err) { next(err); }
};

// @POST /api/vaccinations
const createVaccination = async (req, res, next) => {
  try {
    const vaccination = await Vaccination.create({ ...req.body, owner: req.user._id });
    await vaccination.populate('animal', 'name animalId');

    // Send SMS notification
    if (req.user.phone) {
      sendSMS(req.user.phone, `Animal ${vaccination.animal.name} (${vaccination.animal.animalId}) vaccinated with ${vaccination.vaccineName}. Next due: ${vaccination.nextDueDate ? new Date(vaccination.nextDueDate).toLocaleDateString() : 'N/A'}`);
    }

    res.status(201).json({ success: true, vaccination });
  } catch (err) { next(err); }
};

// @PUT /api/vaccinations/:id
const updateVaccination = async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
    if (!vaccination) return res.status(404).json({ success: false, message: 'Vaccination not found' });
    res.json({ success: true, vaccination });
  } catch (err) { next(err); }
};

// @DELETE /api/vaccinations/:id
const deleteVaccination = async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!vaccination) return res.status(404).json({ success: false, message: 'Vaccination not found' });
    res.json({ success: true, message: 'Vaccination deleted' });
  } catch (err) { next(err); }
};

// @GET /api/vaccinations/upcoming
const getUpcomingVaccinations = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Number(days));
    const upcoming = await Vaccination.find({
      owner: req.user._id,
      nextDueDate: { $gte: new Date(), $lte: futureDate }
    }).populate('animal', 'name animalId').sort({ nextDueDate: 1 }).limit(10);
    res.json({ success: true, upcoming });
  } catch (err) { next(err); }
};

module.exports = { getVaccinations, createVaccination, updateVaccination, deleteVaccination, getUpcomingVaccinations };
