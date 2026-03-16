const express = require('express');
const router = express.Router();
const { getMilkRecords, createMilkRecord, updateMilkRecord, deleteMilkRecord, getMilkStats } = require('../controllers/milkController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/stats', getMilkStats);
router.route('/').get(getMilkRecords).post(createMilkRecord);
router.route('/:id').put(updateMilkRecord).delete(deleteMilkRecord);

module.exports = router;
