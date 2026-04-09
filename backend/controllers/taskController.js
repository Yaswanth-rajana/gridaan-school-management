const mongoose = require('mongoose');
const Task = require('../models/Task');
const Student = require('../models/Student');

// Consistent response format
const successResponse = (data) => ({
  success: true,
  ...data
});

const errorResponse = (message, statusCode = 400) => ({
  success: false,
  message: message
});

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Maximum limit for pagination
const MAX_LIMIT = 50;

// @desc    Get all tasks (with student details populated)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    let limit = parseInt(req.query.limit) || 10;
    limit = Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * limit;
    
    // Filter by status if provided
    let filter = {};
    if (req.query.status && ['pending', 'completed'].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    
    // Filter by student if provided
    if (req.query.studentId) {
      if (!isValidObjectId(req.query.studentId)) {
        return res.status(400).json(errorResponse('Invalid student ID format'));
      }
      filter.studentId = req.query.studentId;
    }
    
    // Get total count
    const total = await Task.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    // Get tasks with student data populated
    const tasks = await Task.find(filter)
      .populate('studentId', 'name class rollNumber email')  // Get student details
      .select('-__v')
      .sort({ createdAt: -1 })  // Newest first
      .skip(skip)
      .limit(limit);
    
    console.log(`✅ Fetched ${tasks.length} tasks (Page ${page}/${totalPages})`);
    
    res.status(200).json(successResponse({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }));
    
  } catch (error) {
    console.error('❌ Get tasks error:', error.message);
    res.status(500).json(errorResponse('Failed to fetch tasks', 500));
  }
};

// @desc    Assign task to a student
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, studentId } = req.body;
    
    // Validation
    if (!title || !studentId) {
      return res.status(400).json(errorResponse('Title and studentId are required'));
    }
    
    // Validate studentId format
    if (!isValidObjectId(studentId)) {
      return res.status(400).json(errorResponse('Invalid student ID format'));
    }
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json(errorResponse('Student not found', 404));
    }
    
    // Create task
    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      studentId,
      status: 'pending'
    });
    
    // Get task with populated student data
    const populatedTask = await Task.findById(task._id)
      .populate('studentId', 'name class rollNumber email');
    
    console.log(`✅ Task created: "${task.title}" for student ${student.name}`);
    
    res.status(201).json(successResponse({
      message: 'Task assigned successfully',
      task: populatedTask
    }));
    
  } catch (error) {
    console.error('❌ Create task error:', error.message);
    res.status(500).json(errorResponse('Failed to assign task', 500));
  }
};

// @desc    Mark task as completed
// @route   PATCH /api/tasks/:id/complete
// @access  Private
const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json(errorResponse('Invalid task ID format'));
    }
    
    // Find task
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json(errorResponse('Task not found', 404));
    }
    
    // Check if already completed
    if (task.status === 'completed') {
      return res.status(400).json(errorResponse('Task is already completed'));
    }
    
    // Update status
    task.status = 'completed';
    await task.save();
    
    // Get updated task with student data
    const updatedTask = await Task.findById(id)
      .populate('studentId', 'name class');
    
    console.log(`✅ Task completed: "${task.title}"`);
    
    res.status(200).json(successResponse({
      message: 'Task marked as completed',
      task: updatedTask
    }));
    
  } catch (error) {
    console.error('❌ Complete task error:', error.message);
    res.status(500).json(errorResponse('Failed to complete task', 500));
  }
};

// @desc    Get tasks for a specific student
// @route   GET /api/tasks/student/:studentId
// @access  Private
const getTasksByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Validate studentId
    if (!isValidObjectId(studentId)) {
      return res.status(400).json(errorResponse('Invalid student ID format'));
    }
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json(errorResponse('Student not found', 404));
    }
    
    // Get tasks for this student
    const tasks = await Task.find({ studentId })
      .select('-__v')
      .sort({ createdAt: -1 });
    
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    
    console.log(`✅ Fetched ${tasks.length} tasks for student: ${student.name}`);
    
    res.status(200).json(successResponse({
      student: {
        id: student._id,
        name: student.name,
        class: student.class
      },
      summary: {
        total: tasks.length,
        completed: completedCount,
        pending: pendingCount
      },
      tasks
    }));
    
  } catch (error) {
    console.error('❌ Get tasks by student error:', error.message);
    res.status(500).json(errorResponse('Failed to fetch tasks', 500));
  }
};

// @desc    Delete task (optional - for cleanup)
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json(errorResponse('Invalid task ID format'));
    }
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json(errorResponse('Task not found', 404));
    }
    
    await Task.findByIdAndDelete(id);
    
    console.log(`✅ Task deleted: "${task.title}"`);
    
    res.status(200).json(successResponse({
      message: 'Task deleted successfully',
      deletedTask: {
        id: task._id,
        title: task.title
      }
    }));
    
  } catch (error) {
    console.error('❌ Delete task error:', error.message);
    res.status(500).json(errorResponse('Failed to delete task', 500));
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/tasks/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    
    res.status(200).json(successResponse({
      stats: {
        totalStudents,
        totalTasks,
        pendingTasks,
        completedTasks
      }
    }));
  } catch (error) {
    console.error('❌ Get stats error:', error.message);
    res.status(500).json(errorResponse('Failed to fetch statistics', 500));
  }
};

module.exports = {
  getTasks,
  createTask,
  completeTask,
  getTasksByStudent,
  deleteTask,
  getStats
};