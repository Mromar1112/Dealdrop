// server/jobs/priceChecker.js
import cron from "node-cron";
import Product from "../models/Product.js";
import { scrapeProduct } from "../services/scrapeProduct.js";
import { sendEmail } from "../utils/sendEmail.js";

const checkPrices = async () => {
  try {
    const products = await Product.find();
    console.log(`🔍 Checking prices for ${products.length} products...`);

    for (let product of products) {
      console.log(`➡️ Scraping: ${product.url}`);

      const scrapedData = await scrapeProduct(product.url);

      if (!scrapedData || scrapedData.price === null) {
        console.warn(`⚠️ Skipped: could not scrape ${product.url}`);
        continue;
      }

      console.log(
        `✅ Found: ${scrapedData.title} @ ₹${scrapedData.price} (target ₹${product.targetPrice})`
      );

      // --- LOGIC CHANGED AS REQUESTED ---
      // 📧 Send email if target price is LESS THAN current price
      if (product.targetPrice <=scrapedData.price) {
        await sendEmail(
          product.userEmail,
          "Price Alert: Item is Above Your Target Price", // Changed subject
          `The price for ${scrapedData.title || product.title} is currently ₹${scrapedData.price}, which is above your target of ₹${product.targetPrice}.` // Changed message
        );
        console.log(`📨 Email sent to ${product.userEmail}`);
      }

      // 🔄 Update product with latest info
      product.currentPrice = scrapedData.price;
      product.title = scrapedData.title || product.title;
      product.image = scrapedData.image || product.image;
      product.lastChecked = new Date();

      await product.save();
      console.log(`💾 Updated DB for ${scrapedData.title}`);
    }
  } catch (err) {
    console.error("❌ Error in checkPrices:", err.message);
  }
};

// Schedule job: runs every hour
cron.schedule("0 * * * *", checkPrices);

// Run once at startup
(async () => {
  console.log("🚀 Scheduling price checks and running initial check...");
  await checkPrices();
})();