const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_controller');

router.get('/getAllUsers', UserController.getAllUsers);
router.get('/getUser', UserController.getUser);
router.post('/saveUsers', UserController.saveUser);

module.exports = router;