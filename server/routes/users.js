// ...new file...
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// PUT /api/users/update
router.put('/update', userController.updateProfile);

module.exports = router;