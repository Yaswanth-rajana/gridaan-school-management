const express = require('express');
const router = express.Router();
const { login, verify } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public route
router.post('/login', login);

// Protected route (requires token)
router.get('/verify', protect, verify);

module.exports = router;