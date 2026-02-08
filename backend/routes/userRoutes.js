const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/users', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ id: user._id, username: user.username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username/password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username/password' });
    }

    if (user.token) {
      return res.status(403).json({ error: 'User is already logged in on another device.' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    user.token = token;
    await user.save();

    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout user
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password -token');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
