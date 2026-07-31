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

// Helper: strip the placeholder string _id so Mongo/Mongoose can generate
// a real ObjectId instead of throwing a CastError on the first seed.
const stripId = (obj) => {
  const { _id, ...rest } = obj;
  return rest;
};

/**
 * @route GET /api/contest/status
 */
const getContestStatus = async (req, res) => {
  try {
    if (!getIsMockMode()) {
      let contest = await Contest.findOne();
      if (!contest) {
        contest = await Contest.create(stripId(memoryContest));
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
      if (!contest) contest = new Contest(stripId(memoryContest));
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

// ── Shared helper used by the four handlers below ────────────────────────
// Applies a status change (and optional duration reset) in either DB or
// mock mode, broadcasts the change over socket.io, and responds with the
// updated contest document.
const applyStatusChange = async (req, res, newStatus, { resetDuration = false } = {}) => {
  try {
    const { durationMinutes } = req.body || {};

    if (!getIsMockMode()) {
      let contest = await Contest.findOne();
      if (!contest) contest = new Contest(stripId(memoryContest));

      contest.status = newStatus;

      if (resetDuration) {
        const mins = durationMinutes || contest.durationMinutes || 60;
        contest.durationMinutes = mins;
        contest.startTime = new Date();
        contest.endTime = new Date(Date.now() + mins * 60 * 1000);
      }

      await contest.save();
      const io = req.app.get('io');
      if (io) io.emit('contest:status_changed', contest);
      return res.json(contest);
    } else {
      memoryContest.status = newStatus;

      if (resetDuration) {
        const mins = durationMinutes || memoryContest.durationMinutes || 60;
        memoryContest.durationMinutes = mins;
        memoryContest.startTime = new Date();
        memoryContest.endTime = new Date(Date.now() + mins * 60 * 1000);
      }

      const io = req.app.get('io');
      if (io) io.emit('contest:status_changed', memoryContest);
      return res.json(memoryContest);
    }
  } catch (error) {
    res.status(500).json({ message: `Error setting contest status to ${newStatus}` });
  }
};

/**
 * @route PUT /api/contest/start (Admin)
 * Starts (or restarts) the contest — resets startTime/endTime from durationMinutes.
 */
const startContest = (req, res) => applyStatusChange(req, res, 'active', { resetDuration: true });

/**
 * @route PUT /api/contest/pause (Admin)
 */
const pauseContest = (req, res) => applyStatusChange(req, res, 'paused');

/**
 * @route PUT /api/contest/resume (Admin)
 */
const resumeContest = (req, res) => applyStatusChange(req, res, 'active');

/**
 * @route PUT /api/contest/end (Admin)
 */
const endContest = (req, res) => applyStatusChange(req, res, 'ended');

module.exports = {
  getContestStatus,
  updateContestState,
  startContest,
  pauseContest,
  resumeContest,
  endContest,
  memoryContest
};
