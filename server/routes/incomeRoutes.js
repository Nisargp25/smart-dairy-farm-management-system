const express = require('express');
const router = express.Router();
const { getIncome, createIncome, updateIncome, deleteIncome, getIncomeStats } = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/stats', getIncomeStats);
router.route('/').get(getIncome).post(createIncome);
router.route('/:id').put(updateIncome).delete(deleteIncome);

module.exports = router;
