const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


router.post('/register', async (req, res) => {
  const { name, dob, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, dob, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
});

module.exports = router;
