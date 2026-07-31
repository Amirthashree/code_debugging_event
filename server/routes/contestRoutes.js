const express = require('express');
const router = express.Router();
const {
  getContestStatus,
  updateContestState,
  startContest,
  pauseContest,
  resumeContest,
  endContest
} = require('../controllers/contestController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/status', protect, getContestStatus);
router.put('/update', protect, adminOnly, updateContestState);

// NOTE: frontend (AdminPanelPage.jsx) calls these with API.post(...), not PUT.
router.post('/start', protect, adminOnly, startContest);
router.post('/pause', protect, adminOnly, pauseContest);
router.post('/resume', protect, adminOnly, resumeContest);
router.post('/end', protect, adminOnly, endContest);

module.exports = router;
