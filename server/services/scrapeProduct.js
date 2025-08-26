// server/services/scrapeProduct.js
import { scrapeAmazon } from "./amazonScraper.js";

import { scrapeMyntra } from "./myntraScraper.js";
import { scrapeBigBasket } from "./bigbasketScraper.js";
import { scrapeWalmart } from "./walmartScraper.js";

export async function scrapeProduct(url) {
  try {
    if (url.includes("amazon")) return await scrapeAmazon(url);
   
    if (url.includes("myntra")) return await scrapeMyntra(url);
    if (url.includes("bigbasket")) return await scrapeBigBasket(url);
    if (url.includes("walmart")) return await scrapeWalmart(url);

    return { title: null, price: null, image: null };
  } catch (err) {
    console.error("scrapeProduct error:", err.message);
    return { title: null, price: null, image: null };
  }
}
