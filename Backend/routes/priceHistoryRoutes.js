const express = require("express");
const router = express.Router();
const priceHistoryHelper = require("../helpers/priceHistoryHelper");

// Price History Routes
router.get("/:productId", priceHistoryHelper.getPriceHistory);
router.post("/", priceHistoryHelper.addPriceRecord);

module.exports = router;