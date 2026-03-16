const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  createOrder, 
  getMyOrders, 
  createSubscription, 
  getMySubscriptions 
} = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/products').get(getProducts).post(createProduct);
router.route('/orders').get(getMyOrders).post(createOrder);
router.route('/subscriptions').get(getMySubscriptions).post(createSubscription);

module.exports = router;
