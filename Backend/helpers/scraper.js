const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { v4: uuidv4 } = require("uuid");

puppeteer.use(StealthPlugin());

const productMap = {}; // Maps internal productId -> Xerve URL

async function searchProducts(query) {
  const browser = await puppeteer.launch({ headless: false, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  const encodedQuery = encodeURIComponent(query);

  await page.goto(`https://www.xerve.in/prices?q=${encodedQuery}`, { waitUntil: "domcontentloaded" });


  const recaptchaButton = await page.$(".g-recaptcha");
  if (recaptchaButton) {
    await page.reload({ waitUntil: "domcontentloaded" });
  } else {

    const startButton = await page.$x("//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'start')]");
    if (startButton.length > 0) {
      await startButton[0].click();
      await page.reload({ waitUntil: "domcontentloaded" });
    }
  }
  let products = await page.evaluate(() => {
    // scroll a bit to capture lazy-loaded images
    let scrollHeight = 0;
    let scrollStep = 100;
    let scrollInterval = setInterval(() => {
      window.scrollBy(0, scrollStep);
      scrollHeight += scrollStep;
      if (scrollHeight >= document.body.scrollHeight) {
        clearInterval(scrollInterval);
      }
    }, 100);
    // wait for lazy loading to finish
    new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(scrollInterval);
        resolve(document.querySelectorAll("._tile_container"));
      }, 2000);
    })
    const quoteNodes = document.querySelectorAll("._tile_container");
    const imgNodes = document.querySelectorAll(".St-Img-M img");


    return Array.from(quoteNodes).map((quote, index) => {
      const link = `https://www.xerve.in${quote.querySelector("a")?.getAttribute("href")}`;
      const title = quote.querySelector("h3")?.innerText;
      const price = quote.querySelector("h4")?.innerText.trim().replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ");
      function inferBroadCategory(title) {
        const lower = title.toLowerCase();
        if (/(shirt|hoodie|jeans)/.test(lower)) return "Fashion";
        if (/(headphone|phone|mobile|laptop)/.test(lower)) return "Electronics";
        if (/(sofa|mug|utensil)/.test(lower)) return "Home & Kitchen";
        if (/(makeup|lipstick|skincare)/.test(lower)) return "Beauty";
        return "Miscellaneous";
      }
      const category = inferBroadCategory(title);
      if (!category) category = "Miscellaneous";
      let src = imgNodes[index]?.getAttribute("src");
      return { link, title, price, category, src };
    }).filter(item => item.link && item.title && item.src && item.price && item.category);
  });

  products = Array.from(products).filter(product => !product.src.endsWith("rsz_blank_grey.jpg"));
  Object.keys(productMap).forEach(key => delete productMap[key]);

  // await browser.close();

  // Map results to UUIDs

  console.log(products)
  return products.map(product => {
    const id = uuidv4();
    productMap[id] = product.link;
    return { id, title: product.title, image: product.src, price: product.price, category: product.category };
  })
}

async function scrapeProductById(productId) {
  console.log(productId)
  const productUrl = productMap[productId];
  if (!productUrl) throw new Error("Invalid or expired product ID.");

  const browser = await puppeteer.launch({ headless: false, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();

  await page.goto(productUrl, { waitUntil: "domcontentloaded" });

  setTimeout(() => {}, 3000); // Wait for 5 seconds to allow the page to load
  await page.waitForSelector(".s_mg", { timeout: 10000 });

  const productDetails = await page.evaluate(() => {
    const cards = document.querySelectorAll(".s_mg");
    if (!cards.length) return null;

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
      let inStock = true;
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

      if (mrp === "Not found" && discount == "N/A") {
        inStock = false;
      }

      prices.push({
        retailer: sellerName,
        price: currentPrice,
        mrp,
        discount,
        url: productLink,
        inStock: inStock
      });
    });

    const numericPrices = prices.map(p => p.price).filter(p => typeof p === "number");
    const lowestPrice = Math.min(...numericPrices);
    const highestPrice = Math.max(...numericPrices);
    const averagePrice = (numericPrices.reduce((sum, val) => sum + val, 0) / numericPrices.length).toFixed(2);
    console.log(lowestPrice, highestPrice, averagePrice)

    function inferBroadCategory(title) {
  const lower = title.toLowerCase();
  if (/(shirt|hoodie|jeans)/.test(lower)) return "Fashion";
  if (/(headphone|phone|mobile|laptop)/.test(lower)) return "Electronics";
  if (/(sofa|mug|utensil)/.test(lower)) return "Home & Kitchen";
  if (/(makeup|lipstick|skincare)/.test(lower)) return "Beauty";
  return "Miscellaneous";
}

    return {
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