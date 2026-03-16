const Animal = require('../models/Animal');
const QRCode = require('qrcode');

const generateQR = async (animalId) => {
  try {
    const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/animals/${animalId}`;
    return await QRCode.toDataURL(url);
  } catch { return ''; }
};

// @GET /api/animals
const getAnimals = async (req, res, next) => {
  try {
    const { search, healthStatus, breed, page = 1, limit = 20 } = req.query;
    const query = { owner: req.user._id };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { animalId: { $regex: search, $options: 'i' } }, { breed: { $regex: search, $options: 'i' } }];
    if (healthStatus) query.healthStatus = healthStatus;
    if (breed) query.breed = { $regex: breed, $options: 'i' };
    const total = await Animal.countDocuments(query);
    const animals = await Animal.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, animals, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @POST /api/animals
const createAnimal = async (req, res, next) => {
  try {
    const animal = new Animal({ ...req.body, owner: req.user._id });
    animal.qrCode = await generateQR(animal._id);
    await animal.save();
    res.status(201).json({ success: true, animal });
  } catch (err) { next(err); }
};

// @GET /api/animals/:id
const getAnimalById = async (req, res, next) => {
  try {
    const animal = await Animal.findOne({ _id: req.params.id, owner: req.user._id });
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    res.json({ success: true, animal });
  } catch (err) { next(err); }
};

// @PUT /api/animals/:id
const updateAnimal = async (req, res, next) => {
  try {
    const animal = await Animal.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    res.json({ success: true, animal });
  } catch (err) { next(err); }
};

// @DELETE /api/animals/:id
const deleteAnimal = async (req, res, next) => {
  try {
    const animal = await Animal.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    res.json({ success: true, message: 'Animal deleted' });
  } catch (err) { next(err); }
};

// @POST /api/animals/:id/photo
const uploadAnimalPhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const photoUrl = `/uploads/${req.file.filename}`;
    const animal = await Animal.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, { photoUrl }, { new: true });
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    res.json({ success: true, photoUrl, animal });
  } catch (err) { next(err); }
};

module.exports = { getAnimals, createAnimal, getAnimalById, updateAnimal, deleteAnimal, uploadAnimalPhoto };
