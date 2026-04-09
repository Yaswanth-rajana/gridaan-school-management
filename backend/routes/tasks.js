const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTasks,
  createTask,
  completeTask,
  getTasksByStudent,
  deleteTask,
  getStats
} = require('../controllers/taskController');

// All task routes require authentication
router.use(protect);

// Routes
router.get('/stats', getStats);
router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/complete', completeTask);
router.get('/student/:studentId', getTasksByStudent);
router.delete('/:id', deleteTask);  // Optional: for cleanup


module.exports = router;