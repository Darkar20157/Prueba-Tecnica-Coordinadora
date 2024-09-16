const express = require('express');
const router = express.Router();
const EventController = require('../controllers/events_controller');

router.get('/getAllEvents', EventController.getAllEvents);
router.get('/getEvent', EventController.getEvent);
router.post('/saveEvent', EventController.saveEvent);
router.delete('/deleteEvent/:id', EventController.deleteEvent);

module.exports = router;