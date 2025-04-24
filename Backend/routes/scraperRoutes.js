const express = require("express");
const { scrapeProductById } = require("../helpers/scraper");
const RecentSearch = require("../models/recentSearches"); 
const Product = require("../models/product"); 
const mongoose = require('mongoose');

const router = express.Router();

// Define cache duration for scrape route
const CACHE_DURATION_MILLISECONDS = 4 * 60 * 60 * 1000; // 4 hours

// --- /search route --- (MODIFIED TO SEARCH LOCAL DATABASE)
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Missing 'q' parameter" });
  }

  console.log(`DB Search Query Received: "${query}"`);

  try {
    // Perform a text search on the indexed fields (title, category)
    // Project only the fields needed for the search results page
    // Sort by text score for relevance
    // Limit the number of results
    const dbResults = await Product.find(
        { $text: { $search: query } }, // The text search query
        { score: { $meta: "textScore" } } // Include relevance score
      )
      .select({ // Select only necessary fields
          _id: 1,
          title: 1,
          image: 1,
          category: 1,
          lastSeenPrice: 1, // Use this as the price heuristic for search results
          score: { $meta: "textScore" } // Need score for sorting
      })
      .sort({ score: { $meta: "textScore" } }) // Sort by relevance
      .limit(50) // Limit results (adjust as needed)
      .lean(); // Use lean() for faster read-only queries

    // Format results to match the frontend expectation { id, title, image, price, category }
    const formattedResults = dbResults.map(product => ({
        id: product._id, // Use MongoDB _id as id
        title: product.title,
        image: product.image,
        // Use lastSeenPrice if available, otherwise indicate price isn't readily available for search result
        price: product.lastSeenPrice !== null && product.lastSeenPrice !== undefined ? product.lastSeenPrice : 'N/A',
        category: product.category
    }));

    console.log(`DB Search for "${query}" returned ${formattedResults.length} results.`);
    res.json(formattedResults);

  } catch (err) {
    console.error("Database Search Error:", err);
    // Handle potential errors like invalid text search syntax or DB connection issues
    res.status(500).json({ error: "[INTERNAL_DB_ERROR] Database search failed.", details: err.message });
  }
});


// --- /scrape route --- (Includes caching logic)
router.get("/scrape", async (req, res) => {
    const id = req.query.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "[INVALID_PARAM_API_ERROR] Invalid or missing 'id' parameter" });
    }

    let productDetails;
    let source = 'cache';

    try {
        // 1. Fetch product from DB
        const productFromDb = await Product.findById(id);
        if (!productFromDb) {
            return res.status(404).json({ error: "[NOT_FOUND_API_ERROR] Product not found in database." });
        }

        // 2. Check cache freshness/validity
        const now = Date.now();
        const lastScanTime = (productFromDb.lastScanSuccess && productFromDb.lastScanAttempt)
                             ? new Date(productFromDb.lastScanAttempt).getTime()
                             : new Date(productFromDb.updatedAt).getTime();
        const isDataStale = (now - lastScanTime) > CACHE_DURATION_MILLISECONDS;
        const isDataInvalid = !productFromDb.prices || productFromDb.prices.length === 0 || !productFromDb.lastScanSuccess;

        // 3. Decide: scrape or use cache
        if (isDataStale || isDataInvalid) {
            console.log(`Cache stale or invalid for product ${id}. Re-scraping...`);
            source = 'scrape';
            productDetails = await scrapeProductById(id); // Scrapes & updates DB
            if (!productDetails) {
                 console.error(`Scraping failed for product ${id}. Serving potentially stale data from DB as fallback.`);
                 productDetails = productFromDb; // Fallback to DB data
                 source = 'stale-fallback';
            }
        } else {
            console.log(`Cache hit for product ${id}. Serving from DB.`);
            productDetails = productFromDb; // Use cached data
            source = 'cache';
        }

        // 4. Log recent search
        if (productDetails && productDetails._id) {
            try {
                const recent = new RecentSearch({ productId: productDetails._id });
                await recent.save();
                console.log(`Logged recent search for product ID: ${productDetails._id} (Source: ${source})`);
            } catch (logError) {
                console.error(`Failed to log recent search for product ${id}:`, logError);
            }
        } else {
             console.warn(`Recent search not logged for ID ${id} because productDetails were invalid or missing after check/scrape.`);
        }

        // 5. Send response
        res.json(productDetails);

    } catch (err) {
        console.error(`Error in /scrape endpoint for ID ${id}:`, err.message);
        return res.status(500).json({
            error: "[INTERNAL_API_ERROR] Failed to retrieve product details.",
            details: err.message
        });
    }
});

module.exports = router;