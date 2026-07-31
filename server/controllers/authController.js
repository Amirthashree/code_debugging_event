const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsMockMode } = require('../config/db');

// In-Memory store for quick standalone execution
const memoryUsers = new Map();

// Helper to sign JWT
const generateToken = (userObj) => {
  return jwt.sign(
    { 
      id: userObj._id || userObj.id, 
      role: userObj.role,
      user: userObj
    }, 
    process.env.JWT_SECRET || 'dev_dynasty_club_super_secret_jwt_key_2026_antigravity', 
    { expiresIn: '12h' }
  );
};

/**
 * @route POST /api/auth/register
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, collegeOrOrg } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter username, email and password.' });
    }

    const assignedRole = (role === 'admin') ? 'admin' : 'participant';

    if (!getIsMockMode()) {
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email or username already exists.' });
      }

      const user = await User.create({
        username,
        email,
        password,
        role: assignedRole,
        collegeOrOrg: collegeOrOrg || 'Dev Dynasty Club'
      });

      const token = generateToken(user);
      return res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          collegeOrOrg: user.collegeOrOrg,
          score: user.score,
          status: user.status
        }
      });
    } else {
      // In-Memory Mock Mode
      const existing = Array.from(memoryUsers.values()).find(u => u.email === email || u.username === username);
      if (existing) {
        return res.status(400).json({ message: 'User with this email or username already exists.' });
      }

      const newUser = {
        _id: 'usr_' + Date.now() + Math.random().toString(36).substr(2, 4),
        username,
        email,
        password,
        role: assignedRole,
        collegeOrOrg: collegeOrOrg || 'Dev Dynasty Club',
        score: 0,
        totalPenaltyTimeSeconds: 0,
        questionsSolved: [],
        status: 'idle',
        violationsCount: 0,
        isDisqualified: false,
        disqualificationReason: ''
      };

      memoryUsers.set(newUser._id, newUser);
      const token = generateToken(newUser);

      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          collegeOrOrg: newUser.collegeOrOrg,
          score: newUser.score,
          status: newUser.status
        }
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

/**
 * @route POST /api/auth/login
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    if (!getIsMockMode()) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user);
        return res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            collegeOrOrg: user.collegeOrOrg,
            score: user.score,
            status: user.status,
            violationsCount: user.violationsCount,
            isDisqualified: user.isDisqualified
          }
        });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    } else {
      // In-Memory Mode
      const user = Array.from(memoryUsers.values()).find(u => u.email === email && u.password === password);
      // Also check default admin fallback
      if (!user && email === 'admin@devdynasty.com' && password === 'admin123') {
        const adminUser = {
          _id: 'admin_root_1',
          username: 'AdminDevDynasty',
          email: 'admin@devdynasty.com',
          role: 'admin',
          collegeOrOrg: 'Dev Dynasty Core',
          score: 0,
          status: 'active',
          violationsCount: 0,
          isDisqualified: false
        };
        memoryUsers.set(adminUser._id, adminUser);
        const token = generateToken(adminUser);
        return res.json({ token, user: adminUser });
      }

      if (user) {
        const token = generateToken(user);
        return res.json({ token, user });
      }

      return res.status(401).json({ message: 'Invalid credentials. Hint: use admin@devdynasty.com / admin123' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @route GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

module.exports = { registerUser, loginUser, getMe, memoryUsers };
