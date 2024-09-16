const express = require('express');
const router = express.Router();
const EventController = require('../controllers/events_controller');

router.get('/getAllEvents', EventController.getAllEvents);
router.get('/getEvent', EventController.getEvent);
router.post('/saveEvent', EventController.saveEvent);

module.exports = router;