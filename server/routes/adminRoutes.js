const express = require('express');
const router = express.Router();
const { getDashboardStats, getParticipants, logViolation, getViolationsList, exportResults } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/participants', protect, adminOnly, getParticipants);
router.post('/violations', protect, logViolation); // Participants log their anti-cheat violations
router.get('/violations', protect, adminOnly, getViolationsList);
router.get('/export', protect, adminOnly, exportResults);

module.exports = router;
