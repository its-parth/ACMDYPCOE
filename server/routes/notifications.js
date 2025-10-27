const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationsController');

// OPTIONAL: require auth middleware if needed
// const { authenticate } = require('../middleware/auth');

router.get('/', /* authenticate, */ controller.getNotifications);
router.get('/:id', /* authenticate, */ controller.getNotification);
router.post('/', /* authenticate, */ controller.createNotification);
router.put('/:id', /* authenticate, */ controller.updateNotification);
router.delete('/:id', /* authenticate, */ controller.deleteNotification);

module.exports = router;