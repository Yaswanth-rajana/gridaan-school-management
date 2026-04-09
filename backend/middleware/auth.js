const jwt = require('jsonwebtoken');

// Consistent error response format
const errorResponse = (message, statusCode = 401) => ({
  success: false,
  message: message
});

const protect = (req, res, next) => {
  let token;
  
  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // If no token found
  if (!token) {
    console.log('❌ Auth failed: No token provided');
    return res.status(401).json(errorResponse('Not authorized. Please login first.'));
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Attach ONLY necessary info to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    console.log(`✅ Auth success: User ${decoded.id} (${decoded.role})`);
    next();
    
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    
    // ✅ Specific error for expired token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(errorResponse('Token expired. Please login again.'));
    }
    
    // ✅ Specific error for invalid token
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(errorResponse('Invalid token. Please login again.'));
    }
    
    res.status(401).json(errorResponse('Not authorized'));
  }
};

module.exports = { protect };