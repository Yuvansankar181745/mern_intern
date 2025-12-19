const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('../models/Plan');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yuvansankarc:vimal@cluster0.lh8nikm.mongodb.net/mobileRecharge?appName=Cluster0';

const defaultPlans = [
  // ========== AIRTEL PLANS ==========
  // Daily Plans
  { operator: 'Airtel', planName: 'Airtel ₹19', price: 19, validity: '1 day', data: '1GB', talktime: 'Unlimited', description: '1GB data for 1 day' },
  { operator: 'Airtel', planName: 'Airtel ₹24', price: 24, validity: '1 day', data: '2GB', talktime: 'Unlimited', description: '2GB data for 1 day' },
  
  // Weekly Plans
  { operator: 'Airtel', planName: 'Airtel ₹49', price: 49, validity: '7 days', data: '6GB', talktime: 'Unlimited', description: '6GB total data for 7 days' },
  { operator: 'Airtel', planName: 'Airtel ₹79', price: 79, validity: '7 days', data: '1GB/day', talktime: 'Unlimited', description: '1GB per day for 7 days' },
  
  // Monthly Plans - Entry Level
  { operator: 'Airtel', planName: 'Airtel ₹99', price: 99, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹149', price: 149, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹179', price: 179, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹199', price: 199, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  
  // Monthly Plans - Mid Range
  { operator: 'Airtel', planName: 'Airtel ₹219', price: 219, validity: '28 days', data: '1.5GB/day', talktime: 'Unlimited', description: '1.5GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹239', price: 239, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹249', price: 249, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹299', price: 299, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹319', price: 319, validity: '28 days', data: '2.5GB/day', talktime: 'Unlimited', description: '2.5GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹349', price: 349, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  
  // Monthly Plans - High Range
  { operator: 'Airtel', planName: 'Airtel ₹399', price: 399, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹449', price: 449, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹499', price: 499, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹549', price: 549, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹599', price: 599, validity: '56 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 56 days' },
  { operator: 'Airtel', planName: 'Airtel ₹666', price: 666, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹699', price: 699, validity: '56 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 56 days' },
  { operator: 'Airtel', planName: 'Airtel ₹749', price: 749, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  { operator: 'Airtel', planName: 'Airtel ₹999', price: 999, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'Airtel', planName: 'Airtel ₹1299', price: 1299, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'Airtel', planName: 'Airtel ₹1499', price: 1499, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'Airtel', planName: 'Airtel ₹1799', price: 1799, validity: '365 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 365 days' },
  { operator: 'Airtel', planName: 'Airtel ₹2999', price: 2999, validity: '365 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 365 days' },
  
  // ========== JIO PLANS ==========
  // Daily Plans
  { operator: 'Jio', planName: 'Jio ₹19', price: 19, validity: '1 day', data: '1GB', talktime: 'Unlimited', description: '1GB data for 1 day' },
  { operator: 'Jio', planName: 'Jio ₹24', price: 24, validity: '1 day', data: '2GB', talktime: 'Unlimited', description: '2GB data for 1 day' },
  
  // Weekly Plans
  { operator: 'Jio', planName: 'Jio ₹49', price: 49, validity: '7 days', data: '6GB', talktime: 'Unlimited', description: '6GB total data for 7 days' },
  { operator: 'Jio', planName: 'Jio ₹79', price: 79, validity: '7 days', data: '1GB/day', talktime: 'Unlimited', description: '1GB per day for 7 days' },
  
  // Monthly Plans - Entry Level
  { operator: 'Jio', planName: 'Jio ₹99', price: 99, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹149', price: 149, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹179', price: 179, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹199', price: 199, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  
  // Monthly Plans - Mid Range
  { operator: 'Jio', planName: 'Jio ₹219', price: 219, validity: '28 days', data: '1.5GB/day', talktime: 'Unlimited', description: '1.5GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹239', price: 239, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹249', price: 249, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹299', price: 299, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹319', price: 319, validity: '28 days', data: '2.5GB/day', talktime: 'Unlimited', description: '2.5GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹349', price: 349, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  
  // Monthly Plans - High Range
  { operator: 'Jio', planName: 'Jio ₹399', price: 399, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹449', price: 449, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹499', price: 499, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹549', price: 549, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹599', price: 599, validity: '56 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 56 days' },
  { operator: 'Jio', planName: 'Jio ₹666', price: 666, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹699', price: 699, validity: '56 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 56 days' },
  { operator: 'Jio', planName: 'Jio ₹749', price: 749, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  { operator: 'Jio', planName: 'Jio ₹999', price: 999, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'Jio', planName: 'Jio ₹1299', price: 1299, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'Jio', planName: 'Jio ₹1499', price: 1499, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'Jio', planName: 'Jio ₹1799', price: 1799, validity: '365 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 365 days' },
  { operator: 'Jio', planName: 'Jio ₹2999', price: 2999, validity: '365 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 365 days' },
  
  // ========== VI PLANS ==========
  // Daily Plans
  { operator: 'Vi', planName: 'Vi ₹19', price: 19, validity: '1 day', data: '1GB', talktime: 'Unlimited', description: '1GB data for 1 day' },
  { operator: 'Vi', planName: 'Vi ₹24', price: 24, validity: '1 day', data: '2GB', talktime: 'Unlimited', description: '2GB data for 1 day' },
  
  // Weekly Plans
  { operator: 'Vi', planName: 'Vi ₹49', price: 49, validity: '7 days', data: '6GB', talktime: 'Unlimited', description: '6GB total data for 7 days' },
  { operator: 'Vi', planName: 'Vi ₹79', price: 79, validity: '7 days', data: '1GB/day', talktime: 'Unlimited', description: '1GB per day for 7 days' },
  
  // Monthly Plans - Entry Level
  { operator: 'Vi', planName: 'Vi ₹99', price: 99, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹149', price: 149, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹179', price: 179, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹199', price: 199, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  
  // Monthly Plans - Mid Range
  { operator: 'Vi', planName: 'Vi ₹219', price: 219, validity: '28 days', data: '1.5GB/day', talktime: 'Unlimited', description: '1.5GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹239', price: 239, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹249', price: 249, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹299', price: 299, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹319', price: 319, validity: '28 days', data: '2.5GB/day', talktime: 'Unlimited', description: '2.5GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹349', price: 349, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  
  // Monthly Plans - High Range
  { operator: 'Vi', planName: 'Vi ₹399', price: 399, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹449', price: 449, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹499', price: 499, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹549', price: 549, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹599', price: 599, validity: '56 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 56 days' },
  { operator: 'Vi', planName: 'Vi ₹666', price: 666, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹699', price: 699, validity: '56 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 56 days' },
  { operator: 'Vi', planName: 'Vi ₹749', price: 749, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  { operator: 'Vi', planName: 'Vi ₹999', price: 999, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'Vi', planName: 'Vi ₹1299', price: 1299, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'Vi', planName: 'Vi ₹1499', price: 1499, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'Vi', planName: 'Vi ₹1799', price: 1799, validity: '365 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 365 days' },
  { operator: 'Vi', planName: 'Vi ₹2999', price: 2999, validity: '365 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 365 days' },
  
  // ========== BSNL PLANS ==========
  // Daily Plans
  { operator: 'BSNL', planName: 'BSNL ₹19', price: 19, validity: '1 day', data: '1GB', talktime: 'Unlimited', description: '1GB data for 1 day' },
  { operator: 'BSNL', planName: 'BSNL ₹24', price: 24, validity: '1 day', data: '2GB', talktime: 'Unlimited', description: '2GB data for 1 day' },
  
  // Weekly Plans
  { operator: 'BSNL', planName: 'BSNL ₹49', price: 49, validity: '7 days', data: '6GB', talktime: 'Unlimited', description: '6GB total data for 7 days' },
  { operator: 'BSNL', planName: 'BSNL ₹79', price: 79, validity: '7 days', data: '1GB/day', talktime: 'Unlimited', description: '1GB per day for 7 days' },
  
  // Monthly Plans - Entry Level
  { operator: 'BSNL', planName: 'BSNL ₹99', price: 99, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹149', price: 149, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹179', price: 179, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹199', price: 199, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  
  // Monthly Plans - Mid Range
  { operator: 'BSNL', planName: 'BSNL ₹219', price: 219, validity: '28 days', data: '1.5GB/day', talktime: 'Unlimited', description: '1.5GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹239', price: 239, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹249', price: 249, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹299', price: 299, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹319', price: 319, validity: '28 days', data: '2.5GB/day', talktime: 'Unlimited', description: '2.5GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹349', price: 349, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  
  // Monthly Plans - High Range
  { operator: 'BSNL', planName: 'BSNL ₹399', price: 399, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹449', price: 449, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹499', price: 499, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹549', price: 549, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹599', price: 599, validity: '56 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 56 days' },
  { operator: 'BSNL', planName: 'BSNL ₹666', price: 666, validity: '28 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹699', price: 699, validity: '56 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 56 days' },
  { operator: 'BSNL', planName: 'BSNL ₹749', price: 749, validity: '28 days', data: '3GB/day', talktime: 'Unlimited', description: '3GB per day for 28 days' },
  { operator: 'BSNL', planName: 'BSNL ₹999', price: 999, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'BSNL', planName: 'BSNL ₹1299', price: 1299, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'BSNL', planName: 'BSNL ₹1499', price: 1499, validity: '84 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 84 days' },
  { operator: 'BSNL', planName: 'BSNL ₹1799', price: 1799, validity: '365 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 365 days' },
  { operator: 'BSNL', planName: 'BSNL ₹2999', price: 2999, validity: '365 days', data: '2GB/day', talktime: 'Unlimited', description: '2GB per day for 365 days' }
];

async function initializePlans() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing plans
    await Plan.deleteMany({});
    console.log('Cleared existing plans');

    // Insert default plans
    await Plan.insertMany(defaultPlans);
    console.log(`Successfully initialized ${defaultPlans.length} plans`);
    console.log(`Plans breakdown:`);
    console.log(`- Airtel: ${defaultPlans.filter(p => p.operator === 'Airtel').length} plans`);
    console.log(`- Jio: ${defaultPlans.filter(p => p.operator === 'Jio').length} plans`);
    console.log(`- Vi: ${defaultPlans.filter(p => p.operator === 'Vi').length} plans`);
    console.log(`- BSNL: ${defaultPlans.filter(p => p.operator === 'BSNL').length} plans`);

    process.exit(0);
  } catch (error) {
    console.error('Error initializing plans:', error);
    process.exit(1);
  }
}

initializePlans();
