const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('✅ Admin already exists');
      console.log('📝 Username:', adminExists.username);
      console.log('👤 Role:', adminExists.role);
      process.exit();
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create admin
    const admin = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });
    
    console.log('✅ Admin created successfully!');
    console.log('📝 Username: admin');
    console.log('📝 Password: admin123');
    console.log('🆔 Admin ID:', admin._id);
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding admin:');
    if (error.code === 11000) {
      console.error('🔴 Duplicate key error: Admin already exists with unique constraint conflict');
    } else {
      console.error('🔴 Error:', error.message);
    }
    process.exit(1);
  }
};

seedAdmin();