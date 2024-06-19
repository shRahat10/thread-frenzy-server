// external import 
const express = require("express");

// internal import
const router = express.Router();
const userController = require("../../controllers/v1/user.controller");
const verifyToken = require("../../middleware/verifyToken.middleware");

router.get("/user-all", userController.getAllUser);
router.get("/user-specific", verifyToken('admin'), userController.getSpecificUsers);
router.get("/user/:userEmail", verifyToken(), userController.getSingleUser);
router.post("/user", userController.postUser);
router.patch("/user/:id", verifyToken(), userController.patchUser);
router.delete("/user/:id", verifyToken('admin'), userController.deleteUser);

module.exports = router;