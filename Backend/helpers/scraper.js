const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { v4: uuidv4 } = require("uuid");

puppeteer.use(StealthPlugin());

const productMap = {}; // Maps internal productId -> Xerve URL

async function searchProducts(query) {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  const encodedQuery = encodeURIComponent(query);

  await page.goto(`https://www.xerve.in/prices?q=${encodedQuery}`, { waitUntil: "domcontentloaded" });

  const products = await page.evaluate(() => {
    const quoteNodes = document.querySelectorAll("._tile_container");
    const imgNodes = document.querySelectorAll(".St-Img-M img");

    return Array.from(quoteNodes).map((quote, index) => {
      const link = `https://www.xerve.in${quote.querySelector("a")?.getAttribute("href")}`;
      const title = quote.querySelector("h3")?.innerText;
      const src = imgNodes[index]?.getAttribute("src");
      return { link, title, src };
    }).filter(item => item.link && item.title && item.src);
  });

  await browser.close();

  // Map results to UUIDs
  return products.map(product => {
    const id = uuidv4();
    productMap[id] = product.link;
    return { id, title: product.title, image: product.src };
  });
}

async function scrapeProductById(productId) {
  const productUrl = productMap[productId];
  if (!productUrl) throw new Error("Invalid or expired product ID.");

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();

  await page.goto(productUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".s_mg", { timeout: 10000 });

  const productDetails = await page.evaluate(() => {
    const cards = document.querySelectorAll(".s_mg");
    if (!cards.length) return null;

    function inferBroadCategory(title) {
      const lower = title.toLowerCase();
      if (/(shirt|hoodie|jeans)/.test(lower)) return "Fashion";
      if (/(headphone|mobile|laptop)/.test(lower)) return "Electronics";
      if (/(sofa|mug|utensil)/.test(lower)) return "Home & Kitchen";
      if (/(makeup|lipstick|skincare)/.test(lower)) return "Beauty";
      return "Miscellaneous";
    }

    const prices = [];
    let productTitle = "N/A";
    let productImageURL = "";
    let productSize = "N/A";

    cards.forEach((card, index) => {
      const imgTag = card.querySelector(".compare_product_section_img_image, img");
      const imgSrc = imgTag?.getAttribute("data-src") || imgTag?.src || "";
      const title = imgTag?.getAttribute("alt") || imgTag?.getAttribute("title") || "N/A";

      if (index === 0) {
        productTitle = title;
        productImageURL = imgSrc;
      }

      const sellerLogoImg = card.querySelector(".contlistimage img");
      const sellerLogo = sellerLogoImg?.src || "N/A";
      const match = sellerLogo.match(/seller_logos\/([^/]+)\//);
      const sellerName = match?.[1] || "Unknown";

      const container = card.closest("._product--details") || card.parentElement;
      const rawPrice = container?.querySelector(".contentprice")?.innerText.trim() || "N/A";
      const size = container?.querySelector("span._size.active")?.innerText.trim() || "N/A";
      if (index === 0 && size) productSize = size;

      const productLink = container?.querySelector("input.alink_hide")?.value || "N/A";

      let currentPrice = "N/A", mrp = "Not found", discount = "N/A";
      if (rawPrice !== "N/A") {
        const numbers = rawPrice.match(/\d[\d,]*/g);
        const discountMatch = rawPrice.match(/(\d+)%/);
        if (numbers) {
          currentPrice = parseFloat(numbers[0].replace(/,/g, ""));
          mrp = numbers[1] ? parseFloat(numbers[1].replace(/,/g, "")) : "Not found";
        }
        discount = discountMatch ? discountMatch[1] + "%" : "N/A";
      }

      prices.push({
        retailer: sellerName,
        price: currentPrice,
        mrp,
        discount,
        url: productLink,
        inStock: true
      });
    });

    const numericPrices = prices.map(p => p.price).filter(p => typeof p === "number");
    const lowestPrice = Math.min(...numericPrices);
    const highestPrice = Math.max(...numericPrices);
    const averagePrice = (numericPrices.reduce((sum, val) => sum + val, 0) / numericPrices.length).toFixed(2);

    return {
      id: productId,
      name: productTitle,
      image: productImageURL,
      size: productSize,
      category: inferBroadCategory(productTitle),
      prices,
      lowestPrice,
      highestPrice,
      averagePrice,
      priceHistory: []
    };
  });

  await browser.close();
  return productDetails;
}

module.exports = { searchProducts, scrapeProductById };