const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, default: '' },
  expectedOutput: { type: String, required: true },
  explanation: { type: String, default: '' },
  isPublic: { type: Boolean, default: true }
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  category: { type: String, default: 'Logic Bug' },
  points: { type: Number, default: 100 },
  buggyCode: {
    python: { type: String, default: '' },
    java: { type: String, default: '' },
    c: { type: String, default: '' },
    cpp: { type: String, default: '' }
  },
  solutionCode: {
    python: { type: String, default: '' },
    java: { type: String, default: '' },
    c: { type: String, default: '' },
    cpp: { type: String, default: '' }
  },
  testCases: [testCaseSchema],
  hint: { type: String, default: '' },
  order: { type: Number, default: 1 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
