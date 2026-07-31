const User = require('../models/User');
const Violation = require('../models/Violation');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
const { getIsMockMode } = require('../config/db');
const { memoryUsers } = require('./authController');
const { memorySubmissions } = require('./submissionController');
const { memoryQuestions } = require('./questionController');

const memoryViolations = [];

/**
 * @route GET /api/admin/dashboard
 */
const getDashboardStats = async (req, res) => {
  try {
    if (!getIsMockMode()) {
      const totalParticipants = await User.countDocuments({ role: 'participant' });
      const activeParticipants = await User.countDocuments({ role: 'participant', status: 'active' });
      const totalSubmissions = await Submission.countDocuments();
      const totalViolations = await Violation.countDocuments();
      const totalQuestions = await Question.countDocuments();

      return res.json({
        totalParticipants,
        activeParticipants,
        totalSubmissions,
        totalViolations,
        totalQuestions
      });
    } else {
      const allUsers = Array.from(memoryUsers.values()).filter(u => u.role === 'participant');
      return res.json({
        totalParticipants: allUsers.length,
        activeParticipants: allUsers.filter(u => u.status === 'active').length,
        totalSubmissions: memorySubmissions.length,
        totalViolations: memoryViolations.length,
        totalQuestions: memoryQuestions.size
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

/**
 * @route GET /api/admin/participants
 */
const getParticipants = async (req, res) => {
  try {
    if (!getIsMockMode()) {
      const participants = await User.find({ role: 'participant' }).select('-password').sort({ score: -1 });
      return res.json(participants);
    } else {
      const participants = Array.from(memoryUsers.values())
        .filter(u => u.role === 'participant')
        .sort((a, b) => b.score - a.score);
      return res.json(participants);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching participants list' });
  }
};

/**
 * @route POST /api/admin/violations
 * Logs anti-cheat violation event & updates user violation status
 */
const logViolation = async (req, res) => {
  try {
    const { type, details } = req.body;
    const user = req.user;

    let currentCount = 0;
    let isDisqualified = false;

    if (!getIsMockMode()) {
      const userDoc = await User.findById(user._id || user.id);
      if (userDoc) {
        userDoc.violationsCount += 1;
        currentCount = userDoc.violationsCount;

        if (userDoc.violationsCount >= 5) {
          userDoc.isDisqualified = true;
          userDoc.status = 'disqualified';
          userDoc.disqualificationReason = `Exceeded anti-cheat limit (5 violations). Last: ${type}`;
          isDisqualified = true;
        }

        await userDoc.save();
      }

      await Violation.create({
        userId: user._id || user.id,
        username: user.username,
        type,
        details: details || '',
        currentViolationsCount: currentCount
      });
    } else {
      const memUser = memoryUsers.get(user._id || user.id);
      if (memUser) {
        memUser.violationsCount = (memUser.violationsCount || 0) + 1;
        currentCount = memUser.violationsCount;

        if (memUser.violationsCount >= 5) {
          memUser.isDisqualified = true;
          memUser.status = 'disqualified';
          memUser.disqualificationReason = `Exceeded anti-cheat limit (5 violations). Last: ${type}`;
          isDisqualified = true;
        }
      }

      const vRecord = {
        _id: 'viol_' + Date.now(),
        userId: user._id || user.id,
        username: user.username,
        type,
        details: details || '',
        currentViolationsCount: currentCount,
        timestamp: new Date()
      };
      memoryViolations.unshift(vRecord);
    }

    // Broadcast violation event via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('violation:logged', {
        userId: user._id || user.id,
        username: user.username,
        type,
        details,
        currentViolationsCount: currentCount,
        isDisqualified
      });
    }

    return res.json({
      success: true,
      currentViolationsCount: currentCount,
      isDisqualified
    });
  } catch (error) {
    console.error('Log Violation Error:', error);
    res.status(500).json({ message: 'Error logging anti-cheat violation' });
  }
};

/**
 * @route GET /api/admin/violations
 */
const getViolationsList = async (req, res) => {
  try {
    if (!getIsMockMode()) {
      const violations = await Violation.find().sort({ timestamp: -1 }).limit(100);
      return res.json(violations);
    } else {
      return res.json(memoryViolations.slice(0, 100));
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching violations log' });
  }
};

/**
 * @route GET /api/admin/export
 * Exports contest results for CSV/JSON download
 */
const exportResults = async (req, res) => {
  try {
    let participants = [];
    if (!getIsMockMode()) {
      participants = await User.find({ role: 'participant' }).select('-password').sort({ score: -1 });
    } else {
      participants = Array.from(memoryUsers.values())
        .filter(u => u.role === 'participant')
        .sort((a, b) => b.score - a.score);
    }

    const formattedData = participants.map((p, idx) => ({
      rank: idx + 1,
      username: p.username,
      email: p.email,
      collegeOrOrg: p.collegeOrOrg,
      score: p.score,
      questionsSolved: p.questionsSolved ? p.questionsSolved.length : 0,
      violationsCount: p.violationsCount || 0,
      status: p.status || 'idle',
      isDisqualified: p.isDisqualified ? 'YES' : 'NO'
    }));

    return res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting results' });
  }
};

module.exports = { getDashboardStats, getParticipants, logViolation, getViolationsList, exportResults, memoryViolations };
