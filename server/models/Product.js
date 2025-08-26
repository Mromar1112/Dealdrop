import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  url: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  userEmail: { type: String, required: true },
  currentPrice: { type: Number },
  title: { type: String },
  image: { type: String },
  lastChecked: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
