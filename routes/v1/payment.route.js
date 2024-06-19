// external import 
const express = require("express");

// internal import
const router = express.Router();
const paymentController = require("../../controllers/v1/payment.controller");
const verifyToken = require("../../middleware/verifyToken.middleware");

router.get("/payment-all", verifyToken('admin'), paymentController.getAllPayment);
router.get("/payment", verifyToken('admin'), paymentController.getPayment);
router.get("/payment/:email", verifyToken(), paymentController.getSingleUserPayment);
router.post("/payment", verifyToken(), paymentController.postPayment);
router.put("/payment/:id", verifyToken('admin'), verifyToken(), paymentController.putPayment);

module.exports = router;