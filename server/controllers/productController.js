// server/controllers/productController.js
import Product from "../models/Product.js";
import { scrapeProduct } from "../services/scrapeProduct.js";

// ✅ Add a new product (Simplified and Corrected)
export const addProduct = async (req, res) => {
  try {
    const { url, targetPrice, userEmail } = req.body;

    // Use the universal scraper for all sites. It will handle Walmart internally.
    const scrapedData = await scrapeProduct(url);

    if (!scrapedData || !scrapedData.title) {
      return res.status(400).json({ message: "Could not scrape product data from the provided URL." });
    }

    const product = new Product({
      url,
      targetPrice,
      userEmail,
      currentPrice: scrapedData.price || null,
      title: scrapedData.title,
      image: scrapedData.image || null,
      lastChecked: new Date(),
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Add Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all products (No changes needed here)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Get Products Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};