const express = require('express');
const { getPaymentsData, postBill } = require('../controllers/admin');

const router = express.Router();

router.get("/dashboard", getPaymentsData);

router.post("/create-bill", postBill)

module.exports = router;