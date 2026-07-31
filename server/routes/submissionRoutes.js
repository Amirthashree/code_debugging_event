const express = require('express');
const router = express.Router();
const { runCode, submitCode, getUserSubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);
router.get('/user', protect, getUserSubmissions);

module.exports = router;
