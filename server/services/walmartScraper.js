// server/services/walmartScraper.js
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Apply the stealth plugin to make puppeteer behave more like a real user
puppeteer.use(StealthPlugin());

// Centralized exchange rate
const USD_TO_INR = 87.03;

export async function scrapeWalmart(url) {
  let browser;
  try {
    console.log("🚀 Launching stealth browser for Walmart...");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    
    // Set a realistic viewport and user agent
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    console.log(`➡️ Navigating to Walmart URL: ${url}`);
    // Change wait condition to 'domcontentloaded' for faster initial load
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Wait specifically for the price element, which is a better indicator of a loaded page
    console.log("...Waiting for product price element to appear...");
    await page.waitForSelector("span[itemprop='price']", { timeout: 20000 });
    console.log("✅ Product price element found!");

    const scrapedData = await page.evaluate(() => {
      const title =
        document.querySelector("h1[itemprop='name']")?.textContent.trim() ||
        document.querySelector("meta[property='og:title']")?.content ||
        null;

      let priceText =
        document.querySelector("span[itemprop='price']")?.textContent.trim() ||
        null;

      let priceUSD = null;
      if (priceText) {
        const match = priceText.match(/[\d,.]+/);
        if (match) priceUSD = Number(match[0].replace(/,/g, ""));
      }

      let image =
        document.querySelector("meta[property='og:image']")?.content ||
        document.querySelector('img[data-testid="main-image"]')?.src ||
        null;

      return { title, priceUSD, image };
    });

    // Perform the conversion to INR here for consistency
    const priceINR =
      scrapedData.priceUSD != null
        ? Math.round(scrapedData.priceUSD * USD_TO_INR)
        : null;

    const finalData = {
      title: scrapedData.title,
      price: priceINR, // The final price is always in INR
      image: scrapedData.image,
    };
    
    console.log("✅ Scraped Walmart:", finalData);
    return finalData;

  } catch (err) {
    console.error("❌ Walmart scrape error:", err.message);
    return { title: null, price: null, image: null };
  } finally {
    if (browser) {
      console.log(" closing stealth browser.");
      await browser.close();
    }
  }
}