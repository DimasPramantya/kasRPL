const express = require('express');
const { getPaymentsData, postBill, verifyUserPayment, getUserPayment } = require('../controllers/admin');

const router = express.Router();

router.get("/dashboard", getPaymentsData);

router.post("/create-bill", postBill);

router.get("/get-payment/:paymentId", getUserPayment);

router.put("/verify-payment/:paymentId", verifyUserPayment);

module.exports = router;