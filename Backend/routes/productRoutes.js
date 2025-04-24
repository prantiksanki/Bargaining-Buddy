// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productHelper = require("../helpers/productHelper");
const { scrapeProductById } = require("../helpers/scraper"); // Adjust path if needed
const RecentSearch = require("../models/recentSearches"); // Adjust path if needed
const Product = require("../models/product"); // Adjust path if needed

// --- Specific Routes First ---

// Route for getting recent searches (Must be before /:id)
router.get("/recent-searches", productHelper.getRecentSearches);

// Example route to get product details AND log recent search (Must be before /:id)
// Ensure this uses scrapeProductById and logs the search
router.get("/details/:id", async (req, res) => {
    const productId = req.params.id;
    try {
        // Optional: Quick check for valid ID format before DB call
        if (!mongoose.Types.ObjectId.isValid(productId)) {
             return res.status(400).json({ message: "Invalid product ID format" });
        }
        const exists = await Product.findById(productId).select('_id');
        if (!exists) {
            return res.status(404).json({ message: "Product not found" });
        }
        const productDetails = await scrapeProductById(productId);
        if (productDetails && productDetails._id) {
            try {
                const recent = new RecentSearch({ productId: productDetails._id });
                await recent.save();
                console.log(`Logged recent search for product ID: ${productId}`);
            } catch (logError) {
                console.error(`Failed to log recent search for product ${productId}:`, logError);
            }
        }
        res.json(productDetails);
    } catch (error) {
        console.error(`Error in route /details/${productId}:`, error);
        if (error.message.includes("not found")) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes("Invalid Product ID")) {
             res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Server error fetching product details" });
        }
    }
});


// --- General Routes Last ---

// Get a single product by ID (fetches from DB only, no scrape)
// This will now only match valid ObjectIDs that weren't caught by /details/:id or /recent-searches
router.get("/:id", productHelper.getProductById);

// Get all products
router.get("/", productHelper.getAllProducts);

// --- Other Routes ---
router.post("/", productHelper.addProduct); // Consider if needed
router.put("/:id", productHelper.updateProduct); // Consider if needed
router.delete("/:id", productHelper.deleteProduct);

// You need to import mongoose at the top if using mongoose.Types.ObjectId.isValid
const mongoose = require('mongoose');

module.exports = router;