const express = require('express');
const { userRegisterHandler, userLoginHandler, getUserDataHandler, userGetTheBillHandler, userPayTheBillHandler } = require('../controllers/user');

const router = express.Router();

router.post('/register', userRegisterHandler)

router.post('/login', userLoginHandler);

router.get('/', getUserDataHandler);

router.get('/pay-bill/:billId', userGetTheBillHandler);

router.put('/pay-bill/:billId', userPayTheBillHandler);

module.exports = router;