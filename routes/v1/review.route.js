// external import 
const express = require("express");

// internal import
const router = express.Router();
const reviewController = require("../../controllers/v1/review.controller");
const verifyToken = require("../../middleware/verifyToken.middleware");

router.get("/review-all/:productId", reviewController.getAllReview);
router.get("/review/:productId", reviewController.getSingleProductReview);
router.post("/review", verifyToken('admin'), reviewController.postReview);
router.put("/review/:id", verifyToken('admin'), reviewController.putReview);
router.delete("/review/:id", verifyToken('admin'), reviewController.deleteReview);

module.exports = router;