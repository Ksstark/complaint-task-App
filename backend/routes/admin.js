const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Middleware to check admin role
function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
}

// GET /admin/reports
router.get('/reports', auth, adminOnly, async (req, res) => {
  try {
    // Total complaints
    const totalComplaints = await Complaint.countDocuments();

    // Complaint count by status
    const statusCounts = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Complaint count by department
    const departmentCounts = await Complaint.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Complaint count by priority
    const priorityCounts = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Most active users (by number of complaints)
    const activeUsers = await Complaint.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    // Populate user info
    const users = await User.find({ _id: { $in: activeUsers.map(u => u._id) } }, 'username email');
    const mostActiveUsers = activeUsers.map(u => {
      const user = users.find(us => us._id.equals(u._id));
      return { user: user ? { username: user.username, email: user.email } : u._id, count: u.count };
    });

    // Recent log entries (last 10 lines)
    const logPath = path.join(__dirname, '../log.txt');
    let recentLogs = [];
    if (fs.existsSync(logPath)) {
      const logs = fs.readFileSync(logPath, 'utf-8').trim().split('\n');
      recentLogs = logs.slice(-10);
    }

    res.json({
      totalComplaints,
      statusCounts,
      departmentCounts,
      priorityCounts,
      mostActiveUsers,
      recentLogs
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 