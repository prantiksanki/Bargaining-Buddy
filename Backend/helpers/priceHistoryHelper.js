const PriceHistory = require("../models/priceHistory");

// Get price history for a product
exports.getPriceHistory = async (req, res) => {
    try {
        const history = await PriceHistory.find({ product_id: req.params.productId }).sort({ timestamp: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get the latest price for a products
exports.addPriceRecord = async (req, res) => {
    try {
        const newPriceRecord = new PriceHistory(req.body);
        await newPriceRecord.save();
        res.status(201).json(newPriceRecord);
    } catch (err) {
        res.status(400).json({ message: "Error adding price record" });
    }
};
