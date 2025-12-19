const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yuvansankarc:vimal@cluster0.lh8nikm.mongodb.net/mobileRecharge?appName=Cluster0';

async function verifyAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@recharge.com' });
    
    if (!admin) {
      console.log('❌ Admin user does NOT exist');
      console.log('Run: npm run create-admin');
      process.exit(1);
    }

    console.log('✅ Admin user exists');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Name:', admin.name);
    
    if (admin.role !== 'admin') {
      console.log('⚠️  WARNING: User exists but role is not "admin"');
      console.log('Current role:', admin.role);
      console.log('Updating role to admin...');
      
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Role updated to admin');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error verifying admin:', error);
    process.exit(1);
  }
}

verifyAdmin();

