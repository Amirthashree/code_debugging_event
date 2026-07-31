const Contest = require('../models/Contest');
const { getIsMockMode } = require('../config/db');

let memoryContest = {
  _id: 'contest_default_2026',
  title: 'Dev Dynasty Debugging Championship 2026',
  status: 'active',
  durationMinutes: 60,
  startTime: new Date(),
  endTime: new Date(Date.now() + 60 * 60 * 1000),
  maxViolationsAllowed: 5,
  announcements: [
    { message: 'Welcome participants! Fullscreen mode and live anti-cheat are strictly active.', timestamp: new Date() }
  ]
};

/**
 * @route GET /api/contest/status
 */
const getContestStatus = async (req, res) => {
  try {
    if (!getIsMockMode()) {
      let contest = await Contest.findOne();
      if (!contest) {
        contest = await Contest.create(memoryContest);
      }
      return res.json(contest);
    } else {
      return res.json(memoryContest);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contest status' });
  }
};

/**
 * @route PUT /api/contest/update (Admin)
 */
const updateContestState = async (req, res) => {
  try {
    const { status, durationMinutes, maxViolationsAllowed, announcement } = req.body;
    
    if (!getIsMockMode()) {
      let contest = await Contest.findOne();
      if (!contest) contest = new Contest(memoryContest);

      if (status) contest.status = status;
      if (durationMinutes) {
        contest.durationMinutes = durationMinutes;
        contest.endTime = new Date(Date.now() + durationMinutes * 60 * 1000);
      }
      if (maxViolationsAllowed) contest.maxViolationsAllowed = maxViolationsAllowed;
      if (announcement) {
        contest.announcements.unshift({ message: announcement, timestamp: new Date() });
      }

      await contest.save();

      // Broadcast via socket if IO instance exists on app
      const io = req.app.get('io');
      if (io) {
        io.emit('contest:status_changed', contest);
      }

      return res.json(contest);
    } else {
      if (status) memoryContest.status = status;
      if (durationMinutes) {
        memoryContest.durationMinutes = durationMinutes;
        memoryContest.endTime = new Date(Date.now() + durationMinutes * 60 * 1000);
      }
      if (maxViolationsAllowed) memoryContest.maxViolationsAllowed = maxViolationsAllowed;
      if (announcement) {
        memoryContest.announcements.unshift({ message: announcement, timestamp: new Date() });
      }

      const io = req.app.get('io');
      if (io) {
        io.emit('contest:status_changed', memoryContest);
      }

      return res.json(memoryContest);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating contest state' });
  }
};

module.exports = { getContestStatus, updateContestState, memoryContest };
