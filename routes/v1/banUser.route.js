// external import 
const express = require("express");

// internal import
const router = express.Router();
const banUserController = require("../../controllers/v1/banUser.controller");
const verifyToken = require("../../middleware/verifyToken.middleware");


router.get("/ban-user", banUserController.getBanUser);
router.post("/ban-user", verifyToken(), banUserController.postBanUser);
router.delete("/ban-user/:userEmail", verifyToken(), banUserController.deleteBanUser);

module.exports = router;