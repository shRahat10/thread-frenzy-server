// external import 
const express = require("express");

// internal import
const router = express.Router();
const wishlistController = require("../../controllers/v1/wishlist.controller");
const verifyToken = require("../../middleware/verifyToken.middleware");

router.get("/wishlist-all/:userId", verifyToken(), wishlistController.getAllWishlist);
router.get("/wishlist/:userId", verifyToken(), wishlistController.getUserWishlist);
router.post("/wishlist", verifyToken(), wishlistController.postWishlist);
router.delete("/wishlist/:id", verifyToken(), wishlistController.deleteWishlist);

module.exports = router;