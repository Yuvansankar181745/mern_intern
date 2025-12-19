const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Pay bill
router.post('/pay', auth, [
  body('mobileNumber').trim().isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits'),
  body('operator').notEmpty().withMessage('Operator is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('billType').notEmpty().withMessage('Bill type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mobileNumber, operator, amount, billType } = req.body;
    const userId = req.user._id;

    // Check wallet balance
    const user = await User.findById(userId);
    if (user.walletBalance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Generate transaction ID
    const transactionId = 'BILL' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create transaction
    const transaction = new Transaction({
      userId,
      type: 'bill_payment',
      mobileNumber,
      operator,
      amount,
      transactionId,
      status: 'success'
    });

    await transaction.save();

    // Deduct from wallet
    user.walletBalance -= amount;
    await user.save();

    // Create notification
    await Notification.create({
      userId,
      title: 'Bill Payment Successful',
      message: `Your ${billType} bill of ₹${amount} for ${mobileNumber} has been paid successfully.`,
      type: 'success'
    });

    res.status(201).json({
      message: 'Bill payment successful',
      transaction: {
        transactionId: transaction.transactionId,
        mobileNumber,
        operator,
        amount,
        billType,
        status: transaction.status,
        createdAt: transaction.createdAt
      },
      walletBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Bill payment error:', error);
    res.status(500).json({ error: 'Server error during bill payment' });
  }
});

// Get bill payment history
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
      type: 'bill_payment'
    }).sort({ createdAt: -1 }).limit(50);

    res.json({ transactions });
  } catch (error) {
    console.error('Bill history error:', error);
    res.status(500).json({ error: 'Server error fetching bill history' });
  }
});

module.exports = router;

