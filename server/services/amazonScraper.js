// server/services/amazonScraper.js
import puppeteer from "puppeteer";

export async function scrapeAmazon(url) {
  let browser;
  try {
    // Launch a headless browser instance
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set a realistic User-Agent to mimic a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate to the Amazon product page
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Wait for the main price element to ensure the page is loaded
    await page.waitForSelector('.a-price-whole', { timeout: 15000 });

    // Execute script in the browser context to extract data
    const scrapedData = await page.evaluate(() => {
      // --- Helper function to clean and convert price text ---
      const getPrice = (element) => {
        if (!element) return null;
        // Removes currency symbols, commas, and decimal points for a clean number
        const priceText = element.textContent.replace(/[₹,.]/g, "").trim();
        return Number(priceText);
      };

      // --- Extract Title ---
      // Amazon's main product title is usually in an h1 tag with id 'productTitle'
      const title = document.querySelector('#productTitle')?.textContent.trim() || null;

      // --- Extract Price ---
      // The main price is often in a span with the class 'a-price-whole'
      const priceElement = document.querySelector('.a-price-whole');
      const price = getPrice(priceElement);

      // --- Extract Image ---
      // The primary product image is usually inside this specific div
      const image = document.querySelector('#imgTagWrapperId img')?.src ||
                    document.querySelector('meta[property="og:image"]')?.content || // Fallback to meta tag
                    null;

      return { title, price, image };
    });

    console.log("✅ Scraped Amazon:", scrapedData);
    return scrapedData;

  } catch (err) {
    console.error("❌ Amazon scrape error:", err.message);
    // Return a standard null object on failure
    return { title: null, price: null, image: null };
  } finally {
    // Ensure the browser is always closed
    if (browser) {
      await browser.close();
    }
  }
}