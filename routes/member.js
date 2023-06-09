const express = require('express');
const { userRegisterHandler, userLoginHandler, getUserDataHandler, userGetTheBillHandler, userPayTheBillHandler, userRepayTheBillHandler } = require('../controllers/user');

const router = express.Router();

router.post('/register', userRegisterHandler)

router.post('/login', userLoginHandler);

router.get('/', getUserDataHandler);

router.get('/pay-bill/:billId', userGetTheBillHandler);

router.put('/pay-bill/:billId', userPayTheBillHandler);

router.put('/repay-bill/:billId', userRepayTheBillHandler);

module.exports = router;