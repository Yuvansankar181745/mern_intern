const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// Get all plans
router.get('/', async (req, res) => {
  try {
    const { operator } = req.query;
    const query = { isActive: true };
    
    if (operator) {
      query.operator = operator;
    }

    const plans = await Plan.find(query).sort({ price: 1 });
    res.json({ plans });
  } catch (error) {
    console.error('Plans error:', error);
    res.status(500).json({ error: 'Server error fetching plans' });
  }
});

// Get plan by ID
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Plan error:', error);
    res.status(500).json({ error: 'Server error fetching plan' });
  }
});

// Initialize default plans (for seeding)
router.post('/initialize', async (req, res) => {
  try {
    const defaultPlans = [
      {
        operator: 'Airtel',
        planName: 'Airtel ₹99',
        price: 99,
        validity: '28 days',
        data: '2GB/day',
        talktime: 'Unlimited',
        description: '2GB per day for 28 days'
      },
      {
        operator: 'Airtel',
        planName: 'Airtel ₹149',
        price: 149,
        validity: '28 days',
        data: '2GB/day',
        talktime: 'Unlimited',
        description: '2GB per day for 28 days'
      },
      {
        operator: 'Jio',
        planName: 'Jio ₹99',
        price: 99,
        validity: '28 days',
        data: '2GB/day',
        talktime: 'Unlimited',
        description: '2GB per day for 28 days'
      },
      {
        operator: 'Jio',
        planName: 'Jio ₹149',
        price: 149,
        validity: '28 days',
        data: '2GB/day',
        talktime: 'Unlimited',
        description: '2GB per day for 28 days'
      },
      {
        operator: 'Vi',
        planName: 'Vi ₹99',
        price: 99,
        validity: '28 days',
        data: '2GB/day',
        talktime: 'Unlimited',
        description: '2GB per day for 28 days'
      },
      {
        operator: 'Vi',
        planName: 'Vi ₹149',
        price: 149,
        validity: '28 days',
        data: '2GB/day',
        talktime: 'Unlimited',
        description: '2GB per day for 28 days'
      }
    ];

    await Plan.insertMany(defaultPlans);
    res.json({ message: 'Default plans initialized successfully' });
  } catch (error) {
    console.error('Initialize plans error:', error);
    res.status(500).json({ error: 'Server error initializing plans' });
  }
});

module.exports = router;

