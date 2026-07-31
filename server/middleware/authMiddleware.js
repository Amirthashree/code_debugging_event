const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsMockMode } = require('../config/db');

// In-memory user session store for fallback mock mode
const mockUsersStore = new Map();

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_dynasty_club_super_secret_jwt_key_2026_antigravity');

      if (!getIsMockMode()) {
        req.user = await User.findById(decoded.id).select('-password');
      }
      
      if (!req.user && decoded.user) {
        req.user = decoded.user;
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User account not found' });
      }

      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ message: 'Token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }
};

module.exports = { protect, mockUsersStore };
