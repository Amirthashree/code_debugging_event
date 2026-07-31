const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: { type: String, default: 'Dev Dynasty Debugging Championship 2026' },
  status: { type: String, enum: ['scheduled', 'active', 'paused', 'ended'], default: 'active' },
  durationMinutes: { type: Number, default: 60 },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  maxViolationsAllowed: { type: Number, default: 5 },
  announcements: [{
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Contest', contestSchema);
