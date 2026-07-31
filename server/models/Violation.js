const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['TAB_SWITCH', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'COPY_PASTE_ATTEMPT', 'RIGHT_CLICK_ATTEMPT', 'DEVTOOLS_ATTEMPT'],
    required: true 
  },
  details: { type: String, default: '' },
  currentViolationsCount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Violation', violationSchema);
