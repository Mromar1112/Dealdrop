// server/services/myntraScraper.js
import puppeteer from "puppeteer";

export async function scrapeMyntra(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // ✅ Wait until at least one price container loads
    await page.waitForSelector("span.pdp-price, span.pdp-discount-price, span.pdp-final-price", {
      timeout: 10000,
    });

    // ✅ Extract details
    const scrapedData = await page.evaluate(() => {
      // Title (brand + product name)
      let brand = document.querySelector("h1.pdp-title")?.textContent.trim() || "";
      let name = document.querySelector("h1.pdp-name")?.textContent.trim() || "";
      let title = `${brand} ${name}`.trim();

      // Price candidates
      let priceText =
        document.querySelector("span.pdp-price strong")?.textContent ||
        document.querySelector("span.pdp-price")?.textContent ||
        document.querySelector("span.pdp-discount-price")?.textContent ||
        document.querySelector("span.pdp-final-price")?.textContent ||
        null;

      // Fallback → find any ₹ number in body
      if (!priceText) {
        let bodyText = document.body.innerText;
        let match = bodyText.match(/₹\s?[\d,]+/);
        if (match) priceText = match[0];
      }

      let price = priceText
        ? Number(priceText.replace(/[₹,]/g, "").replace(/\s/g, ""))
        : null;

      // Image (prefer og:image)
      let image =
        document.querySelector('meta[property="og:image"]')?.content ||
        document.querySelector("img.pdp-image")?.src ||
        document.querySelector("div.image-grid img")?.src ||
        null;

      return { title, price, image };
    });

    if (!scrapedData.price) {
      console.warn("⚠️ Myntra: Price still not found, might need selector update");
    }

    return scrapedData;
  } catch (err) {
    console.error("Myntra scrape error:", err.message);
    return { title: null, price: null, image: null };
  } finally {
    if (browser) await browser.close();
  }
}
