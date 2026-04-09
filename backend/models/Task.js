const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,  // ✅ IMPROVES QUERY PERFORMANCE
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

// ✅ Compound index for common queries (optional but elite)
// Example: Get all pending tasks for a student
TaskSchema.index({ studentId: 1, status: 1 });

module.exports = mongoose.model('Task', TaskSchema);