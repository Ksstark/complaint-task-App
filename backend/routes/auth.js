const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role, name: user.username }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    // Log login
    const logMsg = `[${new Date().toISOString()}] LOGIN: User ${user.email} logged in\n`;
    fs.appendFileSync(path.join(__dirname, '../log.txt'), logMsg);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { email } = req.body;
    // Log logout
    const logMsg = `[${new Date().toISOString()}] LOGOUT: User ${email} logged out\n`;
    fs.appendFileSync(path.join(__dirname, '../log.txt'), logMsg);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 