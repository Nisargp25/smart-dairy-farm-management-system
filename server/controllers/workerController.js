const Worker = require('../models/Worker');

// @GET /api/workers
const getWorkers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { owner: req.user._id };
    if (status) query.status = status;
    const workers = await Worker.find(query).sort({ name: 1 });
    const totalSalary = workers.filter(w => w.status === 'active').reduce((sum, w) => sum + (w.salary || 0), 0);
    res.json({ success: true, workers, totalSalary });
  } catch (err) { next(err); }
};

// @POST /api/workers
const createWorker = async (req, res, next) => {
  try {
    const worker = await Worker.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, worker });
  } catch (err) { next(err); }
};

// @PUT /api/workers/:id
const updateWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, worker });
  } catch (err) { next(err); }
};

// @DELETE /api/workers/:id
const deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, message: 'Worker deleted' });
  } catch (err) { next(err); }
};

module.exports = { getWorkers, createWorker, updateWorker, deleteWorker };
