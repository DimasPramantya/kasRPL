const express = require('express');
const { userRegisterHandler } = require('../controllers/user');

const router = express.Router();

router.post('/register', userRegisterHandler)

router.post('/login');

module.exports = router;