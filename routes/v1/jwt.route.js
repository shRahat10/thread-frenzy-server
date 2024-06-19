// external import 
const express = require("express");

// internal import
const router = express.Router();
const jwtController = require("../../controllers/v1/jwt.controller");

router.post("/jwt", jwtController.createToken);
router.post("/logout", jwtController.jwtLogout);

module.exports = router;