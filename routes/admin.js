const express = require('express');
const { getPaymentsData } = require('../controllers/admin');

const router = express.Router();

router.get("/dashboard", getPaymentsData);

module.exports = router;