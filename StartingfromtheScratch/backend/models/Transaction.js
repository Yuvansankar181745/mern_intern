const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['recharge', 'bill_payment', 'wallet_topup', 'refund'],
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  operator: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  planId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'upi', 'google_pay', 'phonepe', 'paytm', 'netbanking', 'card'],
    default: 'wallet'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);

