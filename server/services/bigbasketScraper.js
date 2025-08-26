// server/services/bigbasketScraper.js
import puppeteer from "puppeteer";

export async function scrapeBigBasket(url) {
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

    // ✅ Wait for body (guaranteed)
    await page.waitForSelector("body", { timeout: 20000 });

    const scrapedData = await page.evaluate(() => {
      const getText = (el) =>
        el ? el.textContent.trim().replace(/\s+/g, " ") : "";

      // ---------- TITLE ----------
      let title =
        document.querySelector("h1")?.textContent.trim() ||
        document.querySelector('meta[property="og:title"]')?.content ||
        "";

      // ---------- PRICE ----------
      let prices = [];
      const candidates = Array.from(document.querySelectorAll("span, div, strong"));
      for (const el of candidates) {
        let txt = getText(el);
        if (txt.includes("₹")) {
          let match = txt.match(/₹\s*([\d,.]+)/);
          if (match) {
            let val = Number(match[1].replace(/,/g, ""));
            if (!isNaN(val)) prices.push(val);
          }
        }
      }

      // Pick the lowest valid price (discounted price)
      let price = prices.length > 0 ? Math.min(...prices) : null;

      // ---------- IMAGE ----------
      let image =
        document.querySelector('meta[property="og:image"]')?.content ||
        document.querySelector("img")?.src ||
        null;

      return { title, price, image };
    });

    if (!scrapedData.price) {
      console.warn("⚠️ BigBasket: Price still not found, may need class-specific selector");
    }

    console.log("✅ Scraped BigBasket:", scrapedData);
    return scrapedData;
  } catch (err) {
    console.error("❌ BigBasket scrape error:", err.message);
    return { title: null, price: null, image: null };
  } finally {
    if (browser) await browser.close();
  }
}
