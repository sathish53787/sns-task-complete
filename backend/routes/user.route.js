const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); 
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {

    const { firstName, lastName, email, phone, role, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !role || !password) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        title: 'Email already registered',
        error: 'The provided email is already associated with an existing account.',
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    try {
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            role,
            password: hashedPassword,

        });

        await newUser.save();
        res.status(201).json({ status: 'saved' });
    } catch (error) {
        console.error('Error saving user detail:', error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'An error occurred while saving user details' });
        }
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.status(200).json({ status: 'success', message: 'Login successful', user });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 'error', message: 'An error occurred during login' });
    }
});

router.get('/users', async (req, res) => {
    try {
      const userRole = req.query['role']; // Adjust as needed
  
      if (userRole != "Admin") {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
      }  
      const users = await User.find({}, { password: 0 }); // Exclude password field from results
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ status: 'error', message: 'An error occurred' });
    }
});


module.exports = router;