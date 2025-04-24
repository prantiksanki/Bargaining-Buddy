// helpers/scraper.js
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const Product = require("../models/product"); // Import Product model
const mongoose = require("mongoose"); // Import mongoose if needed for ObjectId checks etc.

puppeteer.use(StealthPlugin());

// No longer need productMap
// const productMap = {}; // Maps internal productId -> Xerve URL  <- REMOVE THIS

async function searchProducts(query) {
  console.log(`Searching for: ${query}`);
  const browser = await puppeteer.launch({
    headless: true, // Keep headless true for production/efficiency
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `https://www.xerve.in/prices?q=${encodedQuery}`;

  try {
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

    // --- CAPTCHA/Start Button handling (keep as is) ---
    const recaptchaButton = await page.$(".g-recaptcha");
    if (recaptchaButton) {
      await page.reload({ waitUntil: "domcontentloaded" });
    } else {
      const startButton = await page.$x(
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'start')]"
      );
      if (startButton.length > 0) {
        await startButton[0].click();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Use Promise for await
        await page.reload({ waitUntil: "domcontentloaded" });
      }
    }
    // --- End CAPTCHA/Start Button handling ---


    // --- Smart Scroll (keep as is) ---
    await page.evaluate(async () => {
      let lastHeight = document.body.scrollHeight;
      let sameCount = 0;
      while (sameCount < 3) {
        window.scrollBy(0, 400);
        await new Promise((resolve) => setTimeout(resolve, 250)); // Slightly longer wait might be stabler
        const newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight) {
          sameCount++;
        } else {
          sameCount = 0;
          lastHeight = newHeight;
        }
      }
    });
    // --- End Smart Scroll ---

    // Wait for product tiles
    try {
        await page.waitForSelector("._tile_container", { timeout: 15000 }); // Increased timeout
    } catch(err) {
        console.error("Could not find product tiles after scroll and wait.");
        await browser.close();
        return []; // Return empty if no products found
    }


    // --- Extract product data (Modified) ---
    let scrapedProducts = await page.evaluate(() => {
      const quoteNodes = document.querySelectorAll("._tile_container");
      return Array.from(quoteNodes)
        .map((quote) => {
          const linkElement = quote.querySelector("a");
          const xerveLink = linkElement ? `https://www.xerve.in${linkElement.getAttribute("href")}` : null;
          const title = quote.querySelector("h3")?.innerText?.trim();
          const priceText = quote
            .querySelector("h4")
            ?.innerText?.trim()
            .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width spaces
            .replace(/\s+/g, " ");

          const imgElement = quote.querySelector("img");
          const image = imgElement?.getAttribute("src");

          // Basic price extraction (just the first number found)
          const priceMatch = priceText ? priceText.match(/₹?\s*([\d,]+)/) : null;
          const initialPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, "")) : null;


          function inferBroadCategory(title) {
              if (!title) return "Miscellaneous";
              const lower = title.toLowerCase();
              if (/(shirt|hoodie|jeans|t-shirt|kurta|dress|saree)/.test(lower)) return "Fashion";
              if (/(headphone|phone|mobile|laptop|earbud|watch|camera|tv|speaker)/.test(lower)) return "Electronics";
              if (/(sofa|mug|utensil|bedsheet|lamp|decor)/.test(lower)) return "Home & Kitchen";
              if (/(makeup|lipstick|skincare|foundation|perfume|fragrance)/.test(lower)) return "Beauty";
              if (/(book|novel|pen|notebook)/.test(lower)) return "Books & Stationary";
              if (/(toy|game|puzzle)/.test(lower)) return "Toys & Games";
              return "Miscellaneous";
          }

          const category = title ? inferBroadCategory(title) : "Miscellaneous";

          // Only return if essential data is present and it's not a placeholder image
          if (xerveLink && title && image && !image.endsWith("rsz_blank_grey.jpg")) {
              return { xerveLink, title, initialPrice, category, image };
          }
          return null; // Exclude invalid items
        })
        .filter(item => item !== null); // Filter out null entries
    });
    // --- End Extract product data ---

    console.log(`Scraped ${scrapedProducts.length} potential products from page.`);

    // --- Save/Update products in MongoDB ---
    const productsForResponse = [];
    for (const p of scrapedProducts) {
        try {
            // Use findOneAndUpdate with upsert: true. Match based on the unique Xerve link.
            const updatedOrNewProduct = await Product.findOneAndUpdate(
                { xerveLink: p.xerveLink }, // Query condition
                { // Data to set on match or insert on no match
                    $set: {
                        title: p.title,
                        image: p.image,
                        category: p.category,
                        // Only set initialPrice if it hasn't been set before, or if this one is valid
                        // Or, always update with the latest seen price on the search page
                        lastSeenPrice: p.initialPrice, // Maybe rename field in schema?
                        xerveLink: p.xerveLink, // Ensure link is stored
                        lastScannedSearch: new Date(), // Track when it was last seen in search results
                    },
                    $setOnInsert: {
                        // Fields to set only when creating the document
                        lowestPrice: p.initialPrice, // Set initial lowest price heuristic
                        highestPrice: p.initialPrice, // Set initial highest price heuristic
                        prices: [], // Initialize prices array
                        priceHistory: p.initialPrice ? [{ price: p.initialPrice, date: new Date() }] : [] // Initialize history
                    }
                },
                {
                    new: true, // Return the modified document
                    upsert: true, // Create if doesn't exist
                    setDefaultsOnInsert: true // Apply schema defaults on insert
                }
            );
             // Prepare the object to be returned in the API response
             // Only include fields needed for the search result list
            productsForResponse.push({
                id: updatedOrNewProduct._id, // Use MongoDB _id
                title: updatedOrNewProduct.title,
                image: updatedOrNewProduct.image,
                // Use lastSeenPrice from DB or the initially scraped one if available
                price: updatedOrNewProduct.lastSeenPrice || p.initialPrice || 'N/A',
                category: updatedOrNewProduct.category,
            });

        } catch (dbError) {
            console.error(`Error upserting product with link ${p.xerveLink}:`, dbError);
            // Decide if you want to skip this product or handle the error differently
        }
    }
    // --- End Save/Update products ---

    console.log(`${productsForResponse.length} products processed and saved/updated in DB.`);
    await browser.close();
    return productsForResponse; // Return the array for the API response

  } catch (error) {
      console.error(`Error during searchProducts for query "${query}":`, error);
      await browser.close(); // Ensure browser closes on error
      throw error; // Re-throw the error to be handled by the caller
  }
}

