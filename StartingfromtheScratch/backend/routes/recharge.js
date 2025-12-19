const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Mobile Recharge
router.post('/', auth, [
  body('mobileNumber').trim().isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits'),
  body('operator').notEmpty().withMessage('Operator is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('circle').notEmpty().withMessage('Circle is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mobileNumber, operator, amount, circle, planId, paymentMethod } = req.body;
    const userId = req.user._id;

    // Ensure amount is a number
    const rechargeAmount = parseFloat(amount);
    if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Extract payment method if it's an object, otherwise use the string value
    const paymentMethodString = typeof paymentMethod === 'object' && paymentMethod?.method 
      ? paymentMethod.method 
      : (paymentMethod || 'wallet');

    // Check wallet balance only if payment method is wallet
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (paymentMethodString === 'wallet' && user.walletBalance < rechargeAmount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Generate transaction ID
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create transaction
    const transaction = new Transaction({
      userId,
      type: 'recharge',
      mobileNumber,
      operator,
      amount: rechargeAmount,
      planId: planId || null,
      transactionId,
      status: 'success', // Simulating successful recharge
      paymentMethod: paymentMethodString
    });

    await transaction.save();

    // Deduct from wallet only if payment method is wallet
    if (paymentMethodString === 'wallet') {
      user.walletBalance -= rechargeAmount;
      await user.save();
    }

    // Create notification
    try {
      await Notification.create({
        userId,
        title: 'Recharge Successful',
        message: `Your recharge of ₹${rechargeAmount} for ${mobileNumber} has been completed successfully.`,
        type: 'success'
      });
    } catch (notifError) {
      console.error('Notification creation error:', notifError);
      // Don't fail the recharge if notification fails
    }

    res.status(201).json({
      message: 'Recharge successful',
      transaction: {
        transactionId: transaction.transactionId,
        mobileNumber,
        operator,
        amount: rechargeAmount,
        status: transaction.status,
        createdAt: transaction.createdAt
      },
      walletBalance: user.walletBalance,
      paymentMethod: transaction.paymentMethod
    });
  } catch (error) {
    console.error('Recharge error:', error);
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error: ' + error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    res.status(500).json({ error: 'Server error during recharge: ' + error.message });
  }
});

// Get recharge history
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
      type: 'recharge'
    }).sort({ createdAt: -1 }).limit(50);

    res.json({ transactions });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Server error fetching history' });
  }
});

module.exports = router;

