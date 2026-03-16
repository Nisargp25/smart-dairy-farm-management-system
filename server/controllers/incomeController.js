const Income = require('../models/Income');

// @GET /api/income
const getIncome = async (req, res, next) => {
  try {
    const { startDate, endDate, category, page = 1, limit = 30 } = req.query;
    const query = { owner: req.user._id };
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const total = await Income.countDocuments(query);
    const income = await Income.find(query).sort({ date: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const totalAmount = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({ success: true, income, total, totalAmount: totalAmount[0]?.total || 0 });
  } catch (err) { next(err); }
};

// @POST /api/income
const createIncome = async (req, res, next) => {
  try {
    const income = await Income.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, income });
  } catch (err) { next(err); }
};

// @PUT /api/income/:id
const updateIncome = async (req, res, next) => {
  try {
    const income = await Income.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true });
    if (!income) return res.status(404).json({ success: false, message: 'Income record not found' });
    res.json({ success: true, income });
  } catch (err) { next(err); }
};

// @DELETE /api/income/:id
const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!income) return res.status(404).json({ success: false, message: 'Income record not found' });
    res.json({ success: true, message: 'Income record deleted' });
  } catch (err) { next(err); }
};

// @GET /api/income/stats
const getIncomeStats = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const byCategory = await Income.aggregate([
      { $match: { owner: req.user._id, date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);
    const monthly = await Income.aggregate([
      { $match: { owner: req.user._id, date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) } } },
      { $group: { _id: { month: { $month: '$date' } }, total: { $sum: '$amount' } } },
      { $sort: { '_id.month': 1 } },
    ]);
    res.json({ success: true, byCategory, monthly });
  } catch (err) { next(err); }
};

module.exports = { getIncome, createIncome, updateIncome, deleteIncome, getIncomeStats };
