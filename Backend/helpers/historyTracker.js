const puppeteer = require('puppeteer');

async function runPuppeteerCode(productLink) {
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see browser actions
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto('https://pricehistory.app/', { waitUntil: 'networkidle2' });

  // Type in the search input
  await page.type('#search', productLink);
  await page.keyboard.press('Enter');

  // Wait for price info to appear
  await page.waitForSelector('.all-time-price-overview', { timeout: 55000 });

  // Extract the text content
  const result = await page.evaluate(() => {
    const element = document.querySelector('.all-time-price-overview');
    return element ? element.innerText.split('\n') : [];
  });

  await browser.close();
  return result;
}

// Example usage:
(async () => {
  const productUrl = 'Iphone 15'; // example
  const resultArray = await runPuppeteerCode(productUrl);
  console.log(resultArray);
})();