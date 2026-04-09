const mongoose = require('mongoose');
const Student = require('../models/Student');
const Task = require('../models/Task');

// Consistent response format
const successResponse = (data) => ({
  success: true,
  ...data
});

const errorResponse = (message, statusCode = 400) => ({
  success: false,
  message: message
});

// ✅ Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ✅ Helper: Escape regex special characters (prevents regex injection)
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ✅ Allowed fields for update (prevents random field injection)
const ALLOWED_UPDATE_FIELDS = ['name', 'class', 'rollNumber', 'email', 'parentContact'];

// ✅ Maximum limit to prevent abuse
const MAX_LIMIT = 50;

// @desc    Get all students (with pagination, search, sorting)
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    // ✅ Pagination with defaults and max limit
    const page = Math.max(1, parseInt(req.query.page) || 1);  // Minimum page = 1
    let limit = parseInt(req.query.limit) || 10;
    limit = Math.min(limit, MAX_LIMIT);  // ✅ Enforce max limit (prevents abuse)
    const skip = (page - 1) * limit;
    
    // ✅ Search by name or class (case-insensitive + escaped)
    const search = req.query.search;
    let filter = {};
    
    if (search && search.trim()) {
      const escapedSearch = escapeRegex(search.trim());  // ✅ Escape regex characters
      filter = {
        $or: [
          { name: { $regex: escapedSearch, $options: 'i' } },
          { class: { $regex: escapedSearch, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const total = await Student.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    // Get students with pagination and sorting (newest first)
    const students = await Student.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    console.log(`✅ Fetched ${students.length} students (Page ${page}/${totalPages}, Total: ${total})`);
    
    // ✅ Enhanced response with pagination metadata
    res.status(200).json(successResponse({
      students,
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
    console.error('❌ Get students error:', error.message);
    res.status(500).json(errorResponse('Failed to fetch students', 500));
  }
};

// @desc    Add new student
// @route   POST /api/students
// @access  Private
const addStudent = async (req, res) => {
  try {
    const { name, class: className, rollNumber, email, parentContact } = req.body;
    
    // Validation
    if (!name || !className) {
      return res.status(400).json(errorResponse('Name and class are required fields'));
    }
    
    // Check for duplicate rollNumber (if provided)
    if (rollNumber) {
      const existingRoll = await Student.findOne({ rollNumber });
      if (existingRoll) {
        return res.status(400).json(errorResponse('Student with this roll number already exists'));
      }
    }
    
    // Check for duplicate email (if provided)
    if (email) {
      const existingEmail = await Student.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json(errorResponse('Student with this email already exists'));
      }
    }
    
    // Create student
    const student = await Student.create({
      name: name.trim(),
      class: className.trim(),
      rollNumber: rollNumber?.trim(),
      email: email?.toLowerCase().trim(),
      parentContact: parentContact?.trim()
    });
    
    console.log(`✅ Student created: ${student.name} (${student.class})`);
    
    res.status(201).json(successResponse({
      message: 'Student added successfully',
      student: {
        id: student._id,
        name: student.name,
        class: student.class,
        rollNumber: student.rollNumber,
        email: student.email,
        parentContact: student.parentContact,
        createdAt: student.createdAt
      }
    }));
    
  } catch (error) {
    console.error('❌ Add student error:', error.message);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json(errorResponse(`${field} already exists`));
    }
    
    res.status(500).json(errorResponse('Failed to add student', 500));
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json(errorResponse('Invalid student ID format'));
    }
    
    // Prevent empty updates
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(errorResponse('No fields provided for update'));
    }
    
    // Only allow specific fields to be updated
    const filteredUpdateData = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    }
    
    // Check if any valid fields were provided
    if (Object.keys(filteredUpdateData).length === 0) {
      return res.status(400).json(errorResponse('No valid fields to update'));
    }
    
    // Find student
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json(errorResponse('Student not found', 404));
    }
    
    // Check for duplicate rollNumber (if changing)
    if (filteredUpdateData.rollNumber && filteredUpdateData.rollNumber !== student.rollNumber) {
      const existingRoll = await Student.findOne({ 
        rollNumber: filteredUpdateData.rollNumber, 
        _id: { $ne: id } 
      });
      if (existingRoll) {
        return res.status(400).json(errorResponse('Student with this roll number already exists'));
      }
    }
    
    // Check for duplicate email (if changing)
    if (filteredUpdateData.email && filteredUpdateData.email.toLowerCase() !== student.email) {
      const existingEmail = await Student.findOne({ 
        email: filteredUpdateData.email.toLowerCase(), 
        _id: { $ne: id } 
      });
      if (existingEmail) {
        return res.status(400).json(errorResponse('Student with this email already exists'));
      }
    }
    
    // Sanitize input fields
    if (filteredUpdateData.name) filteredUpdateData.name = filteredUpdateData.name.trim();
    if (filteredUpdateData.class) filteredUpdateData.class = filteredUpdateData.class.trim();
    if (filteredUpdateData.rollNumber !== undefined) filteredUpdateData.rollNumber = filteredUpdateData.rollNumber?.trim();
    if (filteredUpdateData.email !== undefined) filteredUpdateData.email = filteredUpdateData.email?.toLowerCase().trim();
    if (filteredUpdateData.parentContact !== undefined) filteredUpdateData.parentContact = filteredUpdateData.parentContact?.trim();
    
    filteredUpdateData.updatedAt = Date.now();
    
    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      filteredUpdateData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    console.log(`✅ Student updated: ${updatedStudent.name}`);
    
    res.status(200).json(successResponse({
      message: 'Student updated successfully',
      student: updatedStudent
    }));
    
  } catch (error) {
    console.error('❌ Update student error:', error.message);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json(errorResponse(`${field} already exists`));
    }
    
    res.status(500).json(errorResponse('Failed to update student', 500));
  }
};

// @desc    Delete student (cascade delete tasks)
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json(errorResponse('Invalid student ID format'));
    }
    
    // Find student
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json(errorResponse('Student not found', 404));
    }
    
    // Count tasks before deletion
    const taskCount = await Task.countDocuments({ studentId: id });
    
    // Delete all tasks (CASCADE DELETE)
    await Task.deleteMany({ studentId: id });
    
    // Delete the student
    await Student.findByIdAndDelete(id);
    
    console.log(`✅ Student deleted: ${student.name}`);
    console.log(`   Also deleted ${taskCount} associated tasks`);
    
    res.status(200).json(successResponse({
      message: 'Student deleted successfully',
      deletedStudent: {
        id: student.id,
        name: student.name
      },
      deletedTasksCount: taskCount
    }));
    
  } catch (error) {
    console.error('❌ Delete student error:', error.message);
    res.status(500).json(errorResponse('Failed to delete student', 500));
  }
};

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
};