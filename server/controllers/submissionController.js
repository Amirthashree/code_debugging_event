const Submission = require('../models/Submission');
const Question = require('../models/Question');
const User = require('../models/User');
const { executeCode, evaluateSubmission } = require('../services/codeRunner');
const { getIsMockMode } = require('../config/db');
const { memoryQuestions } = require('./questionController');
const { memoryUsers } = require('./authController');

const memorySubmissions = [];

/**
 * @route POST /api/submissions/run
 * Runs code against sample (public) test cases
 */
const runCode = async (req, res) => {
  try {
    const { questionId, language, code } = req.body;
    if (!questionId || !language || !code) {
      return res.status(400).json({ message: 'Missing questionId, language, or code' });
    }

    let question;
    if (!getIsMockMode()) {
      question = await Question.findById(questionId);
    } else {
      question = memoryQuestions.get(questionId);
    }

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Filter public sample test cases
    const sampleCases = question.testCases.filter(tc => tc.isPublic !== false);
    const evalResult = await evaluateSubmission(language, code, sampleCases.length ? sampleCases : question.testCases);

    return res.json({
      success: true,
      summary: evalResult
    });
  } catch (error) {
    console.error('Run Code Error:', error);
    res.status(500).json({ message: 'Error executing code test' });
  }
};

/**
 * @route POST /api/submissions/submit
 * Submits solution against all test cases (public + hidden)
 */
const submitCode = async (req, res) => {
  try {
    const { questionId, language, code, isAutoSubmit } = req.body;
    const user = req.user;

    let question;
    if (!getIsMockMode()) {
      question = await Question.findById(questionId);
    } else {
      question = memoryQuestions.get(questionId);
    }

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Evaluate against ALL test cases
    const evalResult = await evaluateSubmission(language, code, question.testCases);
    
    let scoreEarned = 0;
    if (evalResult.status === 'Accepted') {
      scoreEarned = question.points || 100;
    } else {
      scoreEarned = Math.round((evalResult.passedCount / evalResult.totalCount) * (question.points || 100));
    }

    const statusText = isAutoSubmit ? 'Auto Submitted (Violation)' : evalResult.status;

    // Save submission record
    let submissionRecord;
    if (!getIsMockMode()) {
      submissionRecord = await Submission.create({
        userId: user._id || user.id,
        questionId: question._id,
        username: user.username,
        questionTitle: question.title,
        language,
        submittedCode: code,
        status: statusText,
        passedTestCases: evalResult.passedCount,
        totalTestCases: evalResult.totalCount,
        scoreEarned,
        executionTimeMs: evalResult.executionTimeMs,
        details: evalResult.results
      });

      // Update User Score & Solved Array if Accepted
      const userDoc = await User.findById(user._id || user.id);
      if (userDoc) {
        if (!userDoc.questionsSolved.includes(question._id.toString())) {
          if (evalResult.status === 'Accepted') {
            userDoc.questionsSolved.push(question._id.toString());
            userDoc.score += scoreEarned;
          }
        }
        userDoc.status = 'active';
        await userDoc.save();
      }
    } else {
      submissionRecord = {
        _id: 'sub_' + Date.now(),
        userId: user._id || user.id,
        questionId: question._id,
        username: user.username,
        questionTitle: question.title,
        language,
        submittedCode: code,
        status: statusText,
        passedTestCases: evalResult.passedCount,
        totalTestCases: evalResult.totalCount,
        scoreEarned,
        executionTimeMs: evalResult.executionTimeMs,
        details: evalResult.results,
        createdAt: new Date()
      };
      memorySubmissions.unshift(submissionRecord);

      // Memory User Update
      const memUser = memoryUsers.get(user._id || user.id);
      if (memUser) {
        if (!memUser.questionsSolved.includes(question._id)) {
          if (evalResult.status === 'Accepted') {
            memUser.questionsSolved.push(question._id);
            memUser.score += scoreEarned;
          }
        }
        memUser.status = 'active';
      }
    }

    // Emit live leaderboard refresh to Socket.io clients
    const io = req.app.get('io');
    if (io) {
      io.emit('leaderboard:updated', { timestamp: Date.now() });
      io.emit('submission:new', submissionRecord);
    }

    return res.json({
      success: true,
      submission: submissionRecord,
      summary: evalResult
    });
  } catch (error) {
    console.error('Submit Code Error:', error);
    res.status(500).json({ message: 'Error processing code submission' });
  }
};

/**
 * @route GET /api/submissions/user
 */
const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!getIsMockMode()) {
      const subs = await Submission.find({ userId }).sort({ createdAt: -1 });
      return res.json(subs);
    } else {
      const subs = memorySubmissions.filter(s => String(s.userId) === String(userId));
      return res.json(subs);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions' });
  }
};

module.exports = { runCode, submitCode, getUserSubmissions, memorySubmissions };
