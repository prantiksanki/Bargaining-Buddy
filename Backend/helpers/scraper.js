const puppeteer = require('puppeteer');

/**
 * Scrapes product prices from Xerve.in based on the given search query.
 * @param {string} productName - The name of the product to search for.
 * @returns {Promise<Array>} - A list of product details including title, price, link, and image.
 */
async function scrapeProductPrices(productName) {
    const encodedQuery = encodeURIComponent(productName);
    const url = `https://www.xerve.in/prices/s-mobiles?q={${encodedQuery}}`;
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log(`🔍 Searching for "${productName}" on Xerve.in...`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait for product tiles to load
        await page.waitForSelector('._tile_container', { timeout: 15000 });

        const products = await page.evaluate(() => {
            const productNodes = document.querySelectorAll('._tile_container');
            const productList = [];

            productNodes.forEach(node => {
                const titleElement = node.querySelector('.product-title-selector'); // Replace with actual selector
                const priceElement = node.querySelector('.product-price-selector'); // Replace with actual selector
                const linkElement = node.querySelector('a'); // Assuming link is in <a> tag
                const imageElement = node.querySelector('.product-image-selector img'); // Replace with actual selector

                const title = titleElement ? titleElement.innerText.trim() : null;
                const price = priceElement ? priceElement.innerText.replace('₹', '').replace(',', '').trim() : null;
                const link = linkElement ? linkElement.href : null;
                const imageUrl = imageElement ? imageElement.src : null;

                if (title && price && link && imageUrl) {
                    productList.push({ title, price: parseFloat(price), link, imageUrl });
                }
            });

            return productList;
        });

        console.log(`✅ Found ${products.length} products for "${productName}"`);
        return products;
    } catch (error) {
        console.error(`❌ Error scraping Xerve.in: ${error.message}`);
        return [];
    } finally {
        await browser.close();
    }
}


module.exports = {
    scrapeProductPrices
};