const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, farmName, address, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const normalizedRole = role === 'owner' ? 'farmer' : (role || 'customer');
    const needsFarmName = ['farmer', 'owner', 'admin'].includes(normalizedRole);

    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole,
      farmName: needsFarmName ? farmName : undefined,
      address: normalizedRole === 'customer' ? address : undefined,
      phone
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
