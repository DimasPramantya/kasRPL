const express = require('express');
const { userRegisterHandler, userLoginHandler, getUserDataHandler } = require('../controllers/user');

const router = express.Router();

router.post('/register', userRegisterHandler)

router.post('/login', userLoginHandler);

router.get('/', getUserDataHandler)

module.exports = router;