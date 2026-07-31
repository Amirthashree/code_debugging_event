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

router.put('/start', protect, adminOnly, startContest);
router.put('/pause', protect, adminOnly, pauseContest);
router.put('/resume', protect, adminOnly, resumeContest);
router.put('/end', protect, adminOnly, endContest);

module.exports = router;
