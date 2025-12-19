const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yuvansankarc:vimal@cluster0.lh8nikm.mongodb.net/mobileRecharge?appName=Cluster0';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@recharge.com' });
    if (existingAdmin) {
      if (existingAdmin.role !== 'admin') {
        console.log('User exists but role is not admin. Updating role...');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Role updated to admin');
      } else {
        console.log('Admin user already exists with correct role');
      }
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@recharge.com',
      password: 'admin123', // Change this password in production
      phone: '9999999999',
      role: 'admin',
      walletBalance: 0
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@recharge.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

