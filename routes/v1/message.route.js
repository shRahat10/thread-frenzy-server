// external import 
const express = require("express");

// internal import
const router = express.Router();
const messageController = require("../../controllers/v1/message.controller");
const verifyToken = require("../../middleware/verifyToken.middleware");

router.get("/contact-us", verifyToken('admin'), messageController.getMessage);
router.post("/contact-us", messageController.postMessage);

module.exports = router;