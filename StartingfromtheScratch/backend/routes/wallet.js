const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance');
    res.json({ balance: user.walletBalance });
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({ error: 'Server error fetching balance' });
  }
});

// Top up wallet
router.post('/topup', auth, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.walletBalance += parseFloat(amount);
    await user.save();

    // Create transaction record
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    await Transaction.create({
      userId,
      type: 'wallet_topup',
      mobileNumber: user.phone,
      operator: 'Wallet',
      amount: parseFloat(amount),
      transactionId,
      status: 'success'
    });

    // Create notification
    await Notification.create({
      userId,
      title: 'Wallet Top-up Successful',
      message: `Your wallet has been topped up with ₹${amount}. New balance: ₹${user.walletBalance}`,
      type: 'success'
    });

    res.json({
      message: 'Wallet topped up successfully',
      balance: user.walletBalance
    });
  } catch (error) {
    console.error('Top-up error:', error);
    res.status(500).json({ error: 'Server error during top-up' });
  }
});

// Get wallet transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
      type: 'wallet_topup'
    }).sort({ createdAt: -1 }).limit(50);

    res.json({ transactions });
  } catch (error) {
    console.error('Wallet transactions error:', error);
    res.status(500).json({ error: 'Server error fetching wallet transactions' });
  }
});

module.exports = router;

