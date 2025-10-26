// filepath: controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // Generate salt and hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        permissions: ['read:member'],
        accountStatus: 'pending'
      });

      // Send verification email
      await AuthController.sendVerificationEmail(user);
      
      res.status(201).json({
        message: 'Registration successful. Please check your email to verify account.'
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username }).select('+password');
      
      if (!user || user.accountStatus !== 'active') {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await user.validatePassword(password);
      if (!isValid) {
        await AuthController.handleFailedLogin(user);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          id: user._id,
          permissions: user.permissions
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token, permissions: user.permissions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;