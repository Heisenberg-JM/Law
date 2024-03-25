const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/protected', checkAuth,async (req, res) => {
    const userData = await User.findById(req.userData.userId).select('-password');
res.json({ message: 'You are authenticated', userData });
  });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, aadhar, password,userType } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, aadhar, password: hashedPassword , userType});
    const userdetails = await newUser.save();
    
    res.status(201).json({ message: 'User created successfully' , userdetails});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true })
    // Only return userId and userType
    res.status(200).json({ 
      token,
      userId: user._id,
      userType: user.userType 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  });
module.exports = router;