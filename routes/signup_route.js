const express = require('express');
const router = express.Router();
const authController = require('../controllers/signup');

router.post('/signup', authController.validateSignup, authController.signup);

module.exports = router;
