// external import 
const express = require("express");

// internal import
const router = express.Router();
const tshirtController = require("../../controllers/v1/tshirt.controller");
const verifyToken = require("../../middleware/verifyToken.middleware");

router.get("/t-shirt-all", tshirtController.getAllTshirt);
router.get("/t-shirt", tshirtController.getTshirt);
router.get("/t-shirt/:gender", tshirtController.getGenderSpecificTshirt);
router.get("/t-shirt/similar-products/:brand", tshirtController.getSimilarTshirt);
router.get("/t-shirt/single-product/:id", verifyToken(), tshirtController.getSingleTshirt);
router.post("/t-shirt", verifyToken('admin'), tshirtController.postTshirt);
router.put("/t-shirt/:id", verifyToken(), tshirtController.putTshirt);
router.delete("/t-shirt/:id", verifyToken('admin'), tshirtController.deleteTshirt);

module.exports = router;