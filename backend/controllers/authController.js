const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function for consistent error responses
const errorResponse = (message, statusCode = 401) => ({
  success: false,
  message: message
});

// Helper function for success responses
const successResponse = (data) => ({
  success: true,
  ...data
});

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // 1. Get and normalize input (trim + lowercase)
    let { username, password } = req.body;
    
    if (!username || !password) {
      console.log(`❌ Login failed: Missing credentials`);
      return res.status(400).json(errorResponse('Please provide both username and password'));
    }
    
    // ✅ Trim and lowercase username
    username = username.trim().toLowerCase();
    password = password.trim();
    
    // 2. Find user
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`❌ Login failed: User not found - ${username}`);
      return res.status(401).json(errorResponse('Invalid credentials'));
    }
    
    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log(`❌ Login failed: Invalid password for ${username}`);
      return res.status(401).json(errorResponse('Invalid credentials'));
    }
    
    // 4. Generate JWT token with MINIMAL payload
    const token = jwt.sign(
      { 
        id: user._id,      // ✅ Only userId
        role: user.role    // ✅ Only role (not username, not full object)
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // 5. Return MINIMAL user info (no __v, no timestamps, no password)
    console.log(`✅ Login success: ${username}`);
    res.json(successResponse({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    }));
    
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json(errorResponse('Server error during login', 500));
  }
};

// @desc    Verify token (for frontend to check if logged in)
// @route   GET /api/auth/verify
// @access  Private
const verify = async (req, res) => {
  try {
    // User is already attached by auth middleware
    const user = await User.findById(req.user.id).select('-password -__v -createdAt -updatedAt');
    
    if (!user) {
      return res.status(401).json(errorResponse('User not found'));
    }
    
    console.log(`✅ Token verified for: ${user.username}`);
    res.json(successResponse({
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    }));
  } catch (error) {
    console.error('❌ Verify error:', error.message);
    res.status(500).json(errorResponse('Server error'));
  }
};

module.exports = { login, verify };