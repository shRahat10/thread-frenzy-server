// external import 
const express = require("express");

// internal import
const router = express.Router();
const cartController = require("../../controllers/v1/cart.controller");
const verifyToken = require("../../middleware/verifyToken.middleware");

router.get("/cart", verifyToken(), cartController.getAllCart);
router.get("/cart/:userEmail", verifyToken(), cartController.getSingleUserCart);
router.post("/cart", verifyToken(), cartController.postCart);
router.put("/cart/:id", verifyToken(), cartController.putCart);
router.delete("/cart/:id", verifyToken(), cartController.deleteSingleCart);
router.delete("/cart", verifyToken(), cartController.deleteManyCart);

module.exports = router;