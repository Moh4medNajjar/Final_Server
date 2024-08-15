const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // Check if paths and methods are correct

router.post('/register', register);

router.post('/login', login); 

module.exports = router;
