const express = require('express');
const router = express.Router();
const admin = require('../middleware/admin');
const Plan = require('../models/Plan');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Admin Dashboard Statistics
router.get('/dashboard', admin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalTransactions,
      totalRevenue,
      totalPlans,
      recentTransactions,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      Transaction.countDocuments(),
      Transaction.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Plan.countDocuments({ isActive: true }),
      Transaction.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email'),
      User.find().sort({ createdAt: -1 }).limit(5)
    ]);

    const revenue = totalRevenue[0]?.total || 0;

    // Get transactions by type
    const transactionsByType = await Transaction.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Get transactions by status
    const transactionsByStatus = await Transaction.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalTransactions,
        totalRevenue: revenue,
        totalPlans
      },
      recentTransactions,
      recentUsers,
      transactionsByType,
      transactionsByStatus
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

// Get all users
router.get('/users', admin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Get user by ID
router.get('/users/:id', admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ user, transactions });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error fetching user' });
  }
});

// Update user role
router.put('/users/:id/role', admin, [
  body('role').isIn(['user', 'admin']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = req.body.role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Server error updating user role' });
  }
});

// Get all transactions
router.get('/transactions', admin, async (req, res) => {
  try {
    const { page = 1, limit = 50, type, status, startDate, endDate } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Server error fetching transactions' });
  }
});

// Get transaction statistics
router.get('/transactions/stats', admin, async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 },
          successAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0]
            }
          },
          successCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'success'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const byType = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const byStatus = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      overall: stats[0] || {},
      byType,
      byStatus
    });
  } catch (error) {
    console.error('Transaction stats error:', error);
    res.status(500).json({ error: 'Server error fetching transaction statistics' });
  }
});

// Create plan
router.post('/plans', admin, [
  body('operator').notEmpty().withMessage('Operator is required'),
  body('planName').notEmpty().withMessage('Plan name is required'),
  body('price').isFloat({ min: 1 }).withMessage('Price must be greater than 0'),
  body('validity').notEmpty().withMessage('Validity is required'),
  body('data').notEmpty().withMessage('Data is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const plan = new Plan(req.body);
    await plan.save();

    res.status(201).json({ message: 'Plan created successfully', plan });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Server error creating plan' });
  }
});

// Update plan
router.put('/plans/:id', admin, [
  body('price').optional().isFloat({ min: 1 }),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ message: 'Plan updated successfully', plan });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Server error updating plan' });
  }
});

// Delete plan
router.delete('/plans/:id', admin, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Server error deleting plan' });
  }
});

// Get all plans (admin view)
router.get('/plans', admin, async (req, res) => {
  try {
    const plans = await Plan.find().sort({ operator: 1, price: 1 });
    res.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Server error fetching plans' });
  }
});

module.exports = router;

