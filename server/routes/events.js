const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// Optional: add authenticate middleware similar to other routes
// const { authenticate } = require('../middleware/auth');

router.get('/', /* authenticate, */ eventsController.getEvents);
router.get('/:id', /* authenticate, */ eventsController.getEvent);
router.post('/', /* authenticate, */ eventsController.createEvent);
router.put('/:id', /* authenticate, */ eventsController.updateEvent);
router.delete('/:id', /* authenticate, */ eventsController.deleteEvent);

module.exports = router;