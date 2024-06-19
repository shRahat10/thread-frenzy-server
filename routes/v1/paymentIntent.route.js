// external import 
const express = require("express");

// internal import
const router = express.Router();
const paymentIntentController = require("../../controllers/v1/paymentIntent.controller");

router.post("/create-payment-intent", paymentIntentController.createPaymentIntent);

module.exports = router;