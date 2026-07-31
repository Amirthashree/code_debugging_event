const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  username: { type: String, required: true },
  questionTitle: { type: String, required: true },
  language: { type: String, required: true, enum: ['python', 'java', 'c', 'cpp'] },
  submittedCode: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Accepted', 'Wrong Answer', 'Compile Error', 'Runtime Error', 'Time Limit Exceeded', 'Auto Submitted (Violation)'],
    default: 'Wrong Answer' 
  },
  passedTestCases: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  scoreEarned: { type: Number, default: 0 },
  executionTimeMs: { type: Number, default: 0 },
  details: [{
    testCaseIndex: Number,
    passed: Boolean,
    input: String,
    expectedOutput: String,
    actualOutput: String,
    error: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
