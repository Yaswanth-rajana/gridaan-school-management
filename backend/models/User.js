const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,  // ✅ Prevents "Admin" vs "admin" duplicates
  },
  password: {
    type: String,
    required: true,
    minlength: 6,  // ✅ Password minimum length (security signal)
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);