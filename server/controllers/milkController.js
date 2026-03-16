const MilkProduction = require('../models/MilkProduction');

// @GET /api/milk
const getMilkRecords = async (req, res, next) => {
  try {
    const { startDate, endDate, animalId, page = 1, limit = 30 } = req.query;
    const query = { owner: req.user._id };
    if (animalId) query.animal = animalId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const total = await MilkProduction.countDocuments(query);
    const records = await MilkProduction.find(query).populate('animal', 'name animalId').sort({ date: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, records, total });
  } catch (err) { next(err); }
};

// @POST /api/milk
const createMilkRecord = async (req, res, next) => {
  try {
    const record = await MilkProduction.create({ ...req.body, owner: req.user._id });
    await record.populate('animal', 'name animalId');
    res.status(201).json({ success: true, record });
  } catch (err) { next(err); }
};

// @PUT /api/milk/:id
const updateMilkRecord = async (req, res, next) => {
  try {
    const record = await MilkProduction.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, record });
  } catch (err) { next(err); }
};

// @DELETE /api/milk/:id
const deleteMilkRecord = async (req, res, next) => {
  try {
    const record = await MilkProduction.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) { next(err); }
};

// @GET /api/milk/stats
const getMilkStats = async (req, res, next) => {
  try {
    const { period = 'weekly' } = req.query;
    const now = new Date();
    let startDate;
    if (period === 'daily') startDate = new Date(now.setDate(now.getDate() - 7));
    else if (period === 'weekly') startDate = new Date(now.setDate(now.getDate() - 28));
    else startDate = new Date(now.setMonth(now.getMonth() - 12));

    const stats = await MilkProduction.aggregate([
      { $match: { owner: req.user._id, date: { $gte: startDate } } },
      {
        $group: {
          _id: period === 'monthly'
            ? { year: { $year: '$date' }, month: { $month: '$date' } }
            : { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } },
          totalMilk: { $sum: '$totalAmount' },
          morningTotal: { $sum: '$morningAmount' },
          eveningTotal: { $sum: '$eveningAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
    const todayTotal = await MilkProduction.aggregate([
      { $match: { owner: req.user._id, date: { $gte: todayStart, $lte: todayEnd } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({ success: true, stats, todayTotal: todayTotal[0]?.total || 0 });
  } catch (err) { next(err); }
};

module.exports = { getMilkRecords, createMilkRecord, updateMilkRecord, deleteMilkRecord, getMilkStats };
