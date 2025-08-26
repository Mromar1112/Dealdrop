
import dotenv from "dotenv";


dotenv.config();

import app from "./app.js";
import mongoose from "mongoose";


import "./jobs/priceChecker.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; 

// Connect MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});