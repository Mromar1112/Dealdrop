import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes); // ✅ all product routes prefixed

app.get("/", (req, res) => {
  res.send("✅ Price Tracker API running...");
});

export default app;
