const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseStats } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/stats', getExpenseStats);
router.route('/').get(getExpenses).post(createExpense);
router.route('/:id').put(updateExpense).delete(deleteExpense);

module.exports = router;
