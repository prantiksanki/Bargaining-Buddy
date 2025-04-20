const express = require("express");
const { searchProducts, scrapeProductById } = require("../helpers/scraper");

const router = express.Router();

router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing 'q' parameter" });

  console.log("Search Query:", query);

  try {
    const results = await searchProducts(query); // This will also store UUID:URL mapping internally
    res.json(results); // [{ id, title, image }]
  } catch (err) {
    console.error("Search Error:", err.message);
    res.status(500).json({ error: "[INTERNAL_API_ERROR] Search failed | retry Searching for product", details: err.message });
  }
});

router.get("/scrape", async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "[MISSING-PARAM_API_ERROR] Missing 'id' parameter" });

    try {
        const productDetails = await scrapeProductById(id);
        res.json(productDetails);
    } catch (err) {
        console.error("Scrape Error:", err.message);
        res.status(500).json({ 
            error: "[INTERNAL_API_ERROR] Scraping failed. Please refresh and try again.", 
            details: err.message 
        });
    }
});

module.exports = router;