const express = require('express');
const router = express.Router();
const { getFeedInventory, createFeedItem, updateFeedItem, deleteFeedItem, getFeedRecommendations } = require('../controllers/feedController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/recommendations', getFeedRecommendations);
router.route('/').get(getFeedInventory).post(createFeedItem);
router.route('/:id').put(updateFeedItem).delete(deleteFeedItem);

module.exports = router;
