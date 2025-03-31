const express = require("express");
const { scrapeProductPrices } = require("../helpers/scraper.js");

const router = express.Router();

router.get("/scrape/:query", async (req, res) => {
    const { query } = req.params;
    const data = await scrapeProductPrices(query);
    console.log("Scraped data:", data); // Log the scraped data for debugging
    if (data.length === 0) {
        return res.status(500).json({ error: "Failed to scrape data" });
    }
    res.json(data);
});

module.exports = router;
