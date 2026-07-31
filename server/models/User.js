const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['participant', 'admin'],
    default: 'participant'
  },
  collegeOrOrg: {
    type: String,
    default: 'Dev Dynasty Club'
  },
  score: {
    type: Number,
    default: 0
  },
  totalPenaltyTimeSeconds: {
    type: Number,
    default: 0
  },
  questionsSolved: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['idle', 'active', 'submitted', 'disqualified'],
    default: 'idle'
  },
  violationsCount: {
    type: Number,
    default: 0
  },
  isDisqualified: {
    type: Boolean,
    default: false
  },
  disqualificationReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
