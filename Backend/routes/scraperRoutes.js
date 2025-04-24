const express = require("express");
const { searchProducts, scrapeProductById } = require("../helpers/scraper");
const RecentSearch = require("../models/recentSearches");
const Product = require("../models/product");
const mongoose = require('mongoose');

const router = express.Router();
const CACHE_DURATION_MILLISECONDS = 4 * 60 * 60 * 1000;

router.get("/search", async (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sort || 'relevance';
  const categoryFilter = req.query.category;
  const minPriceFilter = parseFloat(req.query.minPrice);
  const maxPriceFilter = parseFloat(req.query.maxPrice);

  if (!query) {
    return res.status(400).json({ error: "Missing 'q' parameter" });
  }

  console.log(`Search: "${query}", Page: ${page}, Limit: ${limit}, Sort: ${sortBy}, Category: ${categoryFilter}, MinPrice: ${minPriceFilter}, MaxPrice: ${maxPriceFilter}`);

  try {
    let dbFilter = { $text: { $search: query } };

    if (categoryFilter) {
      dbFilter.category = categoryFilter;
    }

    let priceFilter = {};
    if (!isNaN(minPriceFilter) && minPriceFilter >= 0) {
      priceFilter.$gte = minPriceFilter;
    }
    if (!isNaN(maxPriceFilter) && maxPriceFilter > 0) {
      priceFilter.$lte = maxPriceFilter;
    }
    if (Object.keys(priceFilter).length > 0) {
       dbFilter.lastSeenPrice = priceFilter;
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions = { lastSeenPrice: 1 };
        break;
      case 'price_desc':
        sortOptions = { lastSeenPrice: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'relevance':
      default:
        sortOptions = { score: { $meta: "textScore" } };
        break;
    }

    const totalResults = await Product.countDocuments(dbFilter);
    const totalPages = Math.ceil(totalResults / limit);

    const projection = {
      _id: 1, title: 1, image: 1, category: 1, lastSeenPrice: 1, createdAt: 1
    };
    if (sortBy === 'relevance') {
      projection.score = { $meta: "textScore" };
    }

    const dbResults = await Product.find(dbFilter, sortBy === 'relevance' ? { score: { $meta: "textScore" } } : null)
      .select(projection)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const noFiltersApplied = !categoryFilter && isNaN(minPriceFilter) && isNaN(maxPriceFilter);
    if (page === 1 && dbResults.length === 0 && totalResults === 0 && noFiltersApplied) {
      console.log(`DB Search for "${query}" found 0 results (no filters). Falling back to live scrape...`);
      const scrapedResults = await searchProducts(query);
      const limitedScrapedResults = scrapedResults.slice(0, limit);
      console.log(`Live scrape for "${query}" returned ${limitedScrapedResults.length}/${scrapedResults.length} results.`);
      return res.json({
        results: limitedScrapedResults,
        currentPage: 1,
        totalPages: Math.ceil(scrapedResults.length / limit),
        totalResults: scrapedResults.length,
        source: 'scrape-fallback'
      });
    }

    const formattedDbResults = dbResults.map(product => ({
       id: product._id,
       title: product.title,
       image: product.image,
       price: product.lastSeenPrice !== null && product.lastSeenPrice !== undefined ? product.lastSeenPrice : 'N/A',
       category: product.category
    }));

    console.log(`Serving search results for "${query}" (Page ${page}) from DB.`);
    return res.json({
      results: formattedDbResults,
      currentPage: page,
      totalPages: totalPages,
      totalResults: totalResults,
      source: 'db'
    });

  } catch (err) {
    console.error(`Error during search process for "${query}" (Page ${page}):`, err);
    if (err.message.includes('Text index required') || err.code === 2) {
       return res.status(500).json({ error: "[CONFIG_ERROR] Text index or sort issue.", details: err.message });
    }
    return res.status(500).json({ error: "[INTERNAL_ERROR] Search process failed.", details: err.message });
  }
});

router.get("/scrape", async (req, res) => {
  const id = req.query.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "[INVALID_PARAM_API_ERROR] Invalid or missing 'id' parameter" });
  }
  let productDetails;
  let source = 'cache';
  try {
    const productFromDb = await Product.findById(id);
    if (!productFromDb) {
      return res.status(404).json({ error: "[NOT_FOUND_API_ERROR] Product not found in database." });
    }
    const now = Date.now();
    const lastScanTime = (productFromDb.lastScanSuccess && productFromDb.lastScanAttempt)
               ? new Date(productFromDb.lastScanAttempt).getTime()
               : new Date(productFromDb.updatedAt).getTime();
    const isDataStale = (now - lastScanTime) > CACHE_DURATION_MILLISECONDS;
    const isDataInvalid = !productFromDb.prices || productFromDb.prices.length === 0 || !productFromDb.lastScanSuccess;
    if (isDataStale || isDataInvalid) {
      console.log(`Cache stale or invalid for product ${id}. Re-scraping...`);
      source = 'scrape';
      productDetails = await scrapeProductById(id);
      if (!productDetails) {
         console.error(`Scraping failed for product ${id}. Serving potentially stale data from DB as fallback.`);
         productDetails = productFromDb;
         source = 'stale-fallback';
      }
    } else {
      console.log(`Cache hit for product ${id}. Serving from DB.`);
      productDetails = productFromDb;
      source = 'cache';
    }
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
