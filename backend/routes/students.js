const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

// All student routes require authentication
router.use(protect);  // ✅ This protects ALL routes below

// Routes
router.get('/', getStudents);
router.post('/', addStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;