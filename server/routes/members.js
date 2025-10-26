const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');

// OPTIONAL: protect routes with your auth middleware
// const { authenticate } = require('../middleware/auth');

// Public read (adjust to authenticate if needed)
router.get('/', /* authenticate, */ membersController.getMembers);
router.get('/:id', /* authenticate, */ membersController.getMember);

// Admin-only or authenticated for create/update/delete
router.post('/', /* authenticate, */ membersController.createMember);
router.put('/:id', /* authenticate, */ membersController.updateMember);
router.delete('/:id', /* authenticate, */ membersController.deleteMember);

module.exports = router;