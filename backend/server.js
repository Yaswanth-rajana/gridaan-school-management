const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middleware (ORDER MATTERS)
app.use(cors());           
app.use(express.json());   

// ========== HEALTH CHECK ROUTE ==========
const PORT = process.env.PORT || 5001;

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: 'ok',
    server: 'running',
    port: PORT,
    database: dbStatusText[dbStatus] || 'unknown',
    timestamp: new Date().toISOString()
  });
});
// ========================================

// ========== IMPORT ROUTES ==========
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const taskRoutes = require('./routes/tasks');       // Phase 5

// ========== USE ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tasks', taskRoutes);        // Phase 5

// ========== TEST ROUTE (temporary) ==========
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});
// ============================================

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth login: POST http://localhost:${PORT}/api/auth/login`);
});