// --- Modified scrapeProductById ---
async function scrapeProductById(productId) {
  // Validate productId format (basic check)
  if (!mongoose.Types.ObjectId.isValid(productId)) {
       throw new Error("Invalid Product ID format.");
  }

  // --- Fetch Product from DB ---
  let product;
  try {
      product = await Product.findById(productId);
      if (!product) {
          throw new Error(`Product with ID ${productId} not found in database.`);
      }
      if (!product.xerveLink) {
          throw new Error(`Product with ID ${productId} is missing the Xerve link.`);
      }
  } catch (dbError) {
      console.error(`Database error fetching product ${productId}:`, dbError);
      throw dbError; // Propagate error
  }

  const productUrl = product.xerveLink; // Get URL from the DB document

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();

  try {
      await page.goto(productUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

      // Give page time to load dynamic content (may need adjustment)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Wait for price comparison section
      try {
          await page.waitForSelector(".s_mg", { timeout: 20000 }); // Increased timeout
      } catch(waitError) {
          console.warn(`Price comparison section '.s_mg' not found for ${productUrl}. Trying to extract anyway or might be out of stock.`);
          // Check for out-of-stock messages if possible, otherwise proceed cautiously
      }


      // --- Extract detailed product data ---
      const extractedDetails = await page.evaluate(() => {
          const cards = document.querySelectorAll(".s_mg");
          if (!cards.length) return null; // No price cards found

          const prices = [];
          let productTitle = document.querySelector('h1')?.innerText?.trim() || "N/A"; // Try getting title from H1
          let productImageURL = document.querySelector('.compare_product_section_img_image')?.src || document.querySelector('._pdp--image img')?.src || ""; // Try different selectors for main image
          let productSize = "N/A"; // Default size

          cards.forEach((card, index) => {
              // Seller Info
              const sellerLogoImg = card.querySelector(".contlistimage img");
              const sellerLogo = sellerLogoImg?.src || "N/A";
              const match = sellerLogo.match(/seller_logos\/([^/]+)\//);
              let sellerName = match?.[1] || "Unknown Seller"; // Default text
              if (sellerName === 'Unknown Seller' && sellerLogoImg?.alt) {
                  sellerName = sellerLogoImg.alt.replace(/ logo/i, '').trim(); // Try using alt text
              }

              // Price Info - Find closest price element to the seller logo/card
              const container = card.closest("._product--details") || card; // Find relevant container
              const rawPriceElement = container?.querySelector(".contentprice") || container?.querySelector(".price") ; // Look for different price selectors
              const rawPrice = rawPriceElement?.innerText.trim() || "N/A";
              const sizeElement = container?.querySelector("span._size.active"); // Check for active size if applicable
              const currentSize = sizeElement?.innerText.trim() || "N/A";
              const productLinkElement = container?.querySelector("input.alink_hide") || container?.querySelector("a[href*='redirect']"); // Find redirect link
              const productLink = productLinkElement?.value || productLinkElement?.href || "N/A";
              const outOfStockElement = container?.querySelector("._out--stock") || container?.querySelector(".out-of-stock"); // Check for OOS indicators

              let inStock = !outOfStockElement; // Assume in stock if no OOS element found
              if (rawPrice === "N/A" && !outOfStockElement) { // If price is missing but no explicit OOS, might still be OOS
                 // Heuristic: Often N/A price means OOS if not explicitly stated
                 // Keep inStock = true for now, but price parsing will handle it
              }
              if (rawPrice === "Notify Me") { // Explicit OOS indicator
                  inStock = false;
              }


              if (index === 0 && currentSize !== 'N/A') productSize = currentSize; // Capture size from first entry if available
              if (index === 0 && productTitle === 'N/A'){ // Try getting title from first card alt text if H1 failed
                   const imgTag = card.querySelector(".compare_product_section_img_image, img");
                   productTitle = imgTag?.getAttribute("alt") || imgTag?.getAttribute("title") || "N/A";
              }
              if (index === 0 && !productImageURL){ // Try getting image from first card if main selectors failed
                   const imgTag = card.querySelector(".compare_product_section_img_image, img");
                   productImageURL = imgTag?.getAttribute("data-src") || imgTag?.src || "";
              }


              let currentPrice = null, mrp = null, discount = null;

              if (rawPrice !== "N/A" && rawPrice !== "Notify Me") {
                  // Enhanced Price Parsing: Handles ₹, commas, ranges (use lowest), MRP, discount %
                  const priceNumbers = rawPrice.match(/₹?\s*([\d,]+(?:\.\d+)?)/g); // Find all currency amounts
                  const discountMatch = rawPrice.match(/(\d+)%\s*off/i);

                  if (priceNumbers) {
                      // Assume the first number is the current price
                      currentPrice = parseFloat(priceNumbers[0].replace(/₹|,|\s/g, ""));

                      // Look for a second, higher number as MRP
                      if (priceNumbers.length > 1) {
                          const potentialMrp = parseFloat(priceNumbers[1].replace(/₹|,|\s/g, ""));
                          if (potentialMrp > currentPrice) {
                              mrp = potentialMrp;
                          }
                      } else {
                           // If only one price and discount % exists, calculate MRP
                           if (discountMatch) {
                               const discountPercent = parseInt(discountMatch[1], 10);
                               if (discountPercent > 0 && discountPercent < 100) {
                                   mrp = Math.round(currentPrice / (1 - discountPercent / 100));
                               }
                           }
                      }
                  }
                  discount = discountMatch ? discountMatch[1] + "%" : null;

                  // If price parsing failed but we thought it was in stock, mark as not in stock
                  if(currentPrice === null) {
                      inStock = false;
                  }

              } else {
                  inStock = false; // Definitely out of stock if price is N/A or Notify Me
              }


              // Only add if we have a valid price or it's explicitly out of stock
              if (inStock || rawPrice === "Notify Me") {
                  prices.push({
                      retailer: sellerName,
                      price: currentPrice, // Can be null if OOS
                      mrp: mrp, // Can be null
                      discount: discount, // Can be null
                      url: productLink,
                      inStock: inStock,
                  });
              }
          });

          // Calculate stats based on *in-stock* prices only
          const inStockPrices = prices.filter(p => p.inStock && typeof p.price === 'number').map(p => p.price);
          const lowestPrice = inStockPrices.length ? Math.min(...inStockPrices) : null;
          const highestPrice = inStockPrices.length ? Math.max(...inStockPrices) : null;
          const averagePrice = inStockPrices.length
              ? parseFloat((inStockPrices.reduce((sum, val) => sum + val, 0) / inStockPrices.length).toFixed(2))
              : null;

          // Infer Category again based on potentially more accurate title from detail page
          function inferBroadCategory(title) {
               if (!title || title === 'N/A') return "Miscellaneous";
               const lower = title.toLowerCase();
               // Use the same categories as in searchProducts for consistency
               if (/(shirt|hoodie|jeans|t-shirt|kurta|dress|saree)/.test(lower)) return "Fashion";
               if (/(headphone|phone|mobile|laptop|earbud|watch|camera|tv|speaker)/.test(lower)) return "Electronics";
               if (/(sofa|mug|utensil|bedsheet|lamp|decor)/.test(lower)) return "Home & Kitchen";
               if (/(makeup|lipstick|skincare|foundation|perfume|fragrance)/.test(lower)) return "Beauty";
               if (/(book|novel|pen|notebook)/.test(lower)) return "Books & Stationary";
               if (/(toy|game|puzzle)/.test(lower)) return "Toys & Games";
               return "Miscellaneous";
          }
          const category = inferBroadCategory(productTitle);

          return {
              name: productTitle, // Use the more detailed name
              image: productImageURL || product.image, // Fallback to stored image
              size: productSize, // Store size if found
              category: category,
              prices, // Array of retailer prices
              lowestPrice,
              highestPrice,
              averagePrice,
          };
      });
      // --- End Extract detailed product data ---

      await browser.close();

      if (!extractedDetails) {
          console.warn(`No price details extracted from ${productUrl}. Product might be unavailable.`);
          // Update the DB to reflect that it couldn't be scanned successfully?
          await Product.findByIdAndUpdate(productId, { $set: { lastScanAttempt: new Date(), lastScanSuccess: false } });
          // Return the existing product data or throw an error? Decide based on desired behavior.
          // For now, return existing data but log warning.
          return product; // Return the data already in DB
      }

      // --- Update Product in MongoDB ---
      try {
          const updateData = {
              $set: {
                  title: extractedDetails.name !== "N/A" ? extractedDetails.name : product.title, // Update title if better one found
                  image: extractedDetails.image || product.image, // Update image if better one found
                  category: extractedDetails.category,
                  prices: extractedDetails.prices,
                  lowestPrice: extractedDetails.lowestPrice,
                  highestPrice: extractedDetails.highestPrice,
                  averagePrice: extractedDetails.averagePrice,
                  size: extractedDetails.size !== "N/A" ? extractedDetails.size : product.size, // Store size if found
                  lastScanAttempt: new Date(),
                  lastScanSuccess: true,
              },
              // Add the latest *lowest* price to the history, only if it's valid
              ...(extractedDetails.lowestPrice !== null && {
                  $push: {
                      priceHistory: {
                          $each: [{ price: extractedDetails.lowestPrice, date: new Date() }],
                          $slice: -20 // Keep only the latest 20 history points
                      }
                  }
              })
          };

          const updatedProduct = await Product.findByIdAndUpdate(
              productId,
              updateData,
              { new: true } // Return the updated document
          );
          console.log(`Product ${productId} updated successfully in DB.`);
          return updatedProduct; // Return the full updated product data

      } catch (dbError) {
          console.error(`Database error updating product ${productId}:`, dbError);
          throw dbError; // Propagate DB error
      }

  } catch (error) {
      console.error(`Error during scrapeProductById for product ID ${productId} (URL: ${productUrl}):`, error);
      await browser.close(); // Ensure browser closes on error
      // Optionally update DB to mark scan as failed
      await Product.findByIdAndUpdate(productId, { $set: { lastScanAttempt: new Date(), lastScanSuccess: false } }).catch(err => console.error("Failed to mark product scan as unsuccessful:", err));
      throw error; // Re-throw the error
  }
}

module.exports = { searchProducts, scrapeProductById };