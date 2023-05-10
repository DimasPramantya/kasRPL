const express = require('express');
const { userRegisterHandler, userLoginHandler } = require('../controllers/user');

const router = express.Router();

router.post('/register', userRegisterHandler)

router.post('/login', userLoginHandler);

module.exports = router;