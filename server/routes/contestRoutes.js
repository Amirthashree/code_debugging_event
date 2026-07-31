const express = require('express');
const router = express.Router();
const { getContestStatus, updateContestState } = require('../controllers/contestController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/status', protect, getContestStatus);
router.put('/update', protect, adminOnly, updateContestState);

module.exports = router;
