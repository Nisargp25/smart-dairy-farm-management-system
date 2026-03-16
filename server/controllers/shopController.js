const Product = require('../models/Product');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');

// Product Management
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isAvailable: true });
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Only owners can create products' });
    }
    const product = await Product.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// Order Management
exports.createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;
    const order = await Order.create({
      customer: req.user.id,
      items,
      totalAmount,
      deliveryAddress
    });
    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).populate('items.product');
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// Subscription Management
exports.createSubscription = async (req, res, next) => {
  try {
    const { product, quantity, startDate } = req.body;
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ message: 'Product not found' });

    const subscription = await Subscription.create({
      customer: req.user.id,
      product,
      quantity,
      startDate,
      owner: prod.owner
    });
    res.status(201).json({ success: true, subscription });
  } catch (err) {
    next(err);
  }
};

exports.getMySubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ customer: req.user.id }).populate('product');
    res.json({ success: true, subscriptions });
  } catch (err) {
    next(err);
  }
};
