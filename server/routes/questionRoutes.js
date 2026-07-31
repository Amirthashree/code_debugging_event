const express = require('express');
const router = express.Router();
const { getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', protect, getQuestions);
router.get('/:id', protect, getQuestionById);
router.post('/', protect, adminOnly, createQuestion);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;
