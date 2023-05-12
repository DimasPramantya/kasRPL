const express = require('express');
const { getPaymentsData, postBill, verifyUserPayment } = require('../controllers/admin');

const router = express.Router();

router.get("/dashboard", getPaymentsData);

router.post("/create-bill", postBill);

router.put("/verify-payment/:id", verifyUserPayment);

module.exports = router;