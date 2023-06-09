const express = require('express');
const { getAdminDashboard, postBill, verifyUserPayment, getUserPayment, getAllEventHandler, getEventHandler, postCreateEventHandler, postEventExpenditure, postFundIncome, getAllCashData } = require('../controllers/admin');

const router = express.Router();

router.get("/dashboard", getAdminDashboard);

router.post("/create-bill", postBill);

router.get("/get-payment/:paymentId", getUserPayment);

router.put("/verify-payment/:paymentId", verifyUserPayment);

router.get("/events", getAllEventHandler);

router.get("/event/:eventId", getEventHandler);

router.post("/create-event", postCreateEventHandler);

router.post("/event/create-expenditure/:eventId", postEventExpenditure);

router.post("/create-fund-income", postFundIncome);

router.get("/get-all-cash-data", getAllCashData)

module.exports = router;