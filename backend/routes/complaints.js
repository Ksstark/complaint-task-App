const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Create Complaint
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, department, priority } = req.body;
    const complaint = new Complaint({
      title,
      description,
      department,
      priority: priority || 'medium',
      user: req.user.id,
    });
    await complaint.save();
    // Log creation
    const logMsg = `[${new Date().toISOString()}] COMPLAINT CREATED: ${complaint.title} (${complaint.priority} priority) by user ${req.user.username}\n`;
    fs.appendFileSync(path.join(__dirname, '../log.txt'), logMsg);
    res.status(201).json(complaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Complaints
router.get('/', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'username email');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Complaint (status or content)
router.put('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    const prevStatus = complaint.status;
    Object.assign(complaint, req.body);
    await complaint.save();
    // Log status update
    if (req.body.status && req.body.status !== prevStatus) {
      const logMsg = `[${new Date().toISOString()}] STATUS UPDATE: Complaint ${complaint._id} status changed from ${prevStatus} to ${req.body.status}\n`;
      fs.appendFileSync(path.join(__dirname, '../log.txt'), logMsg);
    }
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Complaint
router.delete('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 