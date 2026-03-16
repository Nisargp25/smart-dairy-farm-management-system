const Expense = require('../models/Expense');

// @GET /api/expenses
const getExpenses = async (req, res, next) => {
  try {
    const { startDate, endDate, category, page = 1, limit = 30 } = req.query;
    const query = { owner: req.user._id };
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const total = await Expense.countDocuments(query);
    const expenses = await Expense.find(query).sort({ date: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const totalAmount = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({ success: true, expenses, total, totalAmount: totalAmount[0]?.total || 0 });
  } catch (err) { next(err); }
};

// @POST /api/expenses
const createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, expense });
  } catch (err) { next(err); }
};

// @PUT /api/expenses/:id
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, expense });
  } catch (err) { next(err); }
};

// @DELETE /api/expenses/:id
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) { next(err); }
};

// @GET /api/expenses/stats
const getExpenseStats = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear(), month } = req.query;
    const matchStage = { owner: req.user._id };
    if (year) {
      const start = month ? new Date(year, month - 1, 1) : new Date(year, 0, 1);
      const end = month ? new Date(year, month, 0, 23, 59, 59) : new Date(year, 11, 31, 23, 59, 59);
      matchStage.date = { $gte: start, $lte: end };
    }
    const byCategory = await Expense.aggregate([
      { $match: matchStage },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);
    const monthly = await Expense.aggregate([
      { $match: { owner: req.user._id, date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) } } },
      { $group: { _id: { month: { $month: '$date' } }, total: { $sum: '$amount' } } },
      { $sort: { '_id.month': 1 } },
    ]);
    res.json({ success: true, byCategory, monthly });
  } catch (err) { next(err); }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseStats };
