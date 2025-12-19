const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  operator: {
    type: String,
    required: true,
    enum: ['Airtel', 'Jio', 'Vi', 'BSNL']
  },
  planName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  validity: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  },
  talktime: {
    type: String,
    default: 'Unlimited'
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Plan', planSchema);

