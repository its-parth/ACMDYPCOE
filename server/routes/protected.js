const express = require('express');
const { authenticate, authorizeRole } = require('../middleware/auth');
const router = express.Router();

router.get('/admin', authenticate, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

router.get('/member', authenticate, authorizeRole('member'), (req, res) => {
  res.json({ message: 'Welcome, member!' });
});

module.exports = router;