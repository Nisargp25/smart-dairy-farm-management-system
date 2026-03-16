const Animal = require('../models/Animal');
const MilkProduction = require('../models/MilkProduction');
const Vaccination = require('../models/Vaccination');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Worker = require('../models/Worker');

const Notification = require('../models/Notification');

// @GET /api/dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
    const lastWeek = new Date(now); lastWeek.setDate(now.getDate() - 7);

    const [
      totalAnimals,
      todayMilk,
      monthlyIncome,
      totalWorkers,
      milkTrend,
      timeline,
      notifications
    ] = await Promise.all([
      Animal.countDocuments({ owner: ownerId }),
      MilkProduction.aggregate([{ $match: { owner: ownerId, date: { $gte: todayStart, $lte: todayEnd } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Income.aggregate([{ $match: { owner: ownerId, date: { $gte: monthStart, $lte: monthEnd } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Worker.countDocuments({ owner: ownerId, status: 'active' }),
      MilkProduction.aggregate([
        { $match: { owner: ownerId, date: { $gte: lastWeek } } },
        { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } }, yield: { $sum: '$totalAmount' } } },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        { $project: { _id: 0, name: { $concat: [{ $toString: '$_id.day' }, '/', { $toString: '$_id.month' }] }, yield: 1 } }
      ]),
      // Timeline: Combine recent records
      (async () => {
        const [animals, yields, vaccinations] = await Promise.all([
          Animal.find({ owner: ownerId }).sort({ createdAt: -1 }).limit(5),
          MilkProduction.find({ owner: ownerId }).sort({ date: -1 }).limit(5),
          Vaccination.find({ owner: ownerId }).sort({ date: -1 }).limit(5),
        ]);
        return [...animals.map(a => ({ type: 'animal', date: a.createdAt, text: `Added new ${a.breed}: ${a.name}` })),
                ...yields.map(y => ({ type: 'milk', date: y.date, text: `Entry: ${y.totalAmount}L for session ${new Date(y.date).toLocaleDateString()}` })),
                ...vaccinations.map(v => ({ type: 'health', date: v.date, text: `Vaccinated against ${v.vaccineName}` }))]
               .sort((a,b) => b.date - a.date).slice(0, 10);
      })(),
      Notification.find({ user: ownerId }).sort({ createdAt: -1 }).limit(5)
    ]);

    // Simple Production Prediction for next 7 days based on last 7 days average
    const avgYield = milkTrend.length > 0 ? (milkTrend.reduce((s, r) => s + r.yield, 0) / milkTrend.length) : 0;
    const predictedYield = (avgYield * 7).toFixed(1);

    res.json({
      success: true,
      totalAnimals,
      todayMilk: todayMilk[0]?.total || 0,
      monthlyIncome: monthlyIncome[0]?.total || 0,
      totalWorkers,
      milkStats: milkTrend,
      timeline,
      notifications,
      prediction: predictedYield
    });
  } catch (err) { next(err); }
};

module.exports = { getDashboardStats };
