const express = require("express");
const router = express.Router();
const productHelper = require("../helpers/productHelper");

// Product Routes
router.get("/", productHelper.getAllProducts);
router.get("/:id", productHelper.getProductById);
router.post("/", productHelper.addProduct);
router.put("/:id", productHelper.updateProduct);
router.delete("/:id", productHelper.deleteProduct);

module.exports = router;